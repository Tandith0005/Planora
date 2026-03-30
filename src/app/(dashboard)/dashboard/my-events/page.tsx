/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Calendar, Users, Edit3, Trash2, Plus, MapPin } from "lucide-react";
import { formatDate, formatFee } from "@/src/utils/formatDate";
import { deleteEvent, getMyEvents } from "@/src/services/event.service"; 
import toast from "react-hot-toast";

export default function MyEventsPage() {
const queryClient = useQueryClient(); 
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-events"],
    queryFn: getMyEvents,          
  });
  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast.success("Event deleted successfully");
      // Invalidate and refetch events after deletion
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },
    onError: () => {
      toast.error("Failed to delete event");
    },
  });

  const myEvents = data?.data || [];

  const handleDelete = (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    deleteMutation.mutate(eventId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-violet-400 flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          Loading your events...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">My Events</h1>
          <p className="text-zinc-500 mt-2">Manage events you have created</p>
        </div>

        <Link
          href="/dashboard/my-events/create"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </Link>
      </div>

      {myEvents.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-3xl p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">No events yet</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            You haven&apos;t created any events yet. Start by creating your first event!
          </p>
          <Link
            href="/dashboard/my-events/create"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-2xl font-medium"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map((event: any) => (
            <div
              key={event.id}
              className="bg-[#111118] border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    event.type === "PUBLIC" 
                      ? "bg-emerald-500/10 text-emerald-400" 
                      : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {event.type}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {formatDate(event.date)}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-violet-300 transition-colors">
                  {event.title}
                </h3>

                <p className="text-zinc-400 text-sm line-clamp-2 mb-6">
                  {event.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{event.venue}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Users className="w-4 h-4" />
                    <span>{event.participants?.length || 0} joined</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/my-events/${event.id}/edit`}
                      className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-4 py-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}