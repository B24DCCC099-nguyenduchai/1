from fastapi import APIRouter, Depends, HTTPException
from database import get_db
import mysql.connector

router = APIRouter()

@router.get("/")
def get_customers(conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM customers ORDER BY id DESC")
    customers = cursor.fetchall()
    return customers

@router.post("/")
def create_customer(customer: dict, conn=Depends(get_db)):
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO customers (ma_kh, ho_ten, dien_thoai, dia_chi, email)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            customer['ma_kh'],
            customer['ho_ten'],
            customer['dien_thoai'],
            customer.get('dia_chi'),
            customer.get('email')
        ))
        conn.commit()
        return {"message": "Thêm khách hàng thành công"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=str(err))

@router.put("/{customer_id}")
def update_customer(customer_id: int, customer: dict, conn=Depends(get_db)):
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE customers SET ma_kh=%s, ho_ten=%s, dien_thoai=%s, 
            dia_chi=%s, email=%s WHERE id=%s
        """, (
            customer['ma_kh'],
            customer['ho_ten'],
            customer['dien_thoai'],
            customer.get('dia_chi'),
            customer.get('email'),
            customer_id
        ))
        conn.commit()
        return {"message": "Cập nhật thành công"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=str(err))

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, conn=Depends(get_db)):
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM customers WHERE id = %s", (customer_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
        conn.commit()
        return {"message": "Xóa thành công"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))