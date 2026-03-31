"use client";

import { AlertCircle, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#050508] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Icon with Amber Theme */}
        <div className="mx-auto w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-8">
          <AlertCircle className="w-16 h-16 text-amber-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Payment Cancelled</h1>
        
        <p className="text-zinc-400 text-lg mb-2">
          Looks like you didn&apos;t complete your registration.
        </p>
        <p className="text-zinc-500 text-sm mb-10">
          No charges were made to your account. Your spot is not reserved yet.
        </p>

        {/* Action Cards */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-start gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold text-sm">Need help?</h3>
              <p className="text-zinc-500 text-xs mt-1">
                If you encountered an error during checkout, please try again or contact support.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">

          {/* Back to Events - Secondary Action */}
          <Link
            href="/events"
            className="flex items-center justify-center gap-2 px-6 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium"
          >
            Browse Other Events
          </Link>
          
          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs mt-2"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}