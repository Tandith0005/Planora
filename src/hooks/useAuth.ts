"use client";

import { useState, useEffect } from "react";
import { User } from "../types";
import axiosInstance from "../lib/axios";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
};

// export const useAuth = (): AuthState => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//     const router = useRouter();

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       setIsLoading(true);

//       try {
//         const res = await axiosInstance.get("/auth/me");
//         const userData = res.data?.data || res.data;
//         setUser(userData);
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (error: any) {

//         setUser(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = (userData: User) => {
//     setUser(userData);
//     router.push("/");
//   };

//   const logout = async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       setUser(null);
//       router.push("/");
//     }
//   };

//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     login,
//     logout,
//   };
// };

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, isError, data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data?.data || res.data;
      } catch (error) {
        // Return null on 401 (not logged in)
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const login = (userData: User) => {
    queryClient.setQueryData(["user"], userData);
    if (userData.role === "ADMIN") {
      router.push("/admin-dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
      router.push("/login");
    }
  };

  return {
    user: data || null,
    isPending,
    isAuthenticated: !!data && !isError,
    login,
    logout,
  };
};
