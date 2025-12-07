# # routers/auth.py  ← copy đè hết
# from fastapi import APIRouter, Depends, HTTPException
# from passlib.context import CryptContext
# from database import get_db

# router = APIRouter(prefix="/auth", tags=["auth"])
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # ĐĂNG KÝ (có email)
# @router.post("/register")
# def register(
#     username: str,
#     password: str,
#     fullname: str,
#     email: str = "",           # ← bắt buộc gửi từ frontend
#     role: str = "staff",
#     conn=Depends(get_db)
# ):
#     cursor = conn.cursor()
#     cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
#     if cursor.fetchone():
#         raise HTTPException(400, "Tên đăng nhập đã tồn tại!")

#     hashed = pwd_context.hash(password)
#     cursor.execute("""
#         INSERT INTO users (username, fullname, email, password_hash, role)
#         VALUES (%s, %s, %s, %s, %s)
#     """, (username, fullname, email, hashed, role))
#     conn.commit()
#     return {"message": "Đăng ký thành công!"}

# # ĐĂNG NHẬP (không đổi)
# @router.post("/login")
# def login(username: str, password: str, conn=Depends(get_db)):
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
#     user = cursor.fetchone()

#     if not user or not pwd_context.verify(password, user['password_hash']):
#         raise HTTPException(401, "Sai tên đăng nhập hoặc mật khẩu!")

#     return {
#         "message": "Đăng nhập thành công",
#         "user": {
#             "id": user['id'],
#             "username": user['username'],
#             "fullname": user['fullname'],
#             "email": user['email'] or "",
#             "role": user['role']
#         }
#     }














# routers/auth.py
# from fastapi import APIRouter, HTTPException, Depends
# from pydantic import BaseModel
# from passlib.context import CryptContext
# from database import get_db  # MySQL connection
# import mysql.connector

# router = APIRouter()
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# class LoginModel(BaseModel):
#     username: str
#     password: str

# class RegisterModel(BaseModel):
#     username: str
#     password: str
#     fullname: str
#     email: str

# # Login
# @router.post("/login")
# def login(data: LoginModel, conn=Depends(get_db)):
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM users WHERE username=%s", (data.username,))
#     user = cursor.fetchone()
#     cursor.close()

#     if not user or not pwd_context.verify(data.password, user["password_hash"]):
#         raise HTTPException(status_code=401, detail="Tên đăng nhập hoặc mật khẩu sai")

#     return {
#         "message": "Đăng nhập thành công",
#         "user": {
#             "username": user["username"],
#             "fullname": user["fullname"],
#             "email": user["email"],
#             "role": user["role"]
#         }
#     }

# # Register
# @router.post("/register")
# def register(data: RegisterModel, conn=Depends(get_db)):
#     cursor = conn.cursor()
#     hashed = pwd_context.hash(data.password)
#     try:
#         cursor.execute(
#             "INSERT INTO users (username, fullname, email, password_hash) VALUES (%s,%s,%s,%s)",
#             (data.username, data.fullname, data.email, hashed)
#         )
#         conn.commit()
#     except mysql.connector.IntegrityError:
#         raise HTTPException(status_code=400, detail="Username đã tồn tại")
#     finally:
#         cursor.close()
#     return {"message": "Đăng ký thành công"}











from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from jose import jwt
import datetime
from database import get_db

router = APIRouter(tags=["auth"])

SECRET_KEY = "MY_SECRET_KEY_123"
ALGORITHM = "HS256"


# ==== MODELS ====
class LoginModel(BaseModel):
    username: str
    password: str

class RegisterModel(BaseModel):
    username: str
    password: str
    fullname: str
    email: str = ""
    role: str = "staff"


# ==== TẠO TOKEN ====
def create_access_token(data: dict):
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


# ==== REGISTER ====
@router.post("/register")
def register(data: RegisterModel, conn=Depends(get_db)):
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE username = %s", (data.username,))
    if cursor.fetchone():
        raise HTTPException(400, "Tên đăng nhập đã tồn tại!")

    # ❌ Không hash nữa — lưu trực tiếp
    cursor.execute("""
        INSERT INTO users (username, fullname, email, password, role)
        VALUES (%s, %s, %s, %s, %s)
    """, (data.username, data.fullname, data.email, data.password, data.role))

    conn.commit()
    return {"message": "Đăng ký thành công!"}


# ==== LOGIN ====
@router.post("/login")
def login(data: LoginModel, conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username = %s", (data.username,))
    user = cursor.fetchone()

    if not user:
        raise HTTPException(401, "Sai tên đăng nhập hoặc mật khẩu!")

    # ❌ Bỏ bcrypt → so sánh trực tiếp
    if data.password != user["password"]:
        raise HTTPException(401, "Sai tên đăng nhập hoặc mật khẩu!")

    # tạo token
    token = create_access_token({
        "id": user["id"],
        "username": user["username"],
        "role": user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "fullname": user["fullname"],
            "email": user.get("email", ""),
            "role": user["role"]
        }
    }
