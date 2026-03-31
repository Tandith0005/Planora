"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Bell,
  User,
  LogOut,
  Plus,
  Sparkles,
  DoorOpen,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/my-events", label: "My Events", icon: Calendar },
  { href: "/dashboard/invitations", label: "Invitations", icon: Users },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isPending } = useAuth();

  const isActive = (href: string) => pathname === href;

  const adminLink =
    user?.role === "ADMIN"
      ? {
          href: "/admin-dashboard",
          label: "Admin Dashboard",
          icon: LayoutDashboard,
        }
      : null;

  if (isPending) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <Sparkles className="w-6 h-6 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-violet-400 mt-4 animate-pulse">
          Loading amazing event details...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 bottom-0 w-72 bg-[#111118] border-r border-white/10 hidden lg:flex flex-col z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 p-4">
        <Image
          src="/SidebarLogo.jpg"
          alt="Planora Logo"
          width={162}
          height={102}
          loading="eager"
          className="w-52 h-auto mx-auto m-5"
        />
      </Link>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="mb-6 px-3">
          <Link
            href="/dashboard/my-events/create"
            className="flex items-center gap-3 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-medium transition-all shadow-lg shadow-violet-500/20"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </Link>
        </div>

        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-white transition-all"
          >
            <DoorOpen className="w-5 h-5" />
            Back to Home
          </Link>

          {/* Dynamic Admin Dashboard Link */}
          {user?.role === "ADMIN" && adminLink && (
            <Link
              href={adminLink.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                isActive(adminLink.href)
                  ? "bg-white/10 text-white"
                  : "text-rose-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <adminLink.icon className="w-5 h-5" />
              {adminLink.label}
            </Link>
          )}
        </nav>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">
              {user?.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-2xl transition-all mt-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
