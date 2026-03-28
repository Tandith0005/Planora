"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/event.service";
import { EventQuery, EventType } from "@/types";
import EventCard from "@/components/event/EventCard";
import { Globe, Lock, Tag, Ticket, ArrowRight } from "lucide-react";
import Link from "next/link";

type CategoryKey = "public-free" | "public-paid" | "private-free" | "private-paid";

interface Category {
  key: CategoryKey;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  iconColor: string;
  borderColor: string;
  query: Partial<EventQuery>;
}

const CATEGORIES: Category[] = [
  {
    key: "public-free",
    label: "Public Free",
    description: "Open to all — no cost, instant join",
    icon: Globe,
    color: "bg-violet-500/10",
    iconColor: "text-violet-400",
    borderColor: "border-violet-500/30",
    query: { type: "PUBLIC", maxFee: 0 },
  },
  {
    key: "public-paid",
    label: "Public Paid",
    description: "Open events with registration fee",
    icon: Ticket,
    color: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    query: { type: "PUBLIC", minFee: 1 },
  },
  {
    key: "private-free",
    label: "Private Free",
    description: "Invite-only, free to attend",
    icon: Lock,
    color: "bg-amber-500/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    query: { type: "PRIVATE", maxFee: 0 },
  },
  {
    key: "private-paid",
    label: "Private Paid",
    description: "Exclusive events with registration fee",
    icon: Tag,
    color: "bg-rose-500/10",
    iconColor: "text-rose-400",
    borderColor: "border-rose-500/30",
    query: { type: "PRIVATE", minFee: 1 },
  },
];

function CategoryTab({
  category,
  isActive,
  onClick,
}: {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = category.icon;
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
        isActive
          ? `${category.color} ${category.iconColor} ${category.borderColor} shadow-lg`
          : "bg-white/3 text-zinc-500 border-white/5 hover:bg-white/5 hover:text-zinc-300"
      }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? category.iconColor : "text-zinc-600 group-hover:text-zinc-400"}`} />
      <span className="whitespace-nowrap">{category.label}</span>
    </button>
  );
}

export default function EventCategoriesSection() {
  const [activeKey, setActiveKey] = useState<CategoryKey>("public-free");
  const activeCategory = CATEGORIES.find((c) => c.key === activeKey)!;

  const { data, isLoading } = useQuery({
    queryKey: ["category-events", activeKey],
    queryFn: () =>
      eventService.getAll({
        ...activeCategory.query,
        sortBy: "date",
        sortOrder: "asc",
        limit: 6,
        page: 1,
      }),
    staleTime: 1000 * 60 * 2,
  });

  const events = data?.data || [];
  const total = data?.meta?.total || 0;

  return (
    <section className="py-24 bg-[#07070e] relative overflow-hidden">
      {/* Section separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Browse by Type
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Event Categories
            </h2>
            <Link
              href={`/events?type=${activeCategory.query.type}${activeCategory.query.minFee ? "&minFee=1" : ""}${activeCategory.query.maxFee === 0 ? "&maxFee=0" : ""}`}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-violet-400 transition-colors group"
            >
              See all {activeCategory.label.toLowerCase()}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat.key}
              category={cat}
              isActive={activeKey === cat.key}
              onClick={() => setActiveKey(cat.key)}
            />
          ))}
        </div>

        {/* Active category descriptor */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${activeCategory.color} border ${activeCategory.borderColor} mb-8`}>
          <activeCategory.icon className={`w-3.5 h-3.5 ${activeCategory.iconColor}`} />
          <span className={`text-xs font-medium ${activeCategory.iconColor}`}>
            {activeCategory.description}
          </span>
          {!isLoading && (
            <span className="text-xs text-zinc-600 ml-1">— {total} event{total !== 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Events grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#111118] border border-white/5 rounded-2xl p-5 animate-pulse h-64"
              >
                <div className="h-3 bg-white/5 rounded w-1/3 mb-4" />
                <div className="h-5 bg-white/5 rounded w-full mb-2" />
                <div className="h-5 bg-white/5 rounded w-3/4 mb-4" />
                <div className="h-3 bg-white/5 rounded w-1/2 mb-2" />
                <div className="h-3 bg-white/5 rounded w-2/5" />
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`w-14 h-14 rounded-2xl ${activeCategory.color} border ${activeCategory.borderColor} flex items-center justify-center mb-4`}>
              <activeCategory.icon className={`w-6 h-6 ${activeCategory.iconColor}`} />
            </div>
            <p className="text-white font-semibold mb-1">No events in this category</p>
            <p className="text-zinc-600 text-sm">Be the first to create a {activeCategory.label.toLowerCase()} event.</p>
          </div>
        )}
      </div>
    </section>
  );
}