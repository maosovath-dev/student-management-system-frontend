import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: ផ្ញើ Bearer Token ទៅ Backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  // ឆែកកុំឱ្យផ្ញើពាក្យ "undefined" ឬ "null" ជា string ទៅ Backend
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// 2. Response Interceptor: បើ Token ខូច/ផុតកំណត់ ឱ្យ Logout និង Redirect ទៅ Login ភ្លាម
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // សំអាត LocalStorage ពេល Token មានបញ្ហា[cite: 1, 2]
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // នាំអ្នកប្រើប្រាស់ទៅទំព័រ Login វិញ
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);