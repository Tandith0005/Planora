"use client";

import Link from "next/link";

import { Calendar, MapPin, ArrowRight, Sparkles, Users } from "lucide-react";
import { formatDate, formatFee } from "@/src/utils/formatDate";
import { FeaturedEvent } from "./featuredEvents";

export default function HeroSection() {

  const featured = FeaturedEvent;
  const isLoading = false

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#07070e]">
      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow top-left */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-violet-600/10 blur-[120px]" />
        {/* Radial glow bottom-right */}
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[100px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #a78bfa 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Diagonal accent line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-violet-500/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: Copy ── */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-8">
              <Sparkles className="w-3 h-3" />
              Featured Event
            </div>

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-12 bg-white/5 rounded-2xl w-3/4" />
                <div className="h-12 bg-white/5 rounded-2xl w-1/2" />
                <div className="h-4 bg-white/5 rounded-lg w-full mt-6" />
                <div className="h-4 bg-white/5 rounded-lg w-5/6" />
              </div>
            ) : featured ? (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
                  {featured.title.split(" ").slice(0, 4).join(" ")}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                    {featured.title.split(" ").slice(4).join(" ") || ""}
                  </span>
                </h1>

                <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-lg">
                  {featured.description.slice(0, 160)}
                  {featured.description.length > 160 ? "…" : ""}
                </p>

                <div className="flex flex-wrap items-center gap-5 mb-10">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    {formatDate(featured.date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    {featured.venue}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    {featured.creator?.name}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/events/${featured.id}`}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                  >
                    {featured.registrationFee > 0 ? "Pay & Join" : "Join Event"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-semibold rounded-xl transition-all duration-200 border border-white/5"
                  >
                    Browse All
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
                  Discover &{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                    Join Events
                  </span>{" "}
                  You Love
                </h1>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-lg">
                  From intimate private gatherings to massive public conferences — create, manage and participate in events that matter.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/events"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25"
                  >
                    Browse Events
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold rounded-xl transition-all duration-200 border border-white/5"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* ── Right: Featured card ── */}
          <div className="relative hidden lg:block">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/10 rounded-3xl blur-2xl scale-95" />

            {isLoading ? (
              <div className="relative bg-[#111118] border border-white/5 rounded-3xl p-8 animate-pulse">
                <div className="h-6 bg-white/5 rounded-lg w-1/3 mb-6" />
                <div className="h-8 bg-white/5 rounded-xl w-full mb-3" />
                <div className="h-8 bg-white/5 rounded-xl w-2/3 mb-6" />
                <div className="h-4 bg-white/5 rounded-lg w-full mb-2" />
                <div className="h-4 bg-white/5 rounded-lg w-4/5 mb-8" />
                <div className="h-12 bg-white/5 rounded-xl" />
              </div>
            ) : featured ? (
              <div className="relative bg-[#111118] border border-white/8 rounded-3xl overflow-hidden">
                {/* Top gradient bar */}
                <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500" />

                <div className="p-8">
                  {/* Fee badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                    {formatFee(featured.registrationFee)}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
                    {featured.title}
                  </h2>

                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    {featured.description.slice(0, 120)}…
                  </p>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: "Date", value: formatDate(featured.date), icon: Calendar },
                      { label: "Venue", value: featured.venue, icon: MapPin },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-white/3 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-1.5 text-zinc-600 text-xs mb-1">
                          <Icon className="w-3 h-3" />
                          {label}
                        </div>
                        <p className="text-white text-sm font-medium truncate">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {featured.creator?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-zinc-600">Organized by</p>
                      <p className="text-sm text-zinc-300 font-medium">{featured.creator?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Placeholder card when no events */
              <div className="relative bg-[#111118] border border-white/8 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-violet-400" />
                </div>
                <p className="text-white font-semibold mb-2">No featured event yet</p>
                <p className="text-zinc-600 text-sm">Be the first to create an event on Planora.</p>
              </div>
            )}

            {/* Floating decoration badges */}
            <div className="absolute -top-4 -right-4 px-3 py-1.5 bg-[#111118] border border-white/10 rounded-full text-xs text-zinc-400 shadow-xl">
              🔴 Live Now
            </div>
            <div className="absolute -bottom-4 -left-4 px-3 py-1.5 bg-[#111118] border border-white/10 rounded-full text-xs text-zinc-400 shadow-xl">
              ✦ Featured Pick
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </section>
  );
}