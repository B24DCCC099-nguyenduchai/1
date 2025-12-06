import React, { useState } from 'react';
import './Auth.css';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '', password: '', fullname: '', email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin ? formData.username && formData.password : formData.fullname && formData.email) {
          setIsLoggedIn(true);
              }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" placeholder="Họ tên" required
                onChange={e => setFormData({...formData, fullname: e.target.value})} />
              <input type="email" placeholder="Email" required
                onChange={e => setFormData({...formData, email: e.target.value})} />
            </>
          )}
          <input type="text" placeholder="Tên đăng nhập" required
            onChange={e => setFormData({...formData, username: e.target.value})} />
          <input type="password" placeholder="Mật khẩu" required
            onChange={e => setFormData({...formData, password: e.target.value})} />

          <button type="submit" className="btn-primary">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <p className="toggle-auth">
          {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;