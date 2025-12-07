/* import React, { useState } from 'react';
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

export default Login; */








// src/pages/Login.tsx
/* import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '', password: '', fullname: '', email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:8000/api/auth/login",
          { username: formData.username, password: formData.password },
          { withCredentials: true }
        );
        alert(`${res.data.message}\nTên: ${res.data.user.username}\nHọ tên: ${res.data.user.fullname}\nEmail: ${res.data.user.email}\nRole: ${res.data.user.role}`);
        setIsLoggedIn(true);
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/auth/register",
          {
            username: formData.username,
            password: formData.password,
            fullname: formData.fullname,
            email: formData.email
          }
        );
        alert(res.data.message);
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || "Có lỗi xảy ra!");
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
                onChange={e => setFormData({ ...formData, fullname: e.target.value })} />
              <input type="email" placeholder="Email" required
                onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </>
          )}
          <input type="text" placeholder="Tên đăng nhập" required
            onChange={e => setFormData({ ...formData, username: e.target.value })} />
          <input type="password" placeholder="Mật khẩu" required
            onChange={e => setFormData({ ...formData, password: e.target.value })} />

          <button type="submit" className="btn-primary">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <p className="toggle-auth">
          {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <span onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue' }}>
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login; */










import React, { useState } from 'react';
import { apiAuth } from '../../services/api';
import './Auth.css';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullname: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // LOGIN
        const res = await apiAuth.post("/login", {
          username: formData.username,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.access_token);
        setIsLoggedIn(true);
        alert("Đăng nhập thành công!");
      } else {
        // REGISTER
        await apiAuth.post("/register", {
          username: formData.username,
          password: formData.password,
          fullname: formData.fullname,
          email: formData.email,
        });

        alert("Đăng ký thành công!");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      alert(err.response?.data?.detail || "Lỗi hệ thống!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Họ tên"
                required
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </>
          )}
          <input
            type="text"
            placeholder="Tên đăng nhập"
            required
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit" className="btn-primary">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
        <p className="toggle-auth">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
