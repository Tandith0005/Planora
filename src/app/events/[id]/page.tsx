/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Lock,
  Globe,
  ArrowLeft,
  Heart,
  Share2,
  Ticket,
  Sparkles,
  CreditCard,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getSingleEvent } from "@/src/services/event.service";
import { useAuth } from "@/src/hooks/useAuth";
import { formatDate } from "@/src/utils/formatDate";
import { joinEvent } from "@/src/services/participant.service";
import { createCheckoutSession } from "@/src/services/payment.service";


// ── Component ─────────────────────────────────────────────────────────────────
export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // "idle" | "joined" (pending payment) | "redirecting"
  const [paymentStep, setPaymentStep] = useState<"idle" | "joined" | "redirecting">("idle");
  const [isLiked, setIsLiked] = useState(false);

  const eventId = params.id as string;

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getSingleEvent(eventId),
  });

  // Step 1 — join (creates pending participant)
  const joinMutation = useMutation({
    mutationFn: () => joinEvent(eventId),
    onSuccess: (data) => {
      if (data.requiresPayment) {
        setPaymentStep("joined");
        toast("Spot reserved! Complete payment to confirm your seat.", { icon: "🎟️" });
      } else {
        toast.success("Successfully joined the event! 🎉");
        queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to join event");
    },
  });

  // Step 2 — create Stripe checkout and redirect
  const checkoutMutation = useMutation({
    mutationFn: () => createCheckoutSession(eventId),
    onSuccess: (data) => {
      if (data.url) {
        setPaymentStep("redirecting");
        window.location.href = data.url;
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create checkout session");
      setPaymentStep("joined"); // stay on the proceed button
    },
  });

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <Sparkles className="w-6 h-6 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-violet-400 mt-4 animate-pulse">Loading amazing event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="relative">
          <AlertCircle className="w-24 h-24 text-red-500 mb-4 animate-pulse" />
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="text-zinc-400 mb-6">
          The event you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Events
        </Link>
      </div>
    );
  }

  const eventData = event.data || event;
  const isOwner = user?.id === eventData.creatorId;

  // ── Action config ───────────────────────────────────────────────────────────
  const getActionConfig = () => {
    if (isOwner) {
      return { label: "You're the Organizer", disabled: true, type: "neutral", icon: User };
    }
    if (eventData.type === "PRIVATE") {
      return { label: "Invitation Only", disabled: true, type: "neutral", icon: Lock };
    }
    if (eventData.registrationFee > 0) {
      return {
        label: `Pay $${eventData.registrationFee} & Join`,
        disabled: false,
        type: "primary",
        icon: DollarSign,
      };
    }
    return { label: "Join Event — It's Free! 🎉", disabled: false, type: "success", icon: CheckCircle };
  };

  const actionConfig = getActionConfig();

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to join this event");
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }
    joinMutation.mutate();
  };

  const isJoining = joinMutation.isPending;
  const isCheckingOut = checkoutMutation.isPending || paymentStep === "redirecting";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#050508] pt-20 pb-12">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
        {/* Main Card */}
        <div className="bg-[#111118]/90 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

          {/* ── Header ── */}
          <div className="p-6 sm:p-8 border-b border-white/5">
            <div className="flex flex-wrap items-start justify-between gap-6">

              {/* Left: meta + title */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    eventData.type === "PUBLIC"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    <Globe className="w-3 h-3 inline mr-1" />
                    {eventData.type}
                  </span>

                  {eventData.registrationFee === 0 ? (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30">
                      ✨ Free Event
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30">
                      💎 ${eventData.registrationFee}
                    </span>
                  )}

                  <span className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-zinc-400 border border-white/10">
                    <Ticket className="w-3 h-3 inline mr-1" />
                    Limited Spots
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                  {eventData.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    {formatDate(eventData.date)}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                    <Clock className="w-4 h-4 text-violet-400" />
                    7:00 PM - 10:00 PM
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                    <MapPin className="w-4 h-4 text-violet-400" />
                    {eventData.venue}
                  </div>
                </div>
              </div>

              {/* Right: CTA */}
              <div className="w-full md:w-auto flex flex-col items-center gap-3">

                {/* ── STEP 1: initial join button ── */}
                {paymentStep === "idle" && (
                  <button
                    onClick={handleJoinClick}
                    disabled={actionConfig.disabled || isJoining}
                    className={`group relative w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-2 overflow-hidden ${
                      actionConfig.type === "success"
                        ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-emerald-500/30"
                        : actionConfig.type === "primary"
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-violet-500/30"
                        : "bg-zinc-700 cursor-not-allowed opacity-70"
                    }`}
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Reserving spot...
                      </>
                    ) : (
                      <>
                        {actionConfig.icon && (
                          <actionConfig.icon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        )}
                        {actionConfig.label}
                      </>
                    )}
                  </button>
                )}

                {/* ── STEP 2: spot reserved — proceed to payment ── */}
                {paymentStep === "joined" && (
                  <div className="w-full md:w-auto flex flex-col items-center gap-3">
                    {/* Confirmation pill */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">Spot reserved!</span>
                    </div>

                    {/* Proceed to payment */}
                    <button
                      onClick={() => checkoutMutation.mutate()}
                      disabled={isCheckingOut}
                      className="group w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-2xl shadow-violet-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Redirecting to Stripe...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Proceed to Payment
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-zinc-600 text-center max-w-[200px]">
                      Your spot is held for this session. Complete payment to confirm.
                    </p>
                  </div>
                )}

                {/* ── STEP 3: redirecting indicator ── */}
                {paymentStep === "redirecting" && (
                  <div className="flex flex-col items-center gap-3 py-2">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                    <p className="text-sm text-zinc-400">Taking you to Stripe...</p>
                  </div>
                )}

                {/* Sub-label */}
                {paymentStep === "idle" && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-xs text-zinc-500">
                      {eventData.type === "PRIVATE"
                        ? "🔒 Invitation only"
                        : eventData.registrationFee > 0
                        ? "💳 Secure payment via Stripe"
                        : "✅ Instant confirmation"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Content Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3">

            {/* Left: Description */}
            <div className="lg:col-span-2 p-6 sm:p-8 border-r border-white/5">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                About This Event
              </h3>
              <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                <p className="text-lg">{eventData.description}</p>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="bg-gradient-to-b from-[#0d0d14] to-[#0a0a0f] p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-violet-400" />
                Event Details
              </h3>

              <div className="space-y-4">
                {[
                  {
                    icon: Calendar,
                    label: "Date & Time",
                    main: formatDate(eventData.date),
                    sub: "Doors open at 6:30 PM",
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    main: eventData.venue,
                    sub: <span className="text-xs text-violet-400 cursor-pointer hover:underline">Get Directions →</span>,
                  },
                  {
                    icon: DollarSign,
                    label: "Price",
                    main: (
                      <span className={`text-2xl font-bold ${eventData.registrationFee === 0 ? "text-emerald-400" : "text-violet-400"}`}>
                        {eventData.registrationFee === 0 ? "FREE" : `$${eventData.registrationFee}`}
                      </span>
                    ),
                    sub: eventData.registrationFee > 0 ? "+ applicable fees" : null,
                  },
                  {
                    icon: User,
                    label: "Organizer",
                    main: eventData.creator?.name,
                    sub: eventData.creator?.email,
                  },
                ].map(({ icon: Icon, label, main, sub }) => (
                  <div key={label} className="group p-4 rounded-xl hover:bg-white/5 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">{label}</p>
                        <p className="text-white font-medium">{main}</p>
                        {sub && <p className="text-xs text-zinc-500">{sub}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Private event warning */}
              {eventData.type === "PRIVATE" && (
                <div className="mt-6 p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-400">Private Event</p>
                      <p className="text-xs text-amber-200/70 mt-1">
                        This event is invite-only. Your request will be reviewed by the organizer within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}