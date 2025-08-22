import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

export default authApi;