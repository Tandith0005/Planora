/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  EyeOff,
  Loader2,
  MailCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/src/hooks/useAuth";
import { loginUser } from "@/src/services/auth.service";

// Validation Schema
const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setNeedsVerification(false); // Reset state

    try {
      const response = await loginUser(data);
      const { user, accessToken, refreshToken } = response.data;
      login(user, { accessToken, refreshToken });

      toast.success("Welcome back!");
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      // Check for specific "not verified" message from backend
      // Adjust the string match based on your exact backend error message
      if (
        errorMessage.toLowerCase().includes("verify") ||
        errorMessage.toLowerCase().includes("verified")
      ) {
        setNeedsVerification(true);
        toast.error("Email not verified. Please check your inbox.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 pt-16">
      <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-violet-600/10 blur-[120px]" />
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-5 left-5 flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-all z-20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-4 shadow-lg shadow-violet-500/20">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400 text-sm">
            Sign in to continue to Planora
          </p>
        </div>

        {/* Verification Warning Card */}
        {needsVerification && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3 relative z-10 animate-in fade-in slide-in-from-top-2">
            <MailCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-1">
                Verification Required
              </h3>
              <p className="text-xs text-blue-300/80 leading-relaxed">
                Your account exists but hasn&apos;t been verified yet. Please
                check your email inbox (and spam folder) for the verification
                link sent during registration.
              </p>
              <Link
                href="/register"
                className="text-xs text-blue-400 hover:text-blue-300 underline mt-2 inline-block"
              >
                Didn&apos;t receive email? Register again
              </Link>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 relative z-10"
        >
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className={`w-full bg-[#0a0a0f] border ${errors.email ? "border-red-500/50" : "border-white/10"} rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full bg-[#0a0a0f] border ${errors.password ? "border-red-500/50" : "border-white/10"} rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center relative z-10">
          <p className="text-zinc-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
