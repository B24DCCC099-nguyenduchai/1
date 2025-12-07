# # routers/dashboard.py
# from fastapi import APIRouter, Depends
# from database import get_db

# router = APIRouter()

# @router.get("/")
# def get_dashboard(conn=Depends(get_db)):
#     cursor = conn.cursor(dictionary=True)
#     try:
#         # Tổng số sản phẩm
#         cursor.execute("SELECT COUNT(*) AS total FROM products")
#         totalProducts = cursor.fetchone()['total']

#         # Đơn hàng hôm nay
#         cursor.execute("""
#             SELECT COUNT(*) AS today_orders
#             FROM orders
#             WHERE DATE(ngay_mua) = CURDATE()
#         """)
#         ordersToday = cursor.fetchone()['today_orders']

#         # Doanh thu tháng này
#         cursor.execute("""
#             SELECT SUM(tong_tien) AS monthly_revenue
#             FROM orders
#             WHERE MONTH(ngay_mua) = MONTH(CURDATE())
#             AND YEAR(ngay_mua) = YEAR(CURDATE())
#         """)
#         monthlyRevenue = cursor.fetchone()['monthly_revenue'] or 0

#         # Sản phẩm tồn kho thấp (< 5)
#         cursor.execute("SELECT COUNT(*) AS low_stock FROM products WHERE so_luong_ton < 5")
#         lowStock = cursor.fetchone()['low_stock']

#         return {
#             "totalProducts": totalProducts,
#             "ordersToday": ordersToday,
#             "monthlyRevenue": monthlyRevenue,
#             "lowStock": lowStock
#         }
#     finally:
#         cursor.close()











# routers/dashboard.py
from fastapi import APIRouter, Depends
from database import get_db

router = APIRouter()

@router.get("/")
def get_dashboard(conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)
    try:
        # Tổng số sản phẩm
        cursor.execute("SELECT COUNT(*) AS total FROM products")
        totalProducts = cursor.fetchone()['total']

        # Đơn hàng hôm nay (dựa trên ngày mua)
        cursor.execute("""
            SELECT COUNT(*) AS today_orders
            FROM orders
            WHERE DATE(ngay_mua) = CURDATE()
        """)
        ordersToday = cursor.fetchone()['today_orders']

        # Doanh thu tháng này — CHỈ tính đơn ĐÃ GIAO
        cursor.execute("""
            SELECT SUM(tong_tien) AS monthly_revenue
            FROM orders
            WHERE trang_thai = 'Đã giao'
            AND MONTH(ngay_mua) = MONTH(CURDATE())
            AND YEAR(ngay_mua) = YEAR(CURDATE())
        """)
        monthlyRevenue = cursor.fetchone()['monthly_revenue'] or 0

        # Sản phẩm tồn kho thấp (< 5)
        cursor.execute("""
            SELECT COUNT(*) AS low_stock 
            FROM products 
            WHERE so_luong_ton < 5
        """)
        lowStock = cursor.fetchone()['low_stock']

        return {
            "totalProducts": totalProducts,
            "ordersToday": ordersToday,
            "monthlyRevenue": monthlyRevenue,
            "lowStock": lowStock
        }
    finally:
        cursor.close()
