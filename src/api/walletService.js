import api from "./axiosConfig";

export const getPersonalWallet = () => api.get("/wallet");
