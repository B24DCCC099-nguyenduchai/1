import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Tổng quan hệ thống</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Tổng sản phẩm</h3>
          <p className="number">1,234</p>
        </div>
        <div className="stat-card">
          <h3>Đơn hàng hôm nay</h3>
          <p className="number">89</p>
        </div>
        <div className="stat-card">
          <h3>Doanh thu tháng</h3>
          <p className="number">245,680,000 ₫</p>
        </div>
        <div className="stat-card">
          <h3>Tồn kho thấp</h3>
          <p className="number warning">12 sản phẩm</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;












/* 
// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    ordersToday: 0,
    monthlyRevenue: 0,
    lowStock: 0,
  });

  const fetchStats = async () => {
    try {
      // Giả sử backend có API /api/dashboard trả về tổng quan
      const response = await axios.get('http://localhost:8000/api/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu dashboard:', error);
    }
  };

  useEffect(() => {
    fetchStats();

    // Nếu muốn tự động cập nhật mỗi 30s:
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h2>Tổng quan hệ thống</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Tổng sản phẩm</h3>
          <p className="number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Đơn hàng hôm nay</h3>
          <p className="number">{stats.ordersToday}</p>
        </div>
        <div className="stat-card">
          <h3>Doanh thu tháng</h3>
          <p className="number">{stats.monthlyRevenue.toLocaleString()} ₫</p>
        </div>
        <div className="stat-card">
          <h3>Tồn kho thấp</h3>
          <p className="number warning">{stats.lowStock} sản phẩm</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; */
