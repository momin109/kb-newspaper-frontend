import axios from "axios";
import { store } from "@/store";

/**
 * Shared axios instance pointed at the existing kb-newspaper-server
 * backend (base path already includes /api — see index.js:
 * app.use("/api/auth", ...), app.use("/api/article", ...) etc.).
 * Attaches the JWT from Redux (authSlice) as returned by that backend's
 * login response ({ success, token, data }).
 */
// export const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use((config) => {
//   const token = store.getState().auth.token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api",
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // FormData হলে browser নিজে Content-Type + boundary সেট করবে
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});
