"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Bell, LogOut, LayoutDashboard, ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";

export default function Navbar() {
  const { user, isAuthenticated, isPending, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Show Loading Spinner while checking auth
  if (isPending) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5 h-20">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse" />
             <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
          </div>
          
          {/* Loading Spinner */}
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-sm">Loading...</span>
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/Planora.jpg"
              alt="Planora Logo"
              width={162}
              height={102}
              className="w-auto h-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Link
                  href="/dashboard"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Bell className="w-4 h-4" />
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors max-w-[100px] truncate">
                      {user.name || "User"}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[#111118] border border-white/10 rounded-xl shadow-xl shadow-black/50 z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-xs text-zinc-500">Signed in as</p>
                          <p className="text-sm text-white font-medium truncate">{user.email}</p>
                          {user.role === "ADMIN" && (
                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full font-medium">
                              Admin
                            </span>
                          )}
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => { handleLogout(); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0f] border-t border-white/5 px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated && user ? (
            <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-center bg-violet-600 hover:bg-violet-500 text-white transition-all"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}