/* // src/pages/ProductPage.tsx
import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';

interface Product {
  id: number;
  ma_sp: string;
  ten_sp: string;
  gia_ban: number;
  so_luong_ton: number;
  don_vi: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ma_sp: '', ten_sp: '', gia_ban: '', don_vi: 'Vỉ' });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(p =>
    p.ma_sp.toLowerCase().includes(search.toLowerCase()) ||
    p.ten_sp.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ ma_sp: '', ten_sp: '', gia_ban: '', don_vi: 'Vỉ' });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, { ...form, gia_ban: Number(form.gia_ban) });
        alert('Sửa thành công!');
      } else {
        await api.post('/products', { ...form, gia_ban: Number(form.gia_ban) });
        alert('Thêm thành công!');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Lỗi rồi!');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    try {
      await api.delete(`/products/${id}`);
      alert('Xóa thành công!');
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Xóa thất bại!');
    }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ ma_sp: p.ma_sp, ten_sp: p.ten_sp, gia_ban: p.gia_ban.toString(), don_vi: p.don_vi });
    setShowModal(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Quản lý Sản phẩm</h2>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} /> Thêm sản phẩm
        </button>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input placeholder="Tìm mã hoặc tên sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Giá bán</th>
              <th>Tồn kho</th>
              <th>Đơn vị</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><strong>{p.ma_sp}</strong></td>
                <td>{p.ten_sp}</td>
                <td>{p.gia_ban.toLocaleString()} ₫</td>
                <td>{p.so_luong_ton}</td>
                <td>{p.don_vi}</td>
                <td>
                  <button onClick={() => startEdit(p)} className="btn-edit"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(p.id)} className="btn-delete"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Chưa có sản phẩm nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Mã sản phẩm"
                value={form.ma_sp}
                onChange={e => setForm({...form, ma_sp: e.target.value})}
                required
              />
              <input
                placeholder="Tên sản phẩm"
                value={form.ten_sp}
                onChange={e => setForm({...form, ten_sp: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Giá bán"
                value={form.gia_ban}
                onChange={e => setForm({...form, gia_ban: e.target.value})}
                required
              />
              <select value={form.don_vi} onChange={e => setForm({...form, don_vi: e.target.value})}>
                <option value="Vỉ">Vỉ</option>
                <option value="Hộp">Hộp</option>
                <option value="Chai">Chai</option>
              </select>

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

export default ProductPage;
 */










import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';

interface Product {
  id: number;
  ma_sp: string;
  ten_sp: string;
  gia_ban: number;
  so_luong_ton: number;
  don_vi: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ma_sp:'', ten_sp:'', gia_ban:'', don_vi:'Vỉ' });

  useEffect(()=>{ fetchProducts() }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch(err){ console.error(err); }
  };

  const filtered = products.filter(p =>
    p.ma_sp.toLowerCase().includes(search.toLowerCase()) ||
    p.ten_sp.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ ma_sp:'', ten_sp:'', gia_ban:'', don_vi:'Vỉ' });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(editingProduct){
        await api.put(`/products/${editingProduct.id}`, {...form, gia_ban:Number(form.gia_ban)});
        alert('Sửa thành công!');
      } else {
        await api.post('/products', {...form, gia_ban:Number(form.gia_ban)});
        alert('Thêm thành công!');
      }
      setShowModal(false); resetForm(); fetchProducts();
    } catch(err:any){
      alert(err.response?.data?.detail || 'Lỗi rồi!');
    }
  };

  const handleDelete = async (id:number) => {
    if(!confirm('Xóa sản phẩm này?')) return;
    try {
      await api.delete(`/products/${id}`);
      alert('Xóa thành công!');
      fetchProducts();
    } catch(err:any){
      alert(err.response?.data?.detail || 'Xóa thất bại!');
    }
  };

  const startEdit = (p:Product) => {
    setEditingProduct(p);
    setForm({ ma_sp:p.ma_sp, ten_sp:p.ten_sp, gia_ban:p.gia_ban.toString(), don_vi:p.don_vi });
    setShowModal(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Quản lý Sản phẩm</h2>
        <button className="btn-primary" onClick={()=>{ resetForm(); setShowModal(true); }}>
          <Plus size={20}/> Thêm sản phẩm
        </button>
      </div>

      <div className="search-box">
        <Search size={20}/>
        <input placeholder="Tìm mã hoặc tên sản phẩm..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Giá bán</th>
              <th>Tồn kho</th>
              <th>Đơn vị</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id}>
                <td><strong>{p.ma_sp}</strong></td>
                <td>{p.ten_sp}</td>
                <td>{p.gia_ban.toLocaleString()} ₫</td>
                <td>{p.so_luong_ton}</td>
                <td>{p.don_vi}</td>
                <td>
                  <button onClick={()=>startEdit(p)} className="btn-edit"><Edit2 size={16}/></button>
                  <button onClick={()=>handleDelete(p.id)} className="btn-delete"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={6} style={{textAlign:'center', padding:'20px'}}>Chưa có sản phẩm nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3>{editingProduct ? 'Sửa sản phẩm':'Thêm sản phẩm mới'}</h3>
            <form onSubmit={handleSubmit}>
              <input placeholder="Mã sản phẩm" value={form.ma_sp} onChange={e=>setForm({...form, ma_sp:e.target.value})} required />
              <input placeholder="Tên sản phẩm" value={form.ten_sp} onChange={e=>setForm({...form, ten_sp:e.target.value})} required />
              <input type="number" placeholder="Giá bán" value={form.gia_ban} onChange={e=>setForm({...form, gia_ban:e.target.value})} required />
              <select value={form.don_vi} onChange={e=>setForm({...form, don_vi:e.target.value})}>
                <option value="Vỉ">Vỉ</option>
                <option value="Hộp">Hộp</option>
                <option value="Chai">Chai</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Lưu</button>
                <button type="button" onClick={()=>setShowModal(false)} className="btn-secondary">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductPage;
