import Link from "next/link";
import { ArrowRight, Plus, Users, Zap, Shield, Globe } from "lucide-react";

const STATS = [
  { value: "100+", label: "Events Created" },
  { value: "500+", label: "Participants" },
  { value: "50+", label: "Organizers" },
  { value: "4.8★", label: "Avg Rating" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Join",
    description: "Public free events let you join instantly with one click.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Stripe-powered payments with full receipts and refund support.",
  },
  {
    icon: Globe,
    title: "Public & Private",
    description: "Host open events or invite-only gatherings — your choice.",
  },
];

export default function CTASection() {
  return (
    <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-5 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <p className="text-3xl font-black text-white mb-1 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main CTA block */}
        <div className="relative rounded-3xl overflow-hidden border border-white/8">
          {/* BG gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-[#0d0d18] to-indigo-600/10" />

          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, #a78bfa 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 px-8 sm:px-12 lg:px-16 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left copy */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-6">
                  ✦ Start Today — It's Free
                </div>

                <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight mb-5">
                  Your next great
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                    event starts here.
                  </span>
                </h2>

                <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-md">
                  Whether you're organizing a conference for thousands or a private dinner for twelve — Planora gives you the tools to make it happen.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/my-events"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4" />
                    Create an Event
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/events"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-semibold rounded-xl transition-all duration-200 border border-white/10"
                  >
                    <Users className="w-4 h-4" />
                    Join an Event
                  </Link>
                </div>
              </div>

              {/* Right: feature cards */}
              <div className="space-y-4">
                {FEATURES.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 hover:bg-white/[0.05] transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
                      <Icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-white text-sm font-semibold mb-1">{title}</h3>
                      <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}