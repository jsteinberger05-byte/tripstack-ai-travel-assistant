import React from "react";

export default function ScoreBadge({ score, size = "md" }) {
  const color = score >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-200" 
    : score >= 60 ? "text-amber-600 bg-amber-50 border-amber-200" 
    : "text-red-500 bg-red-50 border-red-200";
  
  const sizeClass = size === "lg" ? "text-2xl w-16 h-16" : size === "sm" ? "text-xs w-8 h-8" : "text-sm w-10 h-10";

  return (
    <div className={`${color} ${sizeClass} rounded-full border-2 flex items-center justify-center font-bold shrink-0`}>
      {score}
    </div>
  );
}