/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from "@/src/utils/formatDate";
import Link from "next/link";

// EventCard.tsx
export default function EventCard({ event }: any) {
  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              event.type === "PUBLIC"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {event.type}
          </span>
        </div>

        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              className={`font-semibold ${
                event.registrationFee === 0
                  ? "text-green-400"
                  : "text-violet-400"
              }`}
            >
              {event.registrationFee === 0
                ? "Free"
                : `$${event.registrationFee}`}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {event.creator.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-zinc-500">
                {event.creator.name}
              </span>
            </div>
            <Link href={`/events/${event.id}`}>
              <button className="px-3 py-1 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all duration-200">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
