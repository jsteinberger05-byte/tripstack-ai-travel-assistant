import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, MapPin, Sparkles, ChevronRight, Loader2 } from "lucide-react";

const VIBE_EMOJIS = {
  culture: "🏛️", food: "🍜", outdoors: "🏔️",
  luxury: "✨", budget: "💸", nightlife: "🌙",
};

function RecommendationCard({ rec, onSelect }) {
  return (
    <button
      onClick={() => onSelect(rec)}
      className="text-left bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-sky-300 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-lg">{VIBE_EMOJIS[rec.vibe] || "🌍"}</span>
            <span className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">{rec.destinations}</span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {rec.origin} → {rec.destinations}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors shrink-0 mt-1" />
      </div>
      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{rec.why}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 capitalize">{rec.vibe}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">{rec.days}d</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">${rec.budget}</span>
        {rec.tag && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">{rec.tag}</span>
        )}
      </div>
    </button>
  );
}

export default function PopularTrips({ currentInputs, onSelect }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const lastInputRef = useRef("");

  // Generate a stable key from relevant inputs
  const inputKey = `${currentInputs.vibe}-${currentInputs.budget}-${currentInputs.origin}-${currentInputs.days}-${currentInputs.travelers}`;

  useEffect(() => {
    // Don't fetch on empty inputs
    if (!currentInputs.vibe || !currentInputs.budget) return;
    // Don't refetch if nothing meaningful changed
    if (inputKey === lastInputRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRecommendations();
      lastInputRef.current = inputKey;
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [inputKey]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are TripStack, an AI travel advisor. Based on the user's preferences, suggest 4 popular trip ideas they would love.

User preferences:
- Origin: ${currentInputs.origin || "any city"}
- Budget: $${currentInputs.budget} total
- Travel vibe: ${currentInputs.vibe}
- Preferred trip length: ${currentInputs.days} days
- Travelers: ${currentInputs.travelers}

Generate 4 diverse destination recommendations that match these preferences.
For each: pick a destination, explain in 1-2 sentences WHY it's a great match for their vibe and budget, and assign a short catchy tag like "Hidden Gem", "Top Trending", "Best Value", or "Must See".
Keep destinations varied — mix popular and off-the-beaten-path options.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  destinations: { type: "string" },
                  origin: { type: "string" },
                  why: { type: "string" },
                  vibe: { type: "string" },
                  days: { type: "number" },
                  budget: { type: "number" },
                  hotel_style: { type: "string" },
                  flight_priority: { type: "string" },
                  tag: { type: "string" }
                }
              }
            }
          }
        }
      });
      setRecommendations(result.recommendations || []);
    } catch {
      // silently fail — section just won't show
    } finally {
      setLoading(false);
    }
  };

  if (!loading && recommendations.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-sky-500" />
        <h3 className="font-bold text-slate-900">Recommended for You</h3>
        <span className="text-xs text-slate-400 ml-1">based on your preferences</span>
        {loading && <Loader2 className="w-4 h-4 text-sky-400 animate-spin ml-1" />}
      </div>

      {loading && recommendations.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-3" />
              <div className="h-8 bg-slate-100 rounded mb-3" />
              <div className="flex gap-1">
                <div className="h-4 bg-slate-100 rounded-full w-12" />
                <div className="h-4 bg-slate-100 rounded-full w-10" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((rec, i) => (
            <RecommendationCard
              key={i}
              rec={{ ...rec, origin: rec.origin || currentInputs.origin || "Your city" }}
              onSelect={(r) => onSelect({
                ...currentInputs,
                destinations: r.destinations,
                origin: r.origin || currentInputs.origin,
                vibe: r.vibe || currentInputs.vibe,
                days: r.days || currentInputs.days,
                budget: r.budget || currentInputs.budget,
                hotel_style: r.hotel_style || currentInputs.hotel_style,
                flight_priority: r.flight_priority || currentInputs.flight_priority,
              })}
            />
          ))}
        </div>
      )}
      <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> Click any card to pre-fill your trip form
      </p>
    </section>
  );
}