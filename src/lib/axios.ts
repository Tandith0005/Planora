/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { env } from "../config/env";
import { tokenStore } from "./tokenStore";

const axiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: false, // no longer needed
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && url?.includes("/auth/me")) {
      return Promise.reject(error);
    }

    if (status === 401 && url?.includes("/auth/refresh-token")) {
      tokenStore.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStore.getRefresh();
        const res = await axiosInstance.post("/auth/refresh-token", null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        const { accessToken, refreshToken: newRefresh } = res.data.data;
        tokenStore.setTokens(accessToken, newRefresh);
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        tokenStore.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status !== 401) {
      console.error("API Error:", status, url);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;