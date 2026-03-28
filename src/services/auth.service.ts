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