/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Ticket,
} from "lucide-react";
import { formatDate, formatFee } from "@/src/utils/formatDate";
import { getAllEvents } from "@/src/services/event.service";

function SliderCard({ event }: { event: any }) {
  const isPaid = event.registrationFee > 0;

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex-shrink-0 w-72 bg-[#111118] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 flex flex-col"
    >
      {/* Colour accent top */}
      <div
        className={`h-0.5 ${isPaid ? "bg-gradient-to-r from-violet-500 to-indigo-500" : "bg-gradient-to-r from-emerald-500 to-teal-500"}`}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Fee badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              isPaid
                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            <Ticket className="w-2.5 h-2.5" />
            {formatFee(event.registrationFee)}
          </span>
          <span className="text-[10px] text-zinc-700 font-medium uppercase tracking-widest">
            Public
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm leading-snug mb-4 line-clamp-2 group-hover:text-violet-300 transition-colors flex-1">
          {event.title}
        </h3>

        {/* Meta */}
        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{event.creator?.name || "Unknown"}</span>
          </div>
        </div>

        {/* Hover arrow */}
        <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1 text-xs text-violet-400 font-medium">
            View event <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-72 bg-[#111118] border border-white/5 rounded-2xl p-5 animate-pulse">
      <div className="h-0.5 bg-white/5 rounded mb-5" />
      <div className="h-5 bg-white/5 rounded-lg w-1/3 mb-4" />
      <div className="h-4 bg-white/5 rounded-lg w-full mb-2" />
      <div className="h-4 bg-white/5 rounded-lg w-4/5 mb-6" />
      <div className="h-3 bg-white/5 rounded-lg w-2/3 mb-2" />
      <div className="h-3 bg-white/5 rounded-lg w-1/2" />
    </div>
  );
}

export default function UpcomingEventsSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["upcoming-events-slider"],
    queryFn: () =>
      getAllEvents({
        type: "PUBLIC",
        sortBy: "date",
        sortOrder: "asc",
        limit: 9,
        page: 1,
      }),
  });
  console.log(data?.data);

  const events = data?.data?.data || [];

  const scroll = (dir: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      {/* Radial glow top-left */}
        <div className="absolute top-auth left-auth w-[700px] h-[700px] rounded-full bg-violet-600/10 blur-[120px]" />
      {/* Subtle section glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Coming Up
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-zinc-500 mt-2 text-sm">
              {events.length} public events ready to join
            </p>
          </div>

          {/* Navigation controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-all flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : events.length > 0 ? (
            events.map((event : any) => (
              <div key={event.id} className="snap-start">
                <SliderCard event={event} />
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center py-20 text-zinc-600 text-sm">
              No upcoming public events yet.
            </div>
          )}
        </div>

        {/* View all link */}
        {events.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-violet-400 transition-colors group"
            >
              View all events
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
