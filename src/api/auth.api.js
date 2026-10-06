import { api } from "./api";

// Post Admin Login
export const loginApi = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// Get Profile Info
export const getProfileApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};