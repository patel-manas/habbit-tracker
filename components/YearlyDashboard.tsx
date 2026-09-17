"use client";

import React, { useState } from "react";
import { useHabits } from "@/lib/habitContext";
import { HabitIcon } from "@/lib/icons";
import { Trophy, Flame, Zap, Award, BarChart, ChevronLeft, ChevronRight, Activity } from "lucide-react";

export const YearlyDashboard: React.FC = () => {
  const { habits, logs, getStats } = useHabits();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const stats = getStats();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Calculate monthly stats for the selected year
  const monthlyData = months.map((monthName, monthIndex) => {
    const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
    let completions = 0;
    let totalPossible = daysInMonth * habits.length;

    for (let day = 1; day <= daysInMonth; day++) {
      const mStr = String(monthIndex + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateKey = `${selectedYear}-${mStr}-${dStr}`;
      completions += logs[dateKey]?.completedHabitIds.length || 0;
    }

    const rate = totalPossible > 0 ? Math.round((completions / totalPossible) * 100) : 0;
    return { month: monthName, completions, rate, days: daysInMonth };
  });

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  habits.forEach((h) => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  const categoryColors: Record<string, string> = {
    fitness: "#ddf247",
    productivity: "#38bdf8",
    health: "#2dd4bf",
    learning: "#c084fc",
    mindfulness: "#fb923c",
    other: "#94a3b8",
  };

  // Generate 365 days contribution squares
  const annualGridDays = [];
  const startOfYear = new Date(selectedYear, 0, 1);
  const endOfYear = new Date(selectedYear, 11, 31);
  let cur = new Date(startOfYear);

  while (cur <= endOfYear) {
    const dateStr = cur.toISOString().split("T")[0];
    const completedCount = logs[dateStr]?.completedHabitIds.length || 0;
    const intensity = habits.length > 0 ? completedCount / habits.length : 0;

    let colorClass = "bg-[#112329]";
    if (intensity > 0.8) colorClass = "bg-[#dcf743] shadow-[0_0_8px_rgba(220,247,67,0.4)]";
    else if (intensity > 0.5) colorClass = "bg-[#2dd4bf]";
    else if (intensity > 0.25) colorClass = "bg-[#1f5c5d]";
    else if (intensity > 0) colorClass = "bg-[#193a43]";

    annualGridDays.push({
      date: dateStr,
      count: completedCount,
      colorClass,
    });

    cur.setDate(cur.getDate() + 1);
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Annual Highlights Bar */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-[#1b3842] shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b3a44] to-[#fb923c]/20 border border-[#fb923c]/30 flex items-center justify-center text-[#fb923c]">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedYear(selectedYear - 1)}
                  className="p-1 rounded-lg bg-[#142930] hover:bg-[#1a3742] text-[#859ca2] hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {selectedYear} Yearly Dashboard
                </h2>
                <button
                  onClick={() => setSelectedYear(selectedYear + 1)}
                  className="p-1 rounded-lg bg-[#142930] hover:bg-[#1a3742] text-[#859ca2] hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#859ca2] mt-0.5">
                Annual consistency, habit breakdown & longitudinal health streaks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e2228] border border-[#1d3d46] text-xs font-semibold text-[#dcf743]">
              <Award className="w-3.5 h-3.5" /> Best Streak: {stats.bestStreak} Days
            </span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#0e2127] border border-[#1b3943]">
            <div className="flex items-center justify-between text-[#859ca2] text-xs">
              <span>Annual Check-Ins</span>
              <Activity className="w-3.5 h-3.5 text-[#2dd4bf]" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {stats.totalCompletionsThisYear}
            </div>
            <span className="text-[11px] text-[#2dd4bf] font-medium">+12% vs last year</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e2127] border border-[#1b3943]">
            <div className="flex items-center justify-between text-[#859ca2] text-xs">
              <span>Consistency Score</span>
              <Zap className="w-3.5 h-3.5 text-[#dcf743]" />
            </div>
            <div className="text-2xl font-black text-[#dcf743] mt-1">
              {stats.yearlyConsistencyScore}%
            </div>
            <span className="text-[11px] text-[#859ca2]">Based on {habits.length} habits</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e2127] border border-[#1b3943]">
            <div className="flex items-center justify-between text-[#859ca2] text-xs">
              <span>Active Streak</span>
              <Flame className="w-3.5 h-3.5 text-[#fb923c]" />
            </div>
            <div className="text-2xl font-black text-[#fb923c] mt-1">
              {stats.currentStreak} <span className="text-sm font-bold">days</span>
            </div>
            <span className="text-[11px] text-[#859ca2]">Keep momentum going!</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e2127] border border-[#1b3943]">
            <div className="flex items-center justify-between text-[#859ca2] text-xs">
              <span>Active Habits</span>
              <BarChart className="w-3.5 h-3.5 text-[#c084fc]" />
            </div>
            <div className="text-2xl font-black text-[#c084fc] mt-1">
              {habits.length}
            </div>
            <span className="text-[11px] text-[#859ca2]">Across {Object.keys(categoryCounts).length} domains</span>
          </div>
        </div>
      </div>

      {/* 365 Days Consistency Matrix / Heatmap */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-[#1b3842] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">365-Day Consistency Heatmap</h3>
            <p className="text-xs text-[#859ca2]">Every completed day visualised in {selectedYear}</p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-xs text-[#859ca2]">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded bg-[#112329]" />
            <div className="w-2.5 h-2.5 rounded bg-[#193a43]" />
            <div className="w-2.5 h-2.5 rounded bg-[#1f5c5d]" />
            <div className="w-2.5 h-2.5 rounded bg-[#2dd4bf]" />
            <div className="w-2.5 h-2.5 rounded bg-[#dcf743]" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[750px]">
            {annualGridDays.map((day) => (
              <div
                key={day.date}
                className={`w-3.5 h-3.5 rounded-sm ${day.colorClass} transition-transform hover:scale-125 cursor-pointer`}
                title={`${day.date}: ${day.count} habits completed`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown & Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 12-Month Performance Bars */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 sm:p-6 border border-[#1b3842]">
          <h3 className="text-base font-bold text-white mb-1">Monthly Consistency Trends</h3>
          <p className="text-xs text-[#859ca2] mb-6">Completion rates across each month of {selectedYear}</p>

          <div className="space-y-3.5">
            {monthlyData.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#859ca2] w-8">{m.month}</span>
                <div className="flex-1 h-3.5 bg-[#0e2127] rounded-full overflow-hidden p-0.5 border border-[#1b3842]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(4, m.rate)}%`,
                      backgroundColor: m.rate > 70 ? "#dcf743" : m.rate > 40 ? "#2dd4bf" : "#38bdf8",
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-white w-10 text-right">{m.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Category Distribution */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-[#1b3842] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Habit Focus Areas</h3>
            <p className="text-xs text-[#859ca2] mb-5">Distribution of routines</p>

            {/* Simulated Donut Center Ring */}
            <div className="relative w-40 h-40 mx-auto my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#12252c"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#dcf743"
                  strokeWidth="4"
                  strokeDasharray="40 100"
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#2dd4bf"
                  strokeWidth="4"
                  strokeDasharray="30 100"
                  strokeDashoffset="-40"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeDasharray="30 100"
                  strokeDashoffset="-70"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">{habits.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#859ca2]">Habits</span>
              </div>
            </div>

            {/* List of categories */}
            <div className="space-y-2 mt-4">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 capitalize text-[#c2d7dc]">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: categoryColors[cat] || "#94a3b8" }}
                    />
                    <span>{cat}</span>
                  </div>
                  <span className="font-bold text-white">{count} habits</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
