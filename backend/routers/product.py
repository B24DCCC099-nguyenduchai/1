""" from fastapi import APIRouter, Depends, HTTPException
from database import get_db

router = APIRouter()

@router.get("/")
def get_products(conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products ORDER BY id DESC")
    return cursor.fetchall()

@router.post("/")
def create_product(product: dict, conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO products (ma_sp, ten_sp, gia_ban, don_vi) VALUES (%s,%s,%s,%s)",
        (product['ma_sp'], product['ten_sp'], product['gia_ban'], product.get('don_vi', 'Vỉ'))
    )
    conn.commit()
    return {"message": "Thêm sản phẩm thành công"}

@router.put("/{product_id}")
def update_product(product_id: int, product: dict, conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id=%s", (product_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    cursor.execute(
        "UPDATE products SET ma_sp=%s, ten_sp=%s, gia_ban=%s, don_vi=%s WHERE id=%s",
        (product['ma_sp'], product['ten_sp'], product['gia_ban'], product.get('don_vi','Vỉ'), product_id)
    )
    conn.commit()
    return {"message": "Cập nhật sản phẩm thành công"}

@router.delete("/{product_id}")
def delete_product(product_id: int, conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id=%s", (product_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    cursor.execute("DELETE FROM products WHERE id=%s", (product_id,))
    conn.commit()
    return {"message": "Xóa sản phẩm thành công"} """
    
    








# product.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_db
from mysql.connector import IntegrityError

router = APIRouter()

class ProductCreate(BaseModel):
    ma_sp: str
    ten_sp: str
    gia_ban: float
    don_vi: str = 'Vỉ'

@router.get("/")
def get_products(conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products ORDER BY id DESC")
    rows = cursor.fetchall()
    cursor.close()
    return rows

@router.post("/")
def create_product(product: ProductCreate, conn=Depends(get_db)):
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO products (ma_sp, ten_sp, gia_ban, don_vi) VALUES (%s,%s,%s,%s)",
            (product.ma_sp, product.ten_sp, product.gia_ban, product.don_vi)
        )
        conn.commit()
        cursor.close()
        return {"message": "Thêm sản phẩm thành công"}
    except IntegrityError:
        cursor.close()
        raise HTTPException(status_code=400, detail="Mã sản phẩm đã tồn tại")

@router.put("/{product_id}")
def update_product(product_id: int, product: ProductCreate, conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id=%s", (product_id,))
    if not cursor.fetchone():
        cursor.close()
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    try:
        cursor.execute(
            "UPDATE products SET ma_sp=%s, ten_sp=%s, gia_ban=%s, don_vi=%s WHERE id=%s",
            (product.ma_sp, product.ten_sp, product.gia_ban, product.don_vi, product_id)
        )
        conn.commit()
        cursor.close()
        return {"message": "Cập nhật sản phẩm thành công"}
    except IntegrityError:
        cursor.close()
        raise HTTPException(status_code=400, detail="Mã sản phẩm đã tồn tại")

@router.delete("/{product_id}")
def delete_product(product_id: int, conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id=%s", (product_id,))
    if not cursor.fetchone():
        cursor.close()
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    cursor.execute("DELETE FROM products WHERE id=%s", (product_id,))
    conn.commit()
    cursor.close()
    return {"message": "Xóa sản phẩm thành công"}


    
    
    
    
