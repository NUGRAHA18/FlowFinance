import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Request: sisipkan token otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Hindari redirect loop jika sudah di halaman auth
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register" && path !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
