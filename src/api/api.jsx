import authApi from "../lib/axios";

const getPrefix = (config) => (config?.useSecondary ? "api" : "api/v1");

// Login
export const loginRequest = async (data) =>
  authApi.post(`${getPrefix()}/auth/verify-login`, data);

// Obtener datos
export const getDataRequest = (endpoint, config = {}) => 
  authApi.get(`${getPrefix(config)}/${endpoint}`, config);

// Postear datos
export const postDataRequest = (endpoint, data, config = {}) =>
  authApi.post(`${getPrefix(config)}/${endpoint}`, data, config);

// Actualizar datos (PUT)
export const putDataRequest = (endpoint, data, config = {}) =>
  authApi.put(`${getPrefix(config)}/${endpoint}`, data, config);

// Eliminar datos
export const deleteDataRequest = (endpoint, config = {}) => 
  authApi.delete(`${getPrefix(config)}/${endpoint}`, config);

// Obtener datos Dashboard
export const getDataGraphicRequest = async (endpoint, config = {}) => {
  const response = await authApi.get(`${getPrefix(config)}/${endpoint}`, config);
  return response.data; 
};

export const getDownloadRequest = (endpoint, config = {}) => 
  authApi.get(`${getPrefix(config)}/${endpoint}`, {
    ...config,
    responseType: 'blob'
  });
