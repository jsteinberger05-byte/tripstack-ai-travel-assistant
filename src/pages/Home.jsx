import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useLocation } from "react-router-dom";
import { Compass, ArrowDown } from "lucide-react";
import TripInputForm from "@/components/trip/TripInputForm";
import TripResults from "@/components/trip/TripResults";
import PopularTrips from "@/components/trip/PopularTrips";
import { generateTripWithAI, SAMPLE_INPUTS } from "@/lib/tripGenerator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [siteContent, setSiteContent] = useState(null);
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [inputs, setInputs] = useState({
    origin: "", destinations: "", depart_date: "", days: 5, travelers: 2,
    budget: 3000, vibe: "culture", hotel_style: "central", flight_priority: "price"
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.SiteContent.list().then(items => {
      if (items.length > 0) setSiteContent(items[0]);
    }).catch(() => {});
    base44.entities.AppSettings.list().then(items => {
      if (items.length > 0) {
        setSettings(items[0]);
        setInputs(prev => ({
          ...prev,
          origin: items[0].default_origin || prev.origin,
          budget: items[0].default_budget || prev.budget,
        }));
      }
    }).catch(() => {});

    // Load inputs from a previous trip if regenerating
    const params = new URLSearchParams(location.search);
    const regenerateId = params.get("regenerate");
    if (regenerateId) {
      base44.entities.Trip.get(regenerateId).then(trip => {
        setInputs({
          origin: trip.origin || "",
          destinations: trip.destinations || "",
          depart_date: trip.depart_date || "",
          days: trip.days || 5,
          travelers: trip.travelers || 2,
          budget: trip.budget || 3000,
          vibe: trip.vibe || "culture",
          hotel_style: trip.hotel_style || "central",
          flight_priority: trip.flight_priority || "price",
        });
      }).catch(() => {});
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateTripWithAI(inputs);
      setResults(result);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch {
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSample = async () => {
    setInputs(SAMPLE_INPUTS);
    setLoading(true);
    try {
      const result = await generateTripWithAI(SAMPLE_INPUTS);
      setResults(result);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch {
      toast({ title: "Generation failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!results) return;
    try {
      const trip = await base44.entities.Trip.create({
        title: `${inputs.origin} → ${inputs.destinations}`,
        origin: inputs.origin,
        destinations: inputs.destinations,
        depart_date: inputs.depart_date,
        days: inputs.days,
        travelers: inputs.travelers,
        budget: inputs.budget,
        vibe: inputs.vibe,
        hotel_style: inputs.hotel_style,
        flight_priority: inputs.flight_priority,
        flights: JSON.stringify(results.flights),
        hotels: JSON.stringify(results.hotels),
        itinerary: JSON.stringify(results.itinerary),
        overall_score: results.overallScore,
        user_id: user?.id,
      });
      toast({ title: "Trip saved!" });
      navigate(`/trip/${trip.id}`);
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const heroTitle = siteContent?.hero_title || "Build a ranked trip plan in minutes.";
  const heroSubtitle = siteContent?.hero_subtitle || "AI-powered travel assistant that ranks flights, hotels, and activities based on your preferences.";

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sky-600 via-violet-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-sky-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
            <Compass className="w-4 h-4" />
            <span>{siteContent?.brand_name || "TripStack"} AI Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">{heroTitle}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">{heroSubtitle}</p>
          <button
            onClick={() => document.getElementById("trip-form")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            Start Planning <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Trip Planner */}
      <section id="trip-form" className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <TripInputForm
          inputs={inputs}
          onChange={setInputs}
          onGenerate={handleGenerate}
          onSample={handleSample}
          loading={loading}
          sampleEnabled={settings?.sample_trips_enabled !== false}
          settings={settings}
        />
      </section>

      {/* Popular Recommendations */}
      <PopularTrips
        currentInputs={inputs}
        onSelect={(prefilled) => {
          setInputs(prefilled);
          document.getElementById("trip-form")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Results */}
      {results && (
        <section ref={resultsRef} className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Trip Plan</h2>
            <Button onClick={handleSave} className="bg-gradient-to-r from-sky-500 to-violet-600 text-white">
              Save Trip
            </Button>
          </div>
          <TripResults
            flights={results.flights}
            hotels={results.hotels}
            itinerary={results.itinerary}
            overallScore={results.overallScore}
          />
        </section>
      )}
    </div>
  );
}