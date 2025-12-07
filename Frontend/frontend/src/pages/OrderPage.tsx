import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';

interface Order {
  id: number;
  ma_don: string;
  customer_id: number;
  khach_hang: string | null;
  dien_thoai: string | null;
  ngay_mua: string;
  tong_tien: number;
  trang_thai: string;
  chi_tiet?: { product_id: number; so_luong: number }[];
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [chiTiet, setChiTiet] = useState([{ product_id: 0, so_luong: 1 }]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    let sum = 0;
    chiTiet.forEach(item => {
      const prod = products.find(p => p.id === item.product_id);
      if (prod) sum += prod.gia_ban * item.so_luong;
    });
    setTotal(sum);
  }, [chiTiet, products]);

  const fetchAll = async () => {
    const [ordersRes, custRes, prodRes] = await Promise.all([
      api.get('/orders'),
      api.get('/customers'),
      api.get('/products')
    ]);
    setOrders(ordersRes.data);
    setCustomers(custRes.data);
    setProducts(prodRes.data);
  };

  const filtered = orders.filter(o =>
    o.ma_don.toLowerCase().includes(search.toLowerCase()) ||
    (o.khach_hang && o.khach_hang.toLowerCase().includes(search.toLowerCase()))
  );

  const themDong = () => setChiTiet([...chiTiet, { product_id: 0, so_luong: 1 }]);
  const xoaDong = (i: number) => setChiTiet(chiTiet.filter((_, idx) => idx !== i));
  const resetForm = () => {
    setCustomerId('');
    setChiTiet([{ product_id: 0, so_luong: 1 }]);
    setEditingId(null);
    setTotal(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return alert('Vui lòng chọn khách hàng!');
    if (chiTiet.some(x => x.product_id === 0)) return alert('Vui lòng chọn sản phẩm!');

    try {
      const payload = { customer_id: customerId, chi_tiet: chiTiet.map(x => ({ product_id: x.product_id, so_luong: x.so_luong })) };
      if (editingId) { await api.put(`/orders/${editingId}`, payload); alert('Cập nhật đơn hàng thành công!'); }
      else { const res = await api.post('/orders', payload); alert(res.data.message); }
      setShowModal(false); resetForm(); fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Lỗi khi lưu đơn hàng!');
    }
  };

  const handleEdit = (order: Order) => {
    setEditingId(order.id);
    setCustomerId(order.customer_id || '');
    setChiTiet(order.chi_tiet?.map(item => ({ product_id: item.product_id, so_luong: item.so_luong })) || [{ product_id: 0, so_luong: 1 }]);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đơn hàng này?')) return;
    try { await api.delete(`/orders/${id}`); fetchAll(); alert('Xóa thành công!'); }
    catch { alert('Xóa thất bại!'); }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put(`/orders/update-status/${id}`, { trang_thai: newStatus });
      fetchAll();
    } catch { alert("Cập nhật trạng thái thất bại!"); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Quản lý Đơn hàng</h2>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} /> Tạo đơn hàng mới
        </button>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input placeholder="Tìm mã đơn hoặc khách hàng..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>SĐT</th>
              <th>Ngày mua</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td><strong>{o.ma_don}</strong></td>
                <td>{o.khach_hang || '-'}</td>
                <td>{o.dien_thoai || '-'}</td>
                <td>{new Date(o.ngay_mua).toLocaleString('vi-VN')}</td>
                <td>{Number(o.tong_tien).toLocaleString()} ₫</td>
                <td>
                  <select
                    value={o.trang_thai}
                    onChange={e => handleStatusChange(o.id, e.target.value)}
                  >
                    <option value="Chờ giao">Chờ giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Hủy">Hủy</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleEdit(o)} className="btn-edit"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(o.id)} className="btn-delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal tạo/sửa đơn */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
            <h3>{editingId ? 'Sửa đơn hàng' : 'Tạo đơn hàng mới'}</h3>
            <form onSubmit={handleSubmit}>
              <select value={customerId} onChange={e => setCustomerId(Number(e.target.value))} required>
                <option value="">-- Chọn khách hàng --</option>
                {customers.map(c => (<option key={c.id} value={c.id}>{c.ma_kh} - {c.ho_ten} ({c.dien_thoai})</option>))}
              </select>

              <div style={{ margin: '20px 0' }}>
                <h4>Chi tiết sản phẩm</h4>
                {chiTiet.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <select value={item.product_id} onChange={e => { const arr = [...chiTiet]; arr[i].product_id = Number(e.target.value); setChiTiet(arr); }} required>
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(p => (<option key={p.id} value={p.id}>{p.ten_sp} (Tồn: {p.so_luong_ton} - {p.gia_ban.toLocaleString()} ₫)</option>))}
                    </select>
                    <input type="number" min={1} placeholder="SL" value={item.so_luong} onChange={e => { const arr = [...chiTiet]; arr[i].so_luong = Number(e.target.value); setChiTiet(arr); }} required style={{ width: '80px' }} />
                    {chiTiet.length > 1 && (<button type="button" className="btn-delete" onClick={() => xoaDong(i)}>Xóa</button>)}
                  </div>
                ))}
                <button type="button" className="btn-primary" onClick={themDong}>+ Thêm sản phẩm</button>
              </div>

              <div>Tổng tiền: <strong>{total.toLocaleString()} ₫</strong></div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">{editingId ? 'Lưu thay đổi' : 'Tạo đơn hàng'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
