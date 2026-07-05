import React from "react";
import { Plane, Building2, CalendarDays } from "lucide-react";
import ScoreBadge from "@/components/trip/ScoreBadge";
import FlightCard from "@/components/trip/FlightCard";
import HotelCard from "@/components/trip/HotelCard";
import ItineraryCard from "@/components/trip/ItineraryCard";

export default function TripResults({ flights, hotels, itinerary, overallScore }) {
  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <div className="text-center py-6">
        <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Overall Trip Fit Score</p>
        <ScoreBadge score={overallScore} size="lg" />
      </div>

      {/* Flights */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Plane className="w-5 h-5 text-sky-500" />
          <h3 className="text-lg font-bold text-slate-900">Ranked Flights</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {flights.map((f, i) => (
            <FlightCard key={i} flight={f} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Hotels */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg font-bold text-slate-900">Ranked Hotels</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {hotels.map((h, i) => (
            <HotelCard key={i} hotel={h} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Itinerary */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-bold text-slate-900">Day-by-Day Itinerary</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {itinerary.map((d, i) => (
            <ItineraryCard key={i} day={d} />
          ))}
        </div>
      </section>
    </div>
  );
}