import React from "react";
import { MapPin, Calendar, Users, DollarSign, Sparkles, Building2, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIBES = ["culture", "food", "outdoors", "luxury", "budget", "nightlife"];
const HOTEL_STYLES = ["boutique", "central", "resort", "budget"];
const FLIGHT_PRIORITIES = ["price", "speed", "comfort"];

export default function TripInputForm({ inputs, onChange, onGenerate, onSample, loading, sampleEnabled, settings }) {
  const vibeOptions = settings?.supported_vibes ? settings.supported_vibes.split(",").map(v => v.trim()) : VIBES;
  const maxDays = settings?.max_trip_days || 21;

  const update = (field, value) => onChange({ ...inputs, [field]: value });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-sky-500" />
        Plan Your Trip
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Origin */}
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">Origin</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputs.origin}
              onChange={e => update("origin", e.target.value)}
              placeholder="Where from?"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            />
          </div>
        </div>

        {/* Destinations */}
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">Destinations</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputs.destinations}
              onChange={e => update("destinations", e.target.value)}
              placeholder="Where to? (comma separated)"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            />
          </div>
        </div>

        {/* Departure */}
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">Departure Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={inputs.depart_date}
              onChange={e => update("depart_date", e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            />
          </div>
        </div>

        {/* Days */}
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">Number of Days</label>
          <input
            type="number"
            min={1}
            max={maxDays}
            value={inputs.days}
            onChange={e => update("days", parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
          />
        </div>

        {/* Travelers */}
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">Travelers</label>
          <div className="relative">
            <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min={1}
              max={20}
              value={inputs.travelers}
              onChange={e => update("travelers", parseInt(e.target.value) || 1)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">Budget (USD)</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min={100}
              value={inputs.budget}
              onChange={e => update("budget", parseInt(e.target.value) || 1000)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            />
          </div>
        </div>

        {/* Vibe */}
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Travel Vibe</label>
          <div className="flex flex-wrap gap-2">
            {vibeOptions.map(v => (
              <button
                key={v}
                onClick={() => update("vibe", v)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  inputs.vibe === v
                    ? "bg-sky-100 text-sky-700 ring-1 ring-sky-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Hotel Style */}
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Hotel Style</label>
          <div className="flex flex-wrap gap-2">
            {HOTEL_STYLES.map(h => (
              <button
                key={h}
                onClick={() => update("hotel_style", h)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  inputs.hotel_style === h
                    ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Flight Priority */}
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Flight Priority</label>
          <div className="flex flex-wrap gap-2">
            {FLIGHT_PRIORITIES.map(f => (
              <button
                key={f}
                onClick={() => update("flight_priority", f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  inputs.flight_priority === f
                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-100">
        <Button
          onClick={onGenerate}
          disabled={loading || !inputs.origin || !inputs.destinations}
          className="bg-gradient-to-r from-sky-500 to-violet-600 hover:from-sky-600 hover:to-violet-700 text-white"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1.5" />
              Generate Trip Plan
            </>
          )}
        </Button>
        {sampleEnabled && (
          <Button variant="outline" onClick={onSample} disabled={loading}>
            Try Sample Trip
          </Button>
        )}
      </div>
    </div>
  );
}