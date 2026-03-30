// src/app/(dashboard)/page.tsx
import { Calendar, Users, TrendingUp, Award, Bell } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 mt-2">Welcome back! Here&apos;s what&apos;s happening with your events.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "My Events", value: "12", icon: Calendar, color: "text-violet-400" },
          { label: "Participants", value: "248", icon: Users, color: "text-emerald-400" },
          { label: "Upcoming", value: "7", icon: TrendingUp, color: "text-amber-400" },
          { label: "Avg Rating", value: "4.8", icon: Award, color: "text-rose-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111118] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">{stat.label}</p>
                <p className="text-4xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111118] border border-white/10 rounded-3xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/dashboard/my-events" 
            className="p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
          >
            <Calendar className="w-8 h-8 text-violet-400 mb-4" />
            <h3 className="font-semibold text-white mb-1">Create Event</h3>
            <p className="text-sm text-zinc-500">Host your next event</p>
          </Link>

          <Link 
            href="/events" 
            className="p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
          >
            <Users className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-semibold text-white mb-1">Browse Events</h3>
            <p className="text-sm text-zinc-500">Find events to join</p>
          </Link>

          <Link 
            href="/dashboard/invitations" 
            className="p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
          >
            <Bell className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="font-semibold text-white mb-1">Invitations</h3>
            <p className="text-sm text-zinc-500">Check pending invites</p>
          </Link>
        </div>
      </div>
    </div>
  );
}