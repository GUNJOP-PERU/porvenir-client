import axios from "axios";
import { useAuthStore } from "@/store/AuthStore";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Interceptor para agregar el token y cambiar URL si es necesario
authApi.interceptors.request.use(
  (config) => {
    // Si se pasa el flag useSecondary: true, cambiamos la baseURL
    if (config.useSecondary) {
      config.baseURL = import.meta.env.VITE_URL_SECONDARY || import.meta.env.VITE_URL;
    }

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