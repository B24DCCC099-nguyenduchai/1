# routers/auth.py  ← copy đè hết
from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ĐĂNG KÝ (có email)
@router.post("/register")
def register(
    username: str,
    password: str,
    fullname: str,
    email: str = "",           # ← bắt buộc gửi từ frontend
    role: str = "staff",
    conn=Depends(get_db)
):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
    if cursor.fetchone():
        raise HTTPException(400, "Tên đăng nhập đã tồn tại!")

    hashed = pwd_context.hash(password)
    cursor.execute("""
        INSERT INTO users (username, fullname, email, password_hash, role)
        VALUES (%s, %s, %s, %s, %s)
    """, (username, fullname, email, hashed, role))
    conn.commit()
    return {"message": "Đăng ký thành công!"}

# ĐĂNG NHẬP (không đổi)
@router.post("/login")
def login(username: str, password: str, conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    if not user or not pwd_context.verify(password, user['password_hash']):
        raise HTTPException(401, "Sai tên đăng nhập hoặc mật khẩu!")

    return {
        "message": "Đăng nhập thành công",
        "user": {
            "id": user['id'],
            "username": user['username'],
            "fullname": user['fullname'],
            "email": user['email'] or "",
            "role": user['role']
        }
    }