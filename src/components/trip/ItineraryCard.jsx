import React from "react";
import { Sunrise, Sun, Moon, Zap, StickyNote } from "lucide-react";

export default function ItineraryCard({ day }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Day {day.day}</span>
          <h4 className="font-semibold text-slate-900">{day.title}</h4>
        </div>
        <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">{day.energy}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Sunrise className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Morning</span>
            <p className="text-sm text-slate-700">{day.morning}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Sun className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Afternoon</span>
            <p className="text-sm text-slate-700">{day.afternoon}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Moon className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Evening</span>
            <p className="text-sm text-slate-700">{day.evening}</p>
          </div>
        </div>
      </div>
      {day.note && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-1.5">
          <StickyNote className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 italic">{day.note}</p>
        </div>
      )}
    </div>
  );
}