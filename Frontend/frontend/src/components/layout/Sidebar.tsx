import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const menuItems = [
  { icon: '📊', label: 'Tổng quan', path: '/' },
  { icon: '📦', label: 'Sản phẩm', path: '/products' },
  { icon: '👥', label: 'Khách hàng', path: '/customers' },
  { icon: '🛒', label: 'Đơn hàng', path: '/orders' },
  { icon: '📥', label: 'Nhập kho', path: '/import' },
];

interface SidebarProps {
  setIsLoggedIn: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setIsLoggedIn }) => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Quản lý cửa hàng</h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Nút đăng xuất */}
        <button
          className="menu-item logout-btn"
          onClick={() => setIsLoggedIn(false)}
        >
          <span className="icon">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
