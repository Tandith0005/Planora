/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Send,
  Inbox,
  Search,
  ChevronDown,
  Check,
  X,
  Loader2,
  Mail,
  Calendar,
  UserPlus,
  BellOff,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/src/utils/formatDate";
import { useRouter } from "next/navigation";
import { searchUsers } from "@/src/services/auth.service";
import { getMyPrivateEvents } from "@/src/services/event.service";
import { acceptInvitation, declineInvitation, getMyInvitations, sendInvitation } from "@/src/services/invitation.service";


// ── Shared styles ─────────────────────────────────────────────────────────────
const inputClass =
  "w-full bg-[#0d0d14] border border-white/8 hover:border-white/15 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 text-sm transition-all outline-none";

// ── Send Invite Tab ───────────────────────────────────────────────────────────
function SendInviteTab() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [alreadyInvited, setAlreadyInvited] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const { data: privateEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["my-private-events"],
    queryFn: getMyPrivateEvents,
  });

  const { data: searchResults = [], isFetching: searching } = useQuery({
    queryKey: ["user-search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const inviteMutation = useMutation({
    mutationFn: sendInvitation,
    onSuccess: (_, vars) => {
      toast.success("Invitation sent!");
      setAlreadyInvited((prev) => new Set(prev).add(vars.invitedUserId));
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to send invitation");
    },
  });

  const handleInvite = (userId: string) => {
    if (!selectedEvent) {
      toast.error("Please select an event first");
      return;
    }
    inviteMutation.mutate({ eventId: selectedEvent.id, invitedUserId: userId });
  };

  return (
    <div className="space-y-6">
      {/* Step 1 — Pick event */}
      <div className="bg-[#111118] border border-white/8 rounded-2xl p-6">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] flex items-center justify-center font-bold">1</span>
          Select your private event
        </p>

        {eventsLoading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading events...
          </div>
        ) : privateEvents.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-300/70">
              You don&apos;t have any private events.{" "}
              <span
                onClick={() => router.push("/dashboard/my-events/create")}
                className="text-amber-400 underline cursor-pointer"
              >
                Create one
              </span>
            </p>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setEventDropdownOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0d0d14] border border-white/8 hover:border-white/15 rounded-xl text-sm transition-all"
            >
              {selectedEvent ? (
                <span className="text-white font-medium">{selectedEvent.title}</span>
              ) : (
                <span className="text-zinc-600">Choose an event...</span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-zinc-500 transition-transform ${eventDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {eventDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setEventDropdownOpen(false)}
                />
                <div className="absolute top-full mt-2 w-full bg-[#111118] border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-20 overflow-hidden max-h-60 overflow-y-auto">
                  {privateEvents.map((event: any) => (
                    <button
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setEventDropdownOpen(false);
                        setAlreadyInvited(new Set());
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-all flex items-center justify-between ${
                        selectedEvent?.id === event.id ? "text-violet-400 bg-violet-500/5" : "text-zinc-300"
                      }`}
                    >
                      <span>{event.title}</span>
                      <span className="text-xs text-zinc-600">{formatDate(event.date)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Step 2 — Search users */}
      <div className="bg-[#111118] border border-white/8 rounded-2xl p-6">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] flex items-center justify-center font-bold">2</span>
          Search & invite users
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className={`${inputClass} pl-10`}
          />
          {searching && (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 animate-spin" />
          )}
        </div>

        {/* Results */}
        <div className="space-y-2">
          {debouncedQuery.length < 2 ? (
            <p className="text-center text-zinc-600 text-sm py-6">
              Type at least 2 characters to search
            </p>
          ) : searching ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
            </div>
          ) : searchResults.length === 0 ? (
            <p className="text-center text-zinc-600 text-sm py-6">No users found</p>
          ) : (
            searchResults.map((u: any) => {
              const invited = alreadyInvited.has(u.id);
              const isSending =
                inviteMutation.isPending &&
                inviteMutation.variables?.invitedUserId === u.id;

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 border border-violet-500/20 flex items-center justify-center text-violet-300 text-sm font-bold flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInvite(u.id)}
                    disabled={invited || isSending || !selectedEvent}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      invited
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                        : !selectedEvent
                        ? "bg-white/5 text-zinc-600 cursor-not-allowed"
                        : "bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 border border-violet-500/30 hover:border-violet-500/50"
                    }`}
                  >
                    {isSending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : invited ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Invited
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" /> Invite
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── My Invitations Tab ────────────────────────────────────────────────────────
function MyInvitationsTab() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: invitations = [], isLoading } = useQuery({
    queryKey: ["my-invitations"],
    queryFn: getMyInvitations,
  });

  const acceptMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });

      if (data?.requiresPayment) {
        toast("Invitation accepted! Complete payment to confirm your spot.", { icon: "💳" });
        router.push(`/events/${data.eventId}`);
        return;
      }
      toast.success("You joined the event! 🎉");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to accept invitation");
    },
  });

  const declineMutation = useMutation({
    mutationFn: declineInvitation,
    onSuccess: () => {
      toast.success("Invitation declined");
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to decline invitation");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-[#111118] border border-white/8 rounded-2xl p-5 animate-pulse">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded w-1/3" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <BellOff className="w-9 h-9 text-zinc-600" />
        </div>
        <p className="text-white font-semibold text-lg">No invitations yet</p>
        <p className="text-zinc-600 text-sm mt-1">
          When someone invites you to a private event, it will appear here.
        </p>
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    ACCEPTED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    DECLINED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="space-y-3">
      {invitations.map((inv: any) => {
        const isPending = inv.status === "PENDING";
        const isAccepting =
          acceptMutation.isPending && acceptMutation.variables === inv.id;
        const isDeclining =
          declineMutation.isPending && declineMutation.variables === inv.id;

        return (
          <div
            key={inv.id}
            className={`bg-[#111118] border rounded-2xl p-5 transition-all ${
              isPending
                ? "border-violet-500/20 shadow-sm shadow-violet-500/5"
                : "border-white/5"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isPending
                  ? "bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20"
                  : "bg-white/5"
              }`}>
                <Mail className={`w-5 h-5 ${isPending ? "text-violet-400" : "text-zinc-600"}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className={`font-semibold text-sm mb-0.5 ${isPending ? "text-white" : "text-zinc-400"}`}>
                      {inv.event?.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                      <Calendar className="w-3 h-3" />
                      {formatDate(inv.event?.date)}
                    </div>
                    {inv.event?.registrationFee > 0 && (
                      <p className="text-xs text-violet-400 mt-1">
                        💎 ${inv.event.registrationFee} registration fee
                      </p>
                    )}
                  </div>

                  {/* Status badge */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[inv.status] || ""}`}>
                    {inv.status}
                  </span>
                </div>

                {/* Actions for pending */}
                {isPending && (
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => acceptMutation.mutate(inv.id)}
                      disabled={isAccepting || isDeclining}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all disabled:opacity-50"
                    >
                      {isAccepting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Accept
                    </button>
                    <button
                      onClick={() => declineMutation.mutate(inv.id)}
                      disabled={isAccepting || isDeclining}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all disabled:opacity-50"
                    >
                      {isDeclining ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InvitationsPage() {
  const [tab, setTab] = useState<"send" | "received">("received");
  const { data: invitations = [] } = useQuery({
    queryKey: ["my-invitations"],
    queryFn: getMyInvitations,
  });

  const pendingCount = invitations.filter((i: any) => i.status === "PENDING").length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tight">Invitations</h1>
        <p className="text-zinc-500 mt-2 text-sm">
          Send invites to your private events or manage invitations you&apos;ve received
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/8 rounded-2xl mb-6">
        <button
          onClick={() => setTab("received")}
          className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            tab === "received"
              ? "bg-[#111118] text-white shadow-lg border border-white/8"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Inbox className="w-4 h-4" />
          Received
          {pendingCount > 0 && (
            <span className="w-5 h-5 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("send")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            tab === "send"
              ? "bg-[#111118] text-white shadow-lg border border-white/8"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Send className="w-4 h-4" />
          Send Invite
        </button>
      </div>

      {/* Tab content */}
      {tab === "received" ? <MyInvitationsTab /> : <SendInviteTab />}
    </div>
  );
}