import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useNavigate } from "react-router-dom";
import { Archive as ArchiveIcon, MapPin, Calendar, DollarSign, Trash2, Copy, RefreshCw, Search } from "lucide-react";
import ScoreBadge from "@/components/trip/ScoreBadge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

export default function Archive() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
      const myTrips = await base44.entities.Trip.filter({ user_id: me.id }, "-created_date");
      setTrips(myTrips);
    } catch {
      toast({ title: "Failed to load trips", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this trip?")) return;
    try {
      await base44.entities.Trip.delete(id);
      setTrips(prev => prev.filter(t => t.id !== id));
      toast({ title: "Trip deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleDuplicate = async (trip) => {
    try {
      const newTrip = await base44.entities.Trip.create({
        title: `${trip.title} (copy)`,
        origin: trip.origin,
        destinations: trip.destinations,
        depart_date: trip.depart_date,
        days: trip.days,
        travelers: trip.travelers,
        budget: trip.budget,
        vibe: trip.vibe,
        hotel_style: trip.hotel_style,
        flight_priority: trip.flight_priority,
        flights: trip.flights,
        hotels: trip.hotels,
        itinerary: trip.itinerary,
        overall_score: trip.overall_score,
        user_id: user.id,
      });
      toast({ title: "Trip duplicated" });
      navigate(`/trip/${newTrip.id}`);
    } catch {
      toast({ title: "Failed to duplicate", variant: "destructive" });
    }
  };

  const filtered = trips.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (t.title || "").toLowerCase().includes(q) ||
      (t.destinations || "").toLowerCase().includes(q) ||
      (t.vibe || "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ArchiveIcon className="w-6 h-6 text-sky-500" />
            My Saved Trips
          </h1>
          <p className="text-sm text-slate-500 mt-1">{trips.length} trip{trips.length !== 1 ? "s" : ""} saved</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trips..."
            className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 w-full sm:w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <ArchiveIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            {trips.length === 0 ? "No saved trips yet" : "No matching trips"}
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {trips.length === 0 ? "Generate a trip plan and save it to see it here." : "Try a different search term."}
          </p>
          {trips.length === 0 && (
            <Link to="/">
              <Button className="bg-gradient-to-r from-sky-500 to-violet-600 text-white">Plan a Trip</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow group">
              <Link to={`/trip/${trip.id}`} className="block">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 truncate">{trip.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {trip.depart_date ? moment(trip.depart_date).format("MMM D, YYYY") : "No date"} · {trip.days} days
                    </p>
                  </div>
                  {trip.overall_score && <ScoreBadge score={trip.overall_score} size="sm" />}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {trip.vibe && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 capitalize">{trip.vibe}</span>
                  )}
                  {trip.hotel_style && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 capitalize">{trip.hotel_style}</span>
                  )}
                  {trip.budget && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">${trip.budget}</span>
                  )}
                </div>
              </Link>
              <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleDuplicate(trip)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <Copy className="w-3 h-3" /> Duplicate
                </button>
                <Link
                  to={`/?regenerate=${trip.id}`}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </Link>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-red-500 hover:bg-red-50 transition-colors ml-auto"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}