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
