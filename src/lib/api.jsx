import authApi from "./axios";

// Login
export const loginRequest = async (data) =>
  authApi.post("api/v1/auth/verify-login", data);

// Obtener datos
export const getDataRequest = (endpoint) => authApi.get(`api/v1/${endpoint}`);

// Postear datos
export const postDataRequest = (endpoint, data) =>
  authApi.post(`api/v1/${endpoint}`, data);

// Actualizar datos (PUT)
export const putDataRequest = (endpoint, data) =>
  authApi.put(`api/v1/${endpoint}`, data);

// Eliminar datos
export const deleteDataRequest = (endpoint) => authApi.delete(`api/v1/${endpoint}`);


