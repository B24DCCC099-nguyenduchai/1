import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';
import ImportPage from './pages/ImportPage';
import './styles/global.css';
import CustomerPage from './pages/CustomerPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }
  return (
    <BrowserRouter>
      <Layout setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;