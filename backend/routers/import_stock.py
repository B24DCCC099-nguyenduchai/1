# from fastapi import APIRouter, Depends
# import mysql.connector
# from database import get_db
# import datetime

# router = APIRouter()

# def generate_ma_phieu():
#     return "PN" + datetime.datetime.now().strftime("%Y%m%d%H%M")

# # Lấy danh sách phiếu nhập
# @router.get("/")
# def get_imports(conn=Depends(get_db)):
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("""
#         SELECT ib.*, COUNT(ii.id) as tong_mat_hang, SUM(ii.so_luong * ii.gia_nhap) as tong_tien
#         FROM import_batches ib
#         LEFT JOIN import_items ii ON ib.id = ii.import_batch_id
#         GROUP BY ib.id ORDER BY ib.id DESC
#     """)
#     return cursor.fetchall()

# # Tạo phiếu nhập mới
# @router.post("/")
# def create_import(data: dict, conn=Depends(get_db)):
#     cursor = conn.cursor()
#     ma_phieu = generate_ma_phieu()

#     cursor.execute("""
#         INSERT INTO import_batches (ma_phieu, nha_cung_cap, ngay_nhap) 
#         VALUES (%s, %s, NOW())
#     """, (ma_phieu, data['nha_cung_cap']))
#     batch_id = cursor.lastrowid

#     for item in data['chi_tiet']:
#         cursor.execute("""
#             INSERT INTO import_items (import_batch_id, product_id, so_luong, gia_nhap) 
#             VALUES (%s, %s, %s, %s)
#         """, (batch_id, item['product_id'], item['so_luong'], item['gia_nhap']))

#         cursor.execute("UPDATE products SET so_luong_ton = so_luong_ton + %s WHERE id = %s",
#                        (item['so_luong'], item['product_id']))

#     conn.commit()
#     return {"message": "Nhập kho thành công", "ma_phieu": ma_phieu}

# # Xóa phiếu nhập
# @router.delete("/{id}")
# def delete_import(id: int, conn=Depends(get_db)):
#     cursor = conn.cursor()
#     cursor.execute("SELECT product_id, so_luong FROM import_items WHERE import_batch_id = %s", (id,))
#     items = cursor.fetchall()
#     for product_id, so_luong in items:
#         cursor.execute("UPDATE products SET so_luong_ton = so_luong_ton - %s WHERE id = %s", (so_luong, product_id))

#     cursor.execute("DELETE FROM import_items WHERE import_batch_id = %s", (id,))
#     cursor.execute("DELETE FROM import_batches WHERE id = %s", (id,))
#     conn.commit()
#     return {"message": "Xóa phiếu nhập thành công"}

# # Sửa phiếu nhập
# @router.put("/{id}")
# def update_import(id: int, data: dict, conn=Depends(get_db)):
#     cursor = conn.cursor()
#     # Giảm tồn kho cũ
#     cursor.execute("SELECT product_id, so_luong FROM import_items WHERE import_batch_id = %s", (id,))
#     old_items = cursor.fetchall()
#     for product_id, so_luong in old_items:
#         cursor.execute("UPDATE products SET so_luong_ton = so_luong_ton - %s WHERE id = %s", (so_luong, product_id))

#     # Xóa chi tiết cũ
#     cursor.execute("DELETE FROM import_items WHERE import_batch_id = %s", (id,))

#     # Cập nhật thông tin phiếu
#     cursor.execute("UPDATE import_batches SET nha_cung_cap = %s WHERE id = %s", (data['nha_cung_cap'], id))

#     # Thêm chi tiết mới + cập nhật tồn kho
#     for item in data['chi_tiet']:
#         cursor.execute("""
#             INSERT INTO import_items (import_batch_id, product_id, so_luong, gia_nhap) 
#             VALUES (%s, %s, %s, %s)
#         """, (id, item['product_id'], item['so_luong'], item['gia_nhap']))
#         cursor.execute("UPDATE products SET so_luong_ton = so_luong_ton + %s WHERE id = %s",
#                        (item['so_luong'], item['product_id']))

#     conn.commit()
#     return {"message": "Cập nhật phiếu nhập thành công"}










from fastapi import APIRouter, Depends
from database import get_db
import datetime

router = APIRouter()

def generate_ma_phieu():
    return "PN" + datetime.datetime.now().strftime("%Y%m%d%H%M")

# Lấy danh sách phiếu nhập
@router.get("/")
def get_imports(conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT ib.*, COUNT(ii.id) as tong_mat_hang, SUM(ii.so_luong * ii.gia_nhap) as tong_tien
        FROM import_batches ib
        LEFT JOIN import_items ii ON ib.id = ii.import_batch_id
        GROUP BY ib.id ORDER BY ib.id DESC
    """)
    return cursor.fetchall()

# Tạo phiếu nhập mới
@router.post("/")
def create_import(data: dict, conn=Depends(get_db)):
    cursor = conn.cursor()
    ma_phieu = generate_ma_phieu()

    cursor.execute("""
        INSERT INTO import_batches (ma_phieu, nha_cung_cap, ngay_nhap) 
        VALUES (%s, %s, NOW())
    """, (ma_phieu, data['nha_cung_cap']))
    batch_id = cursor.lastrowid

    for item in data['chi_tiet']:
        cursor.execute("""
            INSERT INTO import_items (import_batch_id, product_id, so_luong, gia_nhap) 
            VALUES (%s, %s, %s, %s)
        """, (batch_id, item['product_id'], item['so_luong'], item['gia_nhap']))

        # Cập nhật tồn kho
        cursor.execute("UPDATE products SET so_luong_ton = so_luong_ton + %s WHERE id = %s",
                       (item['so_luong'], item['product_id']))

    conn.commit()
    return {"message": "Nhập kho thành công", "ma_phieu": ma_phieu}

# Xóa phiếu nhập
@router.delete("/{id}")
def delete_import(id: int, conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT product_id, so_luong FROM import_items WHERE import_batch_id = %s", (id,))
    items = cursor.fetchall()
    for product_id, so_luong in items:
        cursor.execute("UPDATE products SET so_luong_ton = so_luong_ton - %s WHERE id = %s", (so_luong, product_id))

    cursor.execute("DELETE FROM import_items WHERE import_batch_id = %s", (id,))
    cursor.execute("DELETE FROM import_batches WHERE id = %s", (id,))
    conn.commit()
    return {"message": "Xóa phiếu nhập thành công"}

# Sửa phiếu nhập
@router.put("/{id}")
def update_import(id: int, data: dict, conn=Depends(get_db)):
    cursor = conn.cursor()
    # Giảm tồn kho cũ
    cursor.execute("SELECT product_id, so_luong FROM import_items WHERE import_batch_id = %s", (id,))
    old_items = cursor.fetchall()
    for product_id, so_luong in old_items:
        cursor.execute("UPDATE products SET so_luong_ton = so_luong_ton - %s WHERE id = %s", (so_luong, product_id))

    # Xóa chi tiết cũ
    cursor.execute("DELETE FROM import_items WHERE import_batch_id = %s", (id,))

    # Cập nhật thông tin phiếu
    cursor.execute("UPDATE import_batches SET nha_cung_cap = %s WHERE id = %s", (data['nha_cung_cap'], id))

    # Thêm chi tiết mới + cập nhật tồn kho
    for item in data['chi_tiet']:
        cursor.execute("""
            INSERT INTO import_items (import_batch_id, product_id, so_luong, gia_nhap) 
            VALUES (%s, %s, %s, %s)
        """, (id, item['product_id'], item['so_luong'], item['gia_nhap']))
        cursor.execute("UPDATE products SET so_luong_ton = so_luong_ton + %s WHERE id = %s",
                       (item['so_luong'], item['product_id']))

    conn.commit()
    return {"message": "Cập nhật phiếu nhập thành công"}

# --- Lấy chi tiết 1 phiếu nhập kèm tồn trước / tồn sau ---
@router.get("/{id}")
def get_import_detail(id: int, conn=Depends(get_db)):
    cursor = conn.cursor(dictionary=True)

    # Lấy thông tin phiếu nhập
    cursor.execute("""
        SELECT *
        FROM import_batches
        WHERE id = %s
    """, (id,))
    batch = cursor.fetchone()

    if not batch:
        return {"error": "Phiếu nhập không tồn tại"}

    # Lấy danh sách mặt hàng của phiếu + tồn trước
    cursor.execute("""
        SELECT ii.*, p.ten_sp, p.ma_sp, p.so_luong_ton,
               (p.so_luong_ton - ii.so_luong) AS ton_cu
        FROM import_items ii
        JOIN products p ON ii.product_id = p.id
        WHERE ii.import_batch_id = %s
    """, (id,))
    items = cursor.fetchall()

    return {
        "phieu_nhap": batch,
        "chi_tiet": items
    }
