import axios from "axios";
import { useAuthStore } from "@/store/AuthStore";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Interceptor para agregar el token dinámicamente en cada request
authApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authApi;