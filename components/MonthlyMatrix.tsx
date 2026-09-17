"use client";

import React, { useState } from "react";
import { useHabits } from "@/lib/habitContext";
import { HabitIcon } from "@/lib/icons";
import { ChevronLeft, ChevronRight, Check, Sparkles, Filter, CalendarDays } from "lucide-react";

export const MonthlyMatrix: React.FC = () => {
  const { habits, logs, toggleHabitCompletion } = useHabits();
  
  // Current viewing month and year
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Days in this month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split("T")[0];

  const monthName = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const jumpToCurrentMonth = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  // Filter habits
  const filteredHabits = selectedCategory === "all"
    ? habits
    : habits.filter((h) => h.category === selectedCategory);

  // Generate day array
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Helper to format date string YYYY-MM-DD
  const getDateStr = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Helper to get weekday initial
  const getWeekdayInitial = (day: number) => {
    const dateObj = new Date(year, month, day);
    return dateObj.toLocaleDateString("en-US", { weekday: "narrow" });
  };

  // Calculate monthly stats
  let totalOpportunities = filteredHabits.length * daysInMonth;
  let totalCompletions = 0;

  filteredHabits.forEach((habit) => {
    dayNumbers.forEach((day) => {
      const dStr = getDateStr(day);
      if (logs[dStr]?.completedHabitIds.includes(habit.id)) {
        totalCompletions++;
      }
    });
  });

  const overallMonthlyRate = totalOpportunities > 0 
    ? Math.round((totalCompletions / totalOpportunities) * 100) 
    : 0;

  return (
    <div className="w-full space-y-6">
      {/* Month Header and Quick Controls */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-[#1b3842] shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 flex items-center justify-center text-[#2dd4bf]">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded-lg bg-[#142930] hover:bg-[#1a3742] text-[#859ca2] hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {monthName}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-lg bg-[#142930] hover:bg-[#1a3742] text-[#859ca2] hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={jumpToCurrentMonth}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#142930] hover:bg-[#1b3842] text-[#dcf743] border border-[#22444f] transition-all ml-1"
                >
                  This Month
                </button>
              </div>
              <p className="text-xs text-[#859ca2] mt-0.5">
                Full month tracker matrix • Click any daily box to toggle completion
              </p>
            </div>
          </div>

          {/* Monthly completion metrics */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="px-4 py-2 rounded-2xl bg-[#0e2025] border border-[#1b3842] text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#859ca2] block">
                Total Check-Ins
              </span>
              <span className="text-base font-bold text-[#2dd4bf]">
                {totalCompletions} <span className="text-xs font-normal text-[#859ca2]">times</span>
              </span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-[#0e2025] border border-[#1b3842] text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#859ca2] block">
                Monthly Rate
              </span>
              <span className="text-base font-bold text-[#dcf743]">
                {overallMonthlyRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#18343e] overflow-x-auto pb-1">
          <span className="text-xs text-[#627f87] flex items-center gap-1 pl-1 pr-2">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {["all", "fitness", "productivity", "health", "learning", "mindfulness"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#2dd4bf] text-[#091518] shadow-md shadow-[#2dd4bf]/20"
                  : "bg-[#11242a] text-[#859ca2] hover:text-white border border-[#1b3741]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Matrix Table */}
      <div className="glass-panel rounded-3xl border border-[#1b3842] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#0b1a1e] border-b border-[#1b3842]">
                <th className="sticky left-0 z-20 bg-[#0b1a1e] py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-[#859ca2] min-w-[220px] shadow-[4px_0_12px_rgba(0,0,0,0.3)]">
                  Habit & Monthly Score
                </th>
                {dayNumbers.map((day) => {
                  const dStr = getDateStr(day);
                  const isToday = dStr === todayStr;
                  const weekday = getWeekdayInitial(day);
                  return (
                    <th
                      key={day}
                      className={`py-2 px-1 text-center min-w-[32px] sm:min-w-[36px] transition-colors ${
                        isToday ? "bg-[#1d3d47]/80 text-[#dcf743]" : "text-[#738f97]"
                      }`}
                    >
                      <div className="text-[10px] font-medium uppercase opacity-75">{weekday}</div>
                      <div className={`text-xs font-bold ${isToday ? "text-[#dcf743]" : "text-white"}`}>
                        {day}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162f37]">
              {filteredHabits.map((habit) => {
                // Calculate this habit's rate for this month
                let habitCompletionsThisMonth = 0;
                dayNumbers.forEach((d) => {
                  if (logs[getDateStr(d)]?.completedHabitIds.includes(habit.id)) {
                    habitCompletionsThisMonth++;
                  }
                });
                const habitMonthlyRate = Math.round((habitCompletionsThisMonth / daysInMonth) * 100);

                return (
                  <tr key={habit.id} className="hover:bg-[#11242b]/60 transition-colors">
                    {/* Sticky Habit info column */}
                    <td className="sticky left-0 z-10 bg-[#0d1e23] py-3 px-4 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: `${habit.color}15`,
                            color: habit.color,
                            border: `1px solid ${habit.color}40`,
                          }}
                        >
                          <HabitIcon name={habit.icon} size={16} />
                        </div>
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[140px]">
                            {habit.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-[#2dd4bf] font-medium">
                              {habitCompletionsThisMonth}/{daysInMonth}d
                            </span>
                            <span className="text-[10px] font-bold text-[#dcf743]">
                              {habitMonthlyRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Checkbox cell for each day */}
                    {dayNumbers.map((day) => {
                      const dStr = getDateStr(day);
                      const isCompleted = logs[dStr]?.completedHabitIds.includes(habit.id) || false;
                      const isToday = dStr === todayStr;

                      return (
                        <td key={day} className="py-2 px-1 text-center">
                          <button
                            type="button"
                            onClick={() => toggleHabitCompletion(habit.id, dStr)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl mx-auto flex items-center justify-center transition-all duration-150 cursor-pointer ${
                              isCompleted
                                ? "shadow-md scale-95"
                                : "hover:scale-105"
                            } ${
                              isToday && !isCompleted
                                ? "border-2 border-dashed border-[#2dd4bf]/60 bg-[#12272e]"
                                : ""
                            }`}
                            style={{
                              backgroundColor: isCompleted ? habit.color || "#dcf743" : "rgba(18, 38, 45, 0.6)",
                              border: isCompleted ? "none" : "1px solid rgba(28, 57, 66, 0.8)",
                              color: isCompleted ? "#091518" : "transparent",
                            }}
                            title={`${habit.title} on ${dStr}: ${isCompleted ? "Completed" : "Not completed"}`}
                          >
                            <Check
                              className={`w-3.5 h-3.5 transition-transform ${
                                isCompleted ? "stroke-[3.5] opacity-100" : "opacity-0"
                              }`}
                            />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
