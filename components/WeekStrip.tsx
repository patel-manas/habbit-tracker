"use client";

import React from "react";
import { useHabits } from "@/lib/habitContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const WeekStrip: React.FC = () => {
  const { selectedDate, setSelectedDate, logs, habits } = useHabits();

  // Parse current selectedDate
  const current = new Date(selectedDate + "T00:00:00");
  
  // Compute start of current week (Sunday)
  const startOfWeek = new Date(current);
  startOfWeek.setDate(current.getDate() - current.getDay());

  const days = [];
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === new Date().toISOString().split("T")[0];

    const dayLog = logs[dateStr];
    const completedCount = dayLog?.completedHabitIds.length || 0;
    const totalCount = habits.length;
    const isFullDone = totalCount > 0 && completedCount === totalCount;
    const isPartialDone = completedCount > 0 && !isFullDone;

    days.push({
      dateStr,
      dayNumber: d.getDate(),
      dayLabel: dayLabels[i],
      isSelected,
      isToday,
      completedCount,
      isFullDone,
      isPartialDone,
    });
  }

  const handlePrevWeek = () => {
    const prev = new Date(current);
    prev.setDate(current.getDate() - 7);
    setSelectedDate(prev.toISOString().split("T")[0]);
  };

  const handleNextWeek = () => {
    const next = new Date(current);
    next.setDate(current.getDate() + 7);
    setSelectedDate(next.toISOString().split("T")[0]);
  };

  const handleJumpToToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  // Format month and year label, e.g. "April 2025"
  const monthYearLabel = current.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full glass-panel rounded-3xl p-4 sm:p-5 border border-[#1b3842] shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            className="w-8 h-8 rounded-xl bg-[#13272e] hover:bg-[#1a3842] text-[#859ca2] hover:text-white flex items-center justify-center border border-[#1e3c46] transition-colors"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide px-2">
            {monthYearLabel}
          </h2>
          <button
            onClick={handleNextWeek}
            className="w-8 h-8 rounded-xl bg-[#13272e] hover:bg-[#1a3842] text-[#859ca2] hover:text-white flex items-center justify-center border border-[#1e3c46] transition-colors"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleJumpToToday}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#13272e] hover:bg-[#1c3a44] text-[#dcf743] border border-[#22444e] transition-all"
        >
          Today
        </button>
      </div>

      {/* Week day pills */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
        {days.map((item) => (
          <button
            key={item.dateStr}
            onClick={() => setSelectedDate(item.dateStr)}
            className={`group relative flex flex-col items-center py-2.5 sm:py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              item.isSelected
                ? "bg-gradient-to-b from-[#1c3d47] to-[#12282f] border-2 border-[#dcf743] shadow-lg shadow-[#dcf743]/10 scale-102"
                : "bg-[#0d1e23]/70 hover:bg-[#142a32] border border-[#18343e]/80"
            }`}
          >
            <span
              className={`text-[11px] sm:text-xs font-medium uppercase tracking-wider mb-1 ${
                item.isSelected ? "text-[#dcf743] font-bold" : "text-[#738c93]"
              }`}
            >
              {item.dayLabel}
            </span>

            <span
              className={`text-sm sm:text-base font-bold transition-colors ${
                item.isSelected
                  ? "text-white"
                  : item.isToday
                  ? "text-[#2dd4bf]"
                  : "text-[#c2d7dc]"
              }`}
            >
              {item.dayNumber}
            </span>

            {/* Indicator dots underneath */}
            <div className="flex items-center gap-1 mt-1.5 h-1.5">
              {item.isFullDone && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#dcf743] shadow-sm shadow-[#dcf743]" />
              )}
              {item.isPartialDone && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
              )}
              {!item.isFullDone && !item.isPartialDone && item.isToday && (
                <span className="w-1 h-1 rounded-full bg-[#355761]" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
