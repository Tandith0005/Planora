"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./validation";
import { loginUser } from "@/src/services/auth.service";


export default function LoginPage() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    const res = await loginUser(data);

    localStorage.setItem("accessToken", res.data.accessToken);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} type="password" />
      <button type="submit">Login</button>
    </form>
  );
}