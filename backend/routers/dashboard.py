# # routers/dashboard.py
# from fastapi import APIRouter, Depends
# from database import get_db

# router = APIRouter()

# @router.get("/")
# def get_dashboard(conn=Depends(get_db)):
#     cursor = conn.cursor(dictionary=True)
#     try:
#         # Tổng sản phẩm
#         cursor.execute("SELECT COUNT(*) AS total FROM products")
#         totalProducts = cursor.fetchone()['total']

#         # Đơn hàng hôm nay
#         cursor.execute("""
#             SELECT COUNT(*) AS today_orders 
#             FROM orders 
#             WHERE DATE(created_at) = CURDATE()
#         """)
#         ordersToday = cursor.fetchone()['today_orders']

#         # Doanh thu tháng hiện tại
#         cursor.execute("""
#             SELECT SUM(total_amount) AS monthly_revenue 
#             FROM orders 
#             WHERE MONTH(created_at) = MONTH(CURDATE()) 
#             AND YEAR(created_at) = YEAR(CURDATE())
#         """)
#         monthlyRevenue = cursor.fetchone()['monthly_revenue'] or 0

#         # Sản phẩm tồn kho thấp (ví dụ quantity < 5)
#         cursor.execute("SELECT COUNT(*) AS low_stock FROM products WHERE quantity < 5")
#         lowStock = cursor.fetchone()['low_stock']

#         return {
#             "totalProducts": totalProducts,
#             "ordersToday": ordersToday,
#             "monthlyRevenue": monthlyRevenue,
#             "lowStock": lowStock
#         }
#     finally:
#         cursor.close()
