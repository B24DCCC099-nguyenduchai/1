/* import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; */





import axios from "axios";

// --- Instance cho login/register ---
export const apiAuth = axios.create({
  baseURL: "http://localhost:8000/api/auth", // ⚡ phải trùng với prefix backend
});

// --- Instance cho các dữ liệu khác ---
export const api = axios.create({
  baseURL: "http://localhost:8000/api", 
});

export default api;
