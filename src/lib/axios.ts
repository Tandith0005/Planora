import axios from "axios";
import { env } from "../config/env";


const axiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // attach token if needed later
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;