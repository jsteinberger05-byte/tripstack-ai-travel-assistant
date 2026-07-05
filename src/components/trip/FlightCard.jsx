import React from "react";
import { Plane } from "lucide-react";
import ScoreBadge from "@/components/trip/ScoreBadge";

export default function FlightCard({ flight, rank }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold shrink-0">
            #{rank}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900">{flight.airline}</span>
              {flight.tag && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                  {flight.tag}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{flight.route}</p>
          </div>
        </div>
        <ScoreBadge score={flight.score} size="sm" />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-slate-50 rounded-lg py-1.5 px-2">
          <p className="text-[10px] text-slate-400 uppercase">Price</p>
          <p className="text-sm font-semibold text-slate-800">${flight.price}</p>
        </div>
        <div className="bg-slate-50 rounded-lg py-1.5 px-2">
          <p className="text-[10px] text-slate-400 uppercase">Duration</p>
          <p className="text-sm font-semibold text-slate-800">{flight.duration}</p>
        </div>
        <div className="bg-slate-50 rounded-lg py-1.5 px-2">
          <p className="text-[10px] text-slate-400 uppercase">Stops</p>
          <p className="text-sm font-semibold text-slate-800">{flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
        <Plane className="w-3 h-3 text-sky-400" />
        {flight.reason}
      </p>
    </div>
  );
}