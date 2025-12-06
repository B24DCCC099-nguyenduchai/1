import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api'; // ĐÚNG Y HỆT OrderPage

interface Customer {
  id: number;
  ma_kh: string;
  ho_ten: string;
  dien_thoai: string;
  dia_chi: string | null;
  email: string | null;
}

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [form, setForm] = useState({
    ma_kh: '',
    ho_ten: '',
    dien_thoai: '',
    dia_chi: '',
    email: ''
  });
  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      alert('Lỗi tải danh sách khách hàng');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  const filtered = customers.filter(c =>
    c.ma_kh.toLowerCase().includes(search.toLowerCase()) ||
    c.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
    c.dien_thoai.includes(search)
  );
  const resetForm = () => {
    setForm({ ma_kh: '', ho_ten: '', dien_thoai: '', dia_chi: '', email: '' });
    setEditingCustomer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, form);
      } else {
        await api.post('/customers', form);
      }
      alert(editingCustomer ? 'Cập nhật thành công!' : 'Thêm khách hàng thành công!');
      setShowModal(false);
      resetForm();
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Lỗi rồi bạn ơi!');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa khách hàng này thật không?')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      alert('Không xóa được (có thể đang có đơn hàng)');
    }
  };

  const startEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({
      ma_kh: c.ma_kh,
      ho_ten: c.ho_ten,
      dien_thoai: c.dien_thoai,
      dia_chi: c.dia_chi || '',
      email: c.email || ''
    });
    setShowModal(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Quản lý Khách hàng</h2>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} /> Thêm khách hàng
        </button>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Tìm mã, tên, số điện thoại..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã KH</th>
              <th>Họ tên</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td><strong>{c.ma_kh}</strong></td>
                <td>{c.ho_ten}</td>
                <td>{c.dien_thoai}</td>
                <td>{c.email || '-'}</td>
                <td>{c.dia_chi || '-'}</td>
                <td>
                  <button onClick={() => startEdit(c)} className="btn-edit"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(c.id)} className="btn-delete"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingCustomer ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Mã khách hàng (KH001)"
                value={form.ma_kh}
                onChange={e => setForm({...form, ma_kh: e.target.value})}
                required
              />
              <input
                placeholder="Họ và tên"
                value={form.ho_ten}
                onChange={e => setForm({...form, ho_ten: e.target.value})}
                required
              />
              <input
                placeholder="Số điện thoại"
                value={form.dien_thoai}
                onChange={e => setForm({...form, dien_thoai: e.target.value})}
                required
              />
              <input
                placeholder="Email (không bắt buộc)"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
              <textarea
                placeholder="Địa chỉ (không bắt buộc)"
                rows={3}
                value={form.dia_chi}
                onChange={e => setForm({...form, dia_chi: e.target.value})}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Lưu</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;