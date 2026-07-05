import React from "react";
import { Building2, Star } from "lucide-react";
import ScoreBadge from "@/components/trip/ScoreBadge";

export default function HotelCard({ hotel, rank }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
            #{rank}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900">{hotel.name}</span>
              {hotel.tag && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  {hotel.tag}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-slate-500">{hotel.rating}</span>
            </div>
          </div>
        </div>
        <ScoreBadge score={hotel.score} size="sm" />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-slate-50 rounded-lg py-1.5 px-2">
          <p className="text-[10px] text-slate-400 uppercase">Per Night</p>
          <p className="text-sm font-semibold text-slate-800">${hotel.per_night}</p>
        </div>
        <div className="bg-slate-50 rounded-lg py-1.5 px-2">
          <p className="text-[10px] text-slate-400 uppercase">Total</p>
          <p className="text-sm font-semibold text-slate-800">${hotel.total}</p>
        </div>
        <div className="bg-slate-50 rounded-lg py-1.5 px-2">
          <p className="text-[10px] text-slate-400 uppercase">Location</p>
          <p className="text-sm font-semibold text-slate-800">{hotel.location_score}/100</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
        <Building2 className="w-3 h-3 text-violet-400" />
        {hotel.reason}
      </p>
    </div>
  );
}