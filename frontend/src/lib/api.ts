import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

// Render Backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://fertigation-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT Token automatically add karega
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default api;