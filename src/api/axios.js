import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusleave_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('campusleave_user');
      localStorage.removeItem('campusleave_role');
      localStorage.removeItem('campusleave_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
