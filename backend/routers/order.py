from fastapi import APIRouter, Depends, HTTPException
from database import get_db
import datetime, random, string

router = APIRouter()

def generate_ma_don():
    return "DH" + datetime.datetime.now().strftime("%Y%m%d") + ''.join(random.choices(string.digits, k=4))

@router.get("/")
def get_orders(conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT o.*, c.ho_ten AS khach_hang, c.dien_thoai
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.id DESC
    """)
    orders = cursor.fetchall()
    for o in orders:
        cursor.execute("SELECT product_id, so_luong, gia_ban FROM order_items WHERE order_id=%s", (o['id'],))
        o['chi_tiet'] = cursor.fetchall()
    return orders

@router.post("/")
def create_order(data: dict, conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)
    customer_id = data.get("customer_id")
    chi_tiet = data.get("chi_tiet", [])

    if not customer_id:
        raise HTTPException(status_code=400, detail="Vui lòng chọn khách hàng")
    if not chi_tiet:
        raise HTTPException(status_code=400, detail="Chưa có sản phẩm nào")

    tong_tien = 0
    # Kiểm tra tồn kho + tính tổng tiền
    for item in chi_tiet:
        cursor.execute("SELECT ten_sp, gia_ban, so_luong_ton FROM products WHERE id=%s", (item['product_id'],))
        sp = cursor.fetchone()
        if not sp:
            raise HTTPException(status_code=404, detail=f"Sản phẩm ID {item['product_id']} không tồn tại")
        if sp['so_luong_ton'] < item['so_luong']:
            raise HTTPException(status_code=400, detail=f"{sp['ten_sp']} chỉ còn {sp['so_luong_ton']} - không đủ hàng!")
        tong_tien += sp['gia_ban'] * item['so_luong']

    ma_don = generate_ma_don()
    cursor.execute("""
        INSERT INTO orders (ma_don, customer_id, tong_tien, ngay_mua, trang_thai)
        VALUES (%s,%s,%s,NOW(),'Chờ giao')
    """, (ma_don, customer_id, tong_tien))
    order_id = cursor.lastrowid

    # Thêm chi tiết + giảm tồn kho
    for item in chi_tiet:
        cursor.execute("SELECT gia_ban FROM products WHERE id=%s", (item['product_id'],))
        gia_ban = cursor.fetchone()['gia_ban']
        cursor.execute("""
            INSERT INTO order_items (order_id, product_id, so_luong, gia_ban)
            VALUES (%s,%s,%s,%s)
        """, (order_id, item['product_id'], item['so_luong'], gia_ban))
        cursor.execute("UPDATE products SET so_luong_ton = so_luong_ton - %s WHERE id=%s",
                       (item['so_luong'], item['product_id']))

    conn.commit()
    return {"message": "Tạo đơn hàng thành công", "ma_don": ma_don}
