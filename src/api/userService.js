import api from "./axiosConfig";

export const getUser = (userId) => api.get(`/api/users/${userId}`);
