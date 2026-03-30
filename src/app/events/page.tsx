/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { CalendarDays, Filter, Search, X } from 'lucide-react'; // Added X icon for reset
import { getAllEvents } from '@/src/services/event.service';
import EventCard from '@/src/components/event/EventCard';
import Navbar from '@/src/components/common/Navbar';

function EventContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- URL State (Source of Truth) ---
  const page = Number(searchParams.get('page')) || 1;
  const urlSearch = searchParams.get('search') || '';
  const urlType = searchParams.get('type') || '';
  const urlMinFee = searchParams.get('minFee') || '';
  const urlMaxFee = searchParams.get('maxFee') || '';

  // --- Local State (For Inputs before clicking Apply) ---
  const [tempSearch, setTempSearch] = useState(urlSearch);
  const [tempType, setTempType] = useState(urlType);
  const [tempMinFee, setTempMinFee] = useState(urlMinFee);
  const [tempMaxFee, setTempMaxFee] = useState(urlMaxFee);

  // Sync local state when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    setTempSearch(urlSearch);
    setTempType(urlType);
    setTempMinFee(urlMinFee);
    setTempMaxFee(urlMaxFee);
  }, [urlSearch, urlType, urlMinFee, urlMaxFee]);

  // --- Data State ---
  const [events, setEvents] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data whenever URL params change
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllEvents({
          page,
          limit: 9,
          search: urlSearch || undefined,
          type: urlType || undefined,
          minFee: urlMinFee ? Number(urlMinFee) : undefined,
          maxFee: urlMaxFee ? Number(urlMaxFee) : undefined,
        });

        const eventsList = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || []);
        
        const metaInfo = response.meta || response.data?.meta || {};

        setEvents(eventsList);
        setMeta(metaInfo);

      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, urlSearch, urlType, urlMinFee, urlMaxFee]);

  // --- Handlers ---

  // Apply all current local states to the URL
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    
    // Always reset to page 1 when applying new filters
    params.set('page', '1'); 

    if (tempSearch) params.set('search', tempSearch);
    if (tempType) params.set('type', tempType);
    if (tempMinFee) params.set('minFee', tempMinFee);
    if (tempMaxFee) params.set('maxFee', tempMaxFee);

    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle Enter key in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  // Reset all filters
  const handleReset = () => {
    setTempSearch('');
    setTempType('');
    setTempMinFee('');
    setTempMaxFee('');
    router.push(pathname); // Clears URL
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-violet-400 animate-pulse">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-500 bg-red-500/10 px-6 py-4 rounded-lg border border-red-500/20">
          Error: {error}
        </div>
      </div>
    );
  }

  // Check if there are active filters to show the Reset button or highlight the Filter button
  const hasActiveFilters = urlSearch || urlType || urlMinFee || urlMaxFee;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen pt-20 mt-10">
      {/* Header & Filters */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-white mb-6">Explore Events</h1>
        
        <div className="bg-[#111118] p-4 rounded-xl border border-white/5 space-y-4">
          
          {/* Row 1: Search & Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search events or organizers..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            
            <button
              onClick={handleApplyFilters}
              className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/20 px-4 py-2 rounded-lg transition-all"
                title="Clear all filters"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          {/* Row 2: Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
            {/* Type Filter */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Event Type</label>
              <select
                value={tempType}
                onChange={(e) => setTempType(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 cursor-pointer appearance-none"
              >
                <option value="">All Types</option>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            {/* Min Fee */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Min Fee ($)</label>
              <input
                type="number"
                placeholder="0"
                value={tempMinFee}
                onChange={(e) => setTempMinFee(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Max Fee */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Max Fee ($)</label>
              <input
                type="number"
                placeholder="Any"
                value={tempMaxFee}
                onChange={(e) => setTempMaxFee(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
          
          {/* Quick Preset Chips (Optional UX improvement) */}
          <div className="flex gap-2 pt-2">
             <button 
               onClick={() => { setTempMinFee('0'); setTempMaxFee('0'); }}
               className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-green-500/20 text-zinc-400 hover:text-green-400 border border-white/5 hover:border-green-500/30 transition-all"
             >
               Free Events Only
             </button>
             <button 
               onClick={() => { setTempMinFee('1'); setTempMaxFee(''); }}
               className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-violet-500/20 text-zinc-400 hover:text-violet-400 border border-white/5 hover:border-violet-500/30 transition-all"
             >
               Paid Events Only
             </button>
          </div>

        </div>
      </div>

      {/* Event Grid */}
      {events.length === 0 ? (
        <div className="text-center py-20 bg-[#111118] rounded-xl border border-white/5">
          <CalendarDays className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg">No events found matching your criteria.</p>
          {hasActiveFilters && (
            <button 
              onClick={handleReset}
              className="mt-4 text-violet-400 hover:text-violet-300 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-15">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-[#111118] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
          >
            Previous
          </button>
          
          <span className="text-zinc-400 px-4">
            Page <span className="text-white font-bold">{page}</span> of {meta.totalPage}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === meta.totalPage}
            className="px-4 py-2 rounded-lg bg-[#111118] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function EventPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading...
      </div>
    }>
      <Navbar />
      <EventContent />
    </Suspense>
  );
}