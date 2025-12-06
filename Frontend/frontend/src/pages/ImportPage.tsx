import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../services/api';

const ImportPage = () => {
  const [imports, setImports] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [nhaCungCap, setNhaCungCap] = useState('');
  const [chiTiet, setChiTiet] = useState([{ product_id: 0, so_luong: 1, gia_nhap: 0 }]);
  const [danhSachSP, setDanhSachSP] = useState<any[]>([]);

  useEffect(() => {
    fetchImports();
    fetchProducts();
  }, []);

  const fetchImports = async () => {
    try {
      const res = await api.get('/import');
      setImports(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setDanhSachSP(res.data);
  };

  const filtered = imports.filter(i =>
    i.ma_phieu.toLowerCase().includes(search.toLowerCase()) ||
    (i.nha_cung_cap && i.nha_cung_cap.toLowerCase().includes(search.toLowerCase()))
  );

  const themDong = () => setChiTiet([...chiTiet, { product_id: 0, so_luong: 1, gia_nhap: 0 }]);
  const xoaDong = (index: number) => setChiTiet(chiTiet.filter((_, i) => i !== index));

  // Tính tổng tiền phiếu
  const getTongTien = () => chiTiet.reduce((total, item) => total + (item.so_luong * item.gia_nhap), 0);

  const editPhieu = (phieu: any) => {
    setEditingId(phieu.id);
    setNhaCungCap(phieu.nha_cung_cap || '');
    if (Array.isArray(phieu.chi_tiet) && phieu.chi_tiet.length > 0) {
      setChiTiet(phieu.chi_tiet.map((item: any) => ({
        product_id: item.product_id || 0,
        so_luong: item.so_luong || 1,
        gia_nhap: item.gia_nhap || 0
      })));
    } else {
      setChiTiet([{ product_id: 0, so_luong: 1, gia_nhap: 0 }]);
    }
    setShowModal(true);
  };

  const deletePhieu = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa phiếu này?')) return;
    try { await api.delete(`/import/${id}`); fetchImports(); } 
    catch (err: any) { console.error(err); alert(err.response?.data?.detail || 'Lỗi khi xóa phiếu!'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nhaCungCap.trim()) return alert('Vui lòng nhập tên nhà cung cấp!');
    if (chiTiet.some(item => item.product_id === 0)) return alert('Vui lòng chọn sản phẩm!');
    if (chiTiet.some(item => item.so_luong <= 0 || item.gia_nhap < 0)) return alert('Số lượng và giá nhập phải hợp lệ!');

    const payload = { nha_cung_cap: nhaCungCap, chi_tiet: chiTiet };
    try {
      if (editingId) await api.put(`/import/${editingId}`, payload);
      else await api.post('/import', payload);
      setShowModal(false); setEditingId(null); setNhaCungCap(''); setChiTiet([{ product_id: 0, so_luong: 1, gia_nhap: 0 }]);
      fetchImports();
    } catch (err: any) { console.error(err); alert(err.response?.data?.detail || 'Lỗi khi lưu phiếu!'); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Quản lý Nhập kho</h2>
        <button className="btn-primary" onClick={() => { setShowModal(true); setEditingId(null); }}>
          <Plus size={20} /> Nhập kho mới
        </button>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input type="text" placeholder="Tìm mã phiếu hoặc nhà cung cấp..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Ngày nhập</th>
              <th>Nhà cung cấp</th>
              <th>Số mặt hàng</th>
              <th>Tổng tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={6} style={{ textAlign:'center', padding:'40px' }}>Chưa có phiếu nhập nào</td></tr> :
              filtered.map(i => (
                <tr key={i.id}>
                  <td><strong>{i.ma_phieu}</strong></td>
                  <td>{new Date(i.ngay_nhap).toLocaleDateString('vi-VN')}</td>
                  <td>{i.nha_cung_cap || '-'}</td>
                  <td>{i.tong_mat_hang || 0}</td>
                  <td>{Number(i.tong_tien || 0).toLocaleString()} ₫</td>
                  <td style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
                    <button onClick={() => editPhieu(i)} style={{ border:'none', background:'transparent', cursor:'pointer' }}><Edit2 size={18} color="#4caf50"/></button>
                    <button onClick={() => deletePhieu(i.id)} style={{ border:'none', background:'transparent', cursor:'pointer' }}><Trash2 size={18} color="#f44336"/></button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth:'700px' }} onClick={e => e.stopPropagation()}>
            <h3>{editingId ? 'Sửa phiếu nhập kho' : 'Tạo phiếu nhập kho mới'}</h3>
            <form onSubmit={handleSubmit}>
              <input placeholder="Tên nhà cung cấp" value={nhaCungCap} onChange={e=>setNhaCungCap(e.target.value)} required />
              <div style={{ margin:'20px 0' }}>
                <h4 style={{ marginBottom:'12px' }}>Chi tiết sản phẩm nhập</h4>
                {chiTiet.map((item,index)=>(
                  <div key={index} style={{ display:'flex', gap:'10px', marginBottom:'12px', alignItems:'center', flexWrap:'wrap' }}>
                    <select value={item.product_id} onChange={e=>{ const newArr=[...chiTiet]; newArr[index].product_id=Number(e.target.value); setChiTiet(newArr); }} required style={{ flex:2, minWidth:'200px' }}>
                      <option value={0}>-- Chọn sản phẩm --</option>
                      {danhSachSP.map(p=><option key={p.id} value={p.id}>{p.ten_sp} (Tồn: {p.so_luong_ton})</option>)}
                    </select>
                    <input type="number" min="1" placeholder="Số lượng" value={item.so_luong} onChange={e=>{ const newArr=[...chiTiet]; newArr[index].so_luong=Number(e.target.value)||1; setChiTiet(newArr); }} style={{ width:'100px' }} required />
                    <input type="number" min="0" placeholder="Giá nhập" value={item.gia_nhap} onChange={e=>{ const newArr=[...chiTiet]; newArr[index].gia_nhap=Number(e.target.value)||0; setChiTiet(newArr); }} style={{ width:'130px' }} required />
                    <span style={{ width:'100px', fontWeight:'bold' }}>{(item.so_luong * item.gia_nhap).toLocaleString()} ₫</span>
                    {chiTiet.length>1 && <button type="button" className="btn-delete" onClick={()=>xoaDong(index)}>Xóa</button>}
                  </div>
                ))}
                <button type="button" className="btn-primary" onClick={themDong}>+ Thêm sản phẩm</button>

                {/* Tổng tiền cả phiếu */}
                <div style={{ marginTop:'10px', fontWeight:'bold', fontSize:'16px' }}>
                  Tổng tiền: {getTongTien().toLocaleString()} ₫
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">{editingId?'Cập nhật phiếu':'Lưu phiếu nhập'}</button>
                <button type="button" className="btn-secondary" onClick={()=>setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportPage;
