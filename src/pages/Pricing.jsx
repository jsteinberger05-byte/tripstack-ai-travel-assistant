import React, { useState } from "react";
import { Check, Zap, Shield, Crown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Bronze",
    icon: Zap,
    price: 9,
    color: "from-amber-700 to-amber-500",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    ring: "ring-amber-300",
    iconBg: "bg-amber-100 text-amber-700",
    cta: "Get Bronze",
    description: "Perfect for solo travelers planning their next getaway.",
    features: [
      { text: "1 device", included: true },
      { text: "1 trip plan", included: true },
      { text: "AI trip generation", included: true },
      { text: "Archive access", included: true },
      { text: "Multiple devices", included: false },
      { text: "Multiple trips", included: false },
      { text: "Family sharing", included: false },
    ],
  },
  {
    name: "Silver",
    icon: Shield,
    price: 19,
    color: "from-slate-500 to-slate-400",
    badge: "bg-slate-100 text-slate-700 border-slate-300",
    ring: "ring-slate-400",
    iconBg: "bg-slate-100 text-slate-600",
    cta: "Get Silver",
    popular: true,
    description: "Great for frequent travelers managing multiple plans.",
    features: [
      { text: "Up to 3 devices", included: true },
      { text: "Up to 2 trip plans", included: true },
      { text: "AI trip generation", included: true },
      { text: "Archive access", included: true },
      { text: "Duplicate & regenerate trips", included: true },
      { text: "Unlimited trips", included: false },
      { text: "Family sharing", included: false },
    ],
  },
  {
    name: "Gold",
    icon: Crown,
    price: 39,
    color: "from-yellow-500 to-amber-400",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
    ring: "ring-yellow-400",
    iconBg: "bg-yellow-100 text-yellow-700",
    cta: "Get Gold",
    description: "For families and power travelers who want it all.",
    features: [
      { text: "5+ devices", included: true },
      { text: "Unlimited trip plans", included: true },
      { text: "AI trip generation", included: true },
      { text: "Archive access", included: true },
      { text: "Duplicate & regenerate trips", included: true },
      { text: "Family member sharing", included: true },
      { text: "Priority AI generation", included: true },
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Choose Your Plan</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Start planning smarter trips today. Upgrade or downgrade anytime.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 bg-slate-100 rounded-full p-1 mt-6">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === "monthly" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === "yearly" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
          >
            Yearly <span className="text-emerald-500 font-semibold">–20%</span>
          </button>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => {
          const price = billing === "yearly" ? Math.round(tier.price * 0.8) : tier.price;
          const Icon = tier.icon;
          return (
            <div
              key={tier.name}
              className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col ${tier.popular ? `ring-2 ${tier.ring} border-transparent shadow-lg` : "border-slate-200"}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-sky-500 to-violet-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">{tier.name}</h2>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tier.badge}`}>
                    {tier.name} Tier
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-5">{tier.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-slate-900">${price}</span>
                  <span className="text-slate-400 text-sm mb-1">/mo</span>
                </div>
                {billing === "yearly" && (
                  <p className="text-xs text-emerald-600 mt-0.5">Billed ${price * 12}/year</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${f.included ? "bg-emerald-100" : "bg-slate-100"}`}>
                      {f.included ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      ) : (
                        <span className="w-1.5 h-0.5 bg-slate-400 rounded-full block" />
                      )}
                    </div>
                    <span className={`text-sm ${f.included ? "text-slate-700" : "text-slate-400"}`}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* Family note for Gold */}
              {tier.name === "Gold" && (
                <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-3 py-2 mb-4 border border-yellow-200">
                  <Users className="w-4 h-4 text-yellow-600 shrink-0" />
                  <p className="text-xs text-yellow-700 font-medium">Share across all family members' devices</p>
                </div>
              )}

              <Button
                className={`w-full bg-gradient-to-r ${tier.color} text-white hover:opacity-90 transition-opacity`}
              >
                {tier.cta}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Comparison note */}
      <div className="mt-10 bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4 text-center">Quick Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-500 font-medium">Feature</th>
                <th className="text-center py-2 text-amber-700 font-semibold">Bronze</th>
                <th className="text-center py-2 text-slate-600 font-semibold">Silver</th>
                <th className="text-center py-2 text-yellow-600 font-semibold">Gold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["Devices", "1", "3", "5+"],
                ["Trip Plans", "1", "2", "Unlimited"],
                ["Family Sharing", "—", "—", "✓"],
                ["AI Generation", "✓", "✓", "✓ Priority"],
                ["Archive", "✓", "✓", "✓"],
              ].map(([label, bronze, silver, gold]) => (
                <tr key={label}>
                  <td className="py-2.5 text-slate-600">{label}</td>
                  <td className="py-2.5 text-center text-slate-700">{bronze}</td>
                  <td className="py-2.5 text-center text-slate-700">{silver}</td>
                  <td className="py-2.5 text-center text-slate-700">{gold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}