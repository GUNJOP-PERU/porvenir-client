import axios from "axios";

// Crear una instancia de Axios con configuración global
const authApi = axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApi;
