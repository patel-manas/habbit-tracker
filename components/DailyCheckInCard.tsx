"use client";

import React, { useState } from "react";
import { useHabits } from "@/lib/habitContext";
import { Sparkles, Check, Smile, SunMedium, Flame, Dumbbell, CloudRain, BatteryMedium, Coffee } from "lucide-react";

const AVAILABLE_TAGS = [
  { label: "⚡ High energy", id: "High energy", color: "text-[#dcf743] border-[#dcf743]/30 bg-[#dcf743]/10" },
  { label: "🧘 Mindful", id: "Mindful", color: "text-[#2dd4bf] border-[#2dd4bf]/30 bg-[#2dd4bf]/10" },
  { label: "🏃 Sport & Gym", id: "Sport", color: "text-[#c084fc] border-[#c084fc]/30 bg-[#c084fc]/10" },
  { label: "🏠 Stayed in", id: "Stayed in", color: "text-[#38bdf8] border-[#38bdf8]/30 bg-[#38bdf8]/10" },
  { label: "☕ 2x Coffee", id: "Coffee", color: "text-[#fb923c] border-[#fb923c]/30 bg-[#fb923c]/10" },
  { label: "🌧️ Rainy day", id: "Rainy", color: "text-[#94a3b8] border-[#94a3b8]/30 bg-[#94a3b8]/10" },
  { label: "😴 Low energy", id: "Low energy", color: "text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10" },
];

export const DailyCheckInCard: React.FC = () => {
  const { selectedDate, logs, setDayMoodAndTags } = useHabits();
  const currentLog = logs[selectedDate];
  const activeTags = currentLog?.tags || ["Mindful", "Sport"];
  const [savedFeedback, setSavedFeedback] = useState(false);

  const toggleTag = (tagId: string) => {
    const nextTags = activeTags.includes(tagId)
      ? activeTags.filter((t) => t !== tagId)
      : [...activeTags, tagId];
    setDayMoodAndTags(selectedDate, currentLog?.mood, nextTags);
  };

  const handleSaveCheckIn = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  // Human readable date string
  const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#142c33] via-[#10242a] to-[#0c1a1e] border border-[#1d3d46] shadow-2xl">
      {/* Subtle radial glow background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#2dd4bf]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#dcf743]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Daily Activity & Check-In
            </h3>
            <p className="text-xs text-[#859ca2]">{formattedDate}</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#18343e] text-[#2dd4bf] border border-[#234652]">
            <Sparkles className="w-3.5 h-3.5" /> Quick Mood
          </span>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 my-4">
          {AVAILABLE_TAGS.map((tag) => {
            const isSelected = activeTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? `${tag.color} shadow-sm shadow-black/20 font-semibold scale-102`
                    : "bg-[#0f2127]/60 text-[#7a959d] border-[#1b353e] hover:border-[#274c58] hover:text-white"
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* Check-in CTA button */}
        <div className="flex items-center justify-end mt-4 pt-3 border-t border-[#18343e]">
          <button
            onClick={handleSaveCheckIn}
            className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer ${
              savedFeedback
                ? "bg-[#2dd4bf] text-[#091518]"
                : "bg-[#1d3c47] hover:bg-[#254c59] text-[#dcf743] hover:text-white border border-[#2b5463]"
            }`}
          >
            {savedFeedback ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Submit Check-In</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
