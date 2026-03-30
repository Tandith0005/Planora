import axiosInstance from "../lib/axios";


export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data: {name: string, email: string, password: string}) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const searchUsers = async (q: string) => {
  const res = await axiosInstance.get(`/auth/search?q=${encodeURIComponent(q)}`);
  return res.data?.data || [];
};