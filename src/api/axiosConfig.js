import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

let activeUserId = null;

export const setActiveUserId = (userId) => {
  activeUserId = userId;
};

api.interceptors.request.use((config) => {
  if (activeUserId != null) {
    config.headers.userId = activeUserId;
  }
  return config;
});

export default api;
