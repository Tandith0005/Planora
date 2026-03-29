/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { env } from "../config/env";


const axiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = error.config?.url;

    // 1. Silence 401 on /auth/me (expected for guests)
    if (status === 401 && url?.includes('/auth/me')) {
      return Promise.reject(error);
    }

    // 2. Handle 401 on other requests (Token Expired)
    if (status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        await axiosInstance.post("/auth/refresh-token");
        
        // Refresh successful! Process queued requests
        processQueue(null);
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed (refresh token expired or invalid)
        processQueue(refreshError, null);
        
        // Clear local state (TanStack Query)
        // We can't import useQuery here, so we dispatch a custom event or just redirect
        window.location.href = "/login"; 
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Log other errors
    if (status !== 401) {
      console.error('API Error:', status, url);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;