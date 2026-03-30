"use client";

import Sidebar from "@/src/components/layout/Sidebar";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 lg:ml-72">
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}