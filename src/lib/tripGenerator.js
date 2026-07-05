import { base44 } from "@/api/base44Client";

const AIRLINES = [
  { name: "SkyWay Express", code: "SWE" },
  { name: "GlobalAir", code: "GLA" },
  { name: "Pacific Wings", code: "PWG" },
  { name: "EuroJet", code: "EJT" },
  { name: "Nomad Air", code: "NMA" },
];

const HOTEL_CHAINS = {
  boutique: ["The Locale", "Maison Artisan", "Ember & Oak", "Casa Luma"],
  central: ["CityCore Suites", "Metro Hub Hotel", "Central Park Inn", "Downtown Luxe"],
  resort: ["Azure Bay Resort", "Palm Crest Retreat", "Lagoon Villas", "SunRidge Resort"],
  budget: ["StayEasy Inn", "Backpacker's Base", "NoFrills Lodge", "EcoStay Hostel"],
};

const ACTIVITIES = {
  culture: ["Museum district tour", "Historical walking tour", "Local art gallery visit", "Traditional craft workshop", "Heritage neighborhood stroll", "Live folk performance"],
  food: ["Street food crawl", "Cooking class with local chef", "Food market exploration", "Wine or coffee tasting", "Fine dining experience", "Farm-to-table lunch"],
  outdoors: ["Sunrise hike", "Kayak or canoe adventure", "National park excursion", "Cycling tour", "Beach day with snorkeling", "Zip-line or canopy walk"],
  luxury: ["Private city tour", "Spa & wellness half-day", "Yacht or boat cruise", "VIP rooftop dinner", "Helicopter sightseeing", "Personal shopper experience"],
  budget: ["Free walking tour", "Public park picnic", "Local market browsing", "Self-guided bike ride", "Street art discovery", "Beach or lake day"],
  nightlife: ["Rooftop bar hopping", "Live music venue", "Night market visit", "Jazz or cocktail lounge", "Dance club experience", "Sunset cruise with drinks"],
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr, count = 1) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateFlights(origin, destinations, priority, budget) {
  const dest = destinations.split(",")[0].trim();
  return AIRLINES.map((airline, i) => {
    const basePrice = randomBetween(200, 800);
    const duration = randomBetween(2, 14);
    const stops = randomBetween(0, 2);
    const comfort = randomBetween(60, 98);

    let priceScore = Math.max(0, 100 - (basePrice / budget) * 100);
    let speedScore = Math.max(0, 100 - duration * 5);
    let comfortScore = comfort;

    let rankScore;
    let reason;
    if (priority === "price") {
      rankScore = priceScore * 0.5 + speedScore * 0.25 + comfortScore * 0.25;
      reason = basePrice < 400 ? "Best value for your budget" : basePrice < 600 ? "Moderate price, good overall" : "Premium pricing but highest comfort";
    } else if (priority === "speed") {
      rankScore = speedScore * 0.5 + priceScore * 0.25 + comfortScore * 0.25;
      reason = stops === 0 ? "Direct flight — fastest route" : stops === 1 ? "One stop, still quick" : "Multiple stops but competitive price";
    } else {
      rankScore = comfortScore * 0.5 + priceScore * 0.25 + speedScore * 0.25;
      reason = comfort > 85 ? "Top-rated passenger comfort" : comfort > 70 ? "Good comfort at reasonable price" : "Budget-friendly with basic amenities";
    }

    return {
      airline: airline.name,
      code: airline.code,
      route: `${origin} → ${dest}`,
      price: basePrice,
      duration: `${duration}h`,
      stops,
      comfort,
      score: Math.round(rankScore),
      reason,
      tag: i === 0 ? "Best Pick" : i === 1 ? "Runner Up" : null,
    };
  }).sort((a, b) => b.score - a.score);
}

function generateHotels(style, budget, days) {
  const chains = HOTEL_CHAINS[style] || HOTEL_CHAINS.central;
  return chains.map((name, i) => {
    const perNight = randomBetween(50, 300);
    const total = perNight * days;
    const location = randomBetween(60, 99);
    const rating = (randomBetween(35, 50) / 10).toFixed(1);
    const budgetFit = Math.max(0, 100 - (total / budget) * 80);
    const score = Math.round(budgetFit * 0.4 + location * 0.3 + parseFloat(rating) * 4 * 0.3);

    let reason;
    if (style === "boutique") reason = location > 80 ? "Unique character, great neighborhood" : "Charming stay, slightly off-center";
    else if (style === "resort") reason = rating > 4.2 ? "Top-rated resort experience" : "Solid resort with good amenities";
    else if (style === "budget") reason = perNight < 100 ? "Excellent value — saves budget for activities" : "Affordable with decent reviews";
    else reason = location > 85 ? "Best location — walk to everything" : "Central area, easy transit access";

    return {
      name,
      per_night: perNight,
      total,
      rating: parseFloat(rating),
      location_score: location,
      score,
      reason,
      tag: i === 0 ? "Top Pick" : i === 1 ? "Great Value" : null,
    };
  }).sort((a, b) => b.score - a.score);
}

function generateItinerary(destinations, days, vibe, budget) {
  const vibeActivities = ACTIVITIES[vibe] || ACTIVITIES.culture;
  const energyLevels = ["🟢 High", "🟡 Medium", "🔴 Low"];
  const itinerary = [];

  for (let d = 1; d <= days; d++) {
    const dayActivities = pickRandom(vibeActivities, 3);
    const energy = d === 1 ? "🟡 Medium" : d === days ? "🔴 Low" : energyLevels[randomBetween(0, 2)];
    let note;
    if (d === 1) note = "Arrival day — take it easy, settle in";
    else if (d === days) note = "Last day — pack, souvenirs, departure";
    else if (d === 2) note = "Good for first-time visitors — hit the highlights";
    else note = randomBetween(0, 1) ? "Budget stretch — free activities available" : "Peak experience day";

    itinerary.push({
      day: d,
      title: d === 1 ? "Arrival & Explore" : d === days ? "Farewell Day" : `Day ${d} Adventure`,
      morning: dayActivities[0],
      afternoon: dayActivities[1],
      evening: dayActivities[2] || "Free time / relax",
      energy,
      note,
    });
  }
  return itinerary;
}

export function generateTripLocally(inputs) {
  const { origin, destinations, depart_date, days, travelers, budget, vibe, hotel_style, flight_priority } = inputs;
  const flights = generateFlights(origin, destinations, flight_priority, budget);
  const hotels = generateHotels(hotel_style, budget, days);
  const itinerary = generateItinerary(destinations, days, vibe, budget);

  const flightScore = flights[0]?.score || 70;
  const hotelScore = hotels[0]?.score || 70;
  const overallScore = Math.round((flightScore + hotelScore) / 2);

  return { flights, hotels, itinerary, overallScore };
}

export async function generateTripWithAI(inputs) {
  const { origin, destinations, depart_date, days, travelers, budget, vibe, hotel_style, flight_priority } = inputs;

  const prompt = `You are TripStack, an AI travel assistant. Generate a ranked travel plan.

User preferences:
- Origin: ${origin}
- Destinations: ${destinations}
- Departure: ${depart_date}
- Duration: ${days} days
- Travelers: ${travelers}
- Budget: $${budget} total
- Travel vibe: ${vibe}
- Hotel style: ${hotel_style}
- Flight priority: ${flight_priority}

Generate:
1. 5 ranked flight options with airline name, price, duration, stops, comfort score (0-100), overall score (0-100), and a short reason why it was ranked this way. Tag the best one "Best Pick" and second "Runner Up".
2. 4 ranked hotel options matching the "${hotel_style}" style with name, price per night, total cost, rating (1-5), location score (0-100), overall score (0-100), and a reason. Tag top one "Top Pick" and second "Great Value".
3. A day-by-day itinerary for ${days} days with morning/afternoon/evening activities matching the "${vibe}" vibe. Include energy level (High/Medium/Low) and a practical note for each day.
4. An overall trip fit score (0-100).

Make it feel personalized. Include notes like "good for first-time visitors", "budget stretch", "best location", "fastest route" where relevant.`;

  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          flights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                airline: { type: "string" },
                code: { type: "string" },
                route: { type: "string" },
                price: { type: "number" },
                duration: { type: "string" },
                stops: { type: "number" },
                comfort: { type: "number" },
                score: { type: "number" },
                reason: { type: "string" },
                tag: { type: ["string", "null"] }
              }
            }
          },
          hotels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                per_night: { type: "number" },
                total: { type: "number" },
                rating: { type: "number" },
                location_score: { type: "number" },
                score: { type: "number" },
                reason: { type: "string" },
                tag: { type: ["string", "null"] }
              }
            }
          },
          itinerary: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "number" },
                title: { type: "string" },
                morning: { type: "string" },
                afternoon: { type: "string" },
                evening: { type: "string" },
                energy: { type: "string" },
                note: { type: "string" }
              }
            }
          },
          overallScore: { type: "number" }
        }
      }
    });
    return result;
  } catch {
    return generateTripLocally(inputs);
  }
}

export const SAMPLE_INPUTS = {
  origin: "New York",
  destinations: "Tokyo, Kyoto",
  depart_date: "2026-08-15",
  days: 7,
  travelers: 2,
  budget: 5000,
  vibe: "culture",
  hotel_style: "boutique",
  flight_priority: "comfort",
};