import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Copy, Trash2, Printer, MapPin, Calendar, Users, DollarSign, Sparkles, Building2, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripResults from "@/components/trip/TripResults";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
      const t = await base44.entities.Trip.get(id);
      if (t.user_id !== me.id && me.role !== "admin") {
        navigate("/archive");
        return;
      }
      setTrip(t);
    } catch {
      toast({ title: "Trip not found", variant: "destructive" });
      navigate("/archive");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this trip?")) return;
    try {
      await base44.entities.Trip.delete(trip.id);
      toast({ title: "Trip deleted" });
      navigate("/archive");
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleDuplicate = async () => {
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

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!trip) return null;

  const flights = trip.flights ? JSON.parse(trip.flights) : [];
  const hotels = trip.hotels ? JSON.parse(trip.hotels) : [];
  const itinerary = trip.itinerary ? JSON.parse(trip.itinerary) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate("/archive")} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 truncate flex-1">{trip.title}</h1>
      </div>

      {/* Trip Meta */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Trip Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Origin</p>
              <p className="text-sm font-medium text-slate-800">{trip.origin}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-violet-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Destinations</p>
              <p className="text-sm font-medium text-slate-800">{trip.destinations}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Date</p>
              <p className="text-sm font-medium text-slate-800">
                {trip.depart_date ? moment(trip.depart_date).format("MMM D, YYYY") : "—"} · {trip.days}d
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Budget</p>
              <p className="text-sm font-medium text-slate-800">${trip.budget}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Travelers</p>
              <p className="text-sm font-medium text-slate-800">{trip.travelers}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Vibe</p>
              <p className="text-sm font-medium text-slate-800 capitalize">{trip.vibe}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-violet-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Hotel Style</p>
              <p className="text-sm font-medium text-slate-800 capitalize">{trip.hotel_style}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-sky-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Flight Priority</p>
              <p className="text-sm font-medium text-slate-800 capitalize">{trip.flight_priority}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={handleDuplicate}>
            <Copy className="w-3.5 h-3.5 mr-1.5" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Results */}
      <TripResults
        flights={flights}
        hotels={hotels}
        itinerary={itinerary}
        overallScore={trip.overall_score || 0}
      />
    </div>
  );
}