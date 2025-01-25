import authApi from "./axios";

// Login
export const loginRequest = async (data) =>
  authApi.post("/api/auth/auth.login.user", data);

// Obtener datos
export const getDataRequest = (endpoint) => authApi.get(`/${endpoint}`);

// Postear datos
export const postDataRequest = (endpoint, data) =>
  authApi.post(`/${endpoint}`, data);

// Actualizar datos (PUT)
export const putDataRequest = (endpoint, data) =>
  authApi.put(`/${endpoint}`, data);

// Actualizar parcialmente datos (PATCH)

// Eliminar datos
export const deleteDataRequest = (endpoint) => authApi.delete(`/${endpoint}`);


export const getUsersRequest = async () => {
  const res = await authApi.get("/vehicle");
  return res.data;
};

