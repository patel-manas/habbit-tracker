"use client";

import React, { useState } from "react";
import { HabitProvider, useHabits } from "@/lib/habitContext";
import { Header } from "@/components/Header";
import { WeekStrip } from "@/components/WeekStrip";
import { DailyCheckInCard } from "@/components/DailyCheckInCard";
import { HabitCard } from "@/components/HabitCard";
import { MonthlyMatrix } from "@/components/MonthlyMatrix";
import { YearlyDashboard } from "@/components/YearlyDashboard";
import { AddHabitModal } from "@/components/AddHabitModal";
import { AuthModal } from "@/components/AuthModal";
import { Plus, Sparkles, CheckCircle2, TrendingUp, Compass, Flame, ShieldAlert } from "lucide-react";

function HabitDashboard() {
  const [currentTab, setCurrentTab] = useState<"today" | "monthly" | "yearly">("today");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { habits, selectedDate, logs, getStats } = useHabits();

  const stats = getStats();
  const currentLog = logs[selectedDate];
  const completedCount = currentLog?.completedHabitIds.length || 0;
  const progressPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#081316] text-[#e6f1f3] flex flex-col selection:bg-[#dcf743] selection:text-[#091518]">
      {/* Top Navbar */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddHabit={() => setIsAddModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Tab 1: Today View */}
        {currentTab === "today" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Week Strip Selector */}
            <WeekStrip />

            {/* Layout Grid: Left content (Habits & Daily check-in), Right content (Widgets) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 Cols on lg) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Daily Activity Tag Card (Inspired by Screenshot) */}
                <DailyCheckInCard />

                {/* Habit Section Header */}
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <span>Today's Habits</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#18343e] text-[#2dd4bf] border border-[#224450]">
                        {completedCount} of {habits.length} Done
                      </span>
                    </h3>
                    <p className="text-xs text-[#859ca2] mt-0.5">
                      Check in daily to build unbreakable streaks
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#142930] hover:bg-[#1a3843] text-[#dcf743] border border-[#22444f] transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Habit</span>
                  </button>
                </div>

                {/* Habits List */}
                <div className="space-y-3">
                  {habits.length === 0 ? (
                    <div className="glass-panel rounded-3xl p-8 text-center space-y-3 border border-[#1b3842]">
                      <Sparkles className="w-8 h-8 text-[#dcf743] mx-auto opacity-70" />
                      <h4 className="text-base font-bold text-white">No habits added yet</h4>
                      <p className="text-xs text-[#859ca2] max-w-xs mx-auto">
                        Start your journey by creating your first daily ritual.
                      </p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#dcf743] text-[#091518] font-bold text-xs"
                      >
                        Create First Habit
                      </button>
                    </div>
                  ) : (
                    habits.map((habit) => <HabitCard key={habit.id} habit={habit} />)
                  )}
                </div>
              </div>

              {/* Right Column: Consistency & Mindful Widgets */}
              <div className="space-y-6">
                {/* Daily Progress Circle Card */}
                <div className="glass-panel rounded-3xl p-6 border border-[#1b3842] shadow-xl text-center relative overflow-hidden">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#859ca2] mb-3">
                    Daily Progress
                  </h4>

                  {/* Circular SVG Ring */}
                  <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="transparent"
                        stroke="#13272e"
                        strokeWidth="3.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="transparent"
                        stroke="#dcf743"
                        strokeWidth="3.5"
                        strokeDasharray="100 100"
                        strokeDashoffset={100 - progressPercent}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-white">{progressPercent}%</span>
                      <span className="text-[10px] uppercase font-bold text-[#2dd4bf]">Done</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#859ca2] mt-3">
                    {progressPercent === 100
                      ? "🎉 Stellar work! All habits crushed today!"
                      : `${habits.length - completedCount} more to hit your 100% target!`}
                  </p>
                </div>

                {/* Daily Insights & Mindfulness Card (Direct from Screenshot) */}
                <div className="glass-panel rounded-3xl p-5 border border-[#1b3842] shadow-lg relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#2dd4bf]/15 border border-[#2dd4bf]/30 flex items-center justify-center text-[#2dd4bf]">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Daily Insight</h4>
                      <p className="text-[10px] text-[#859ca2]">Focus, Presence & Self-Growth</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#b0c8ce] italic leading-relaxed bg-[#0c1a1e]/60 p-3 rounded-2xl border border-[#17323c]">
                    "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                  </p>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-[#859ca2]">
                    <span className="flex items-center gap-1 text-[#dcf743]">
                      <Flame className="w-3 h-3" /> 18-Day Best
                    </span>
                    <span>Updated today</span>
                  </div>
                </div>

                {/* Quick Monthly Preview Link */}
                <div
                  onClick={() => setCurrentTab("monthly")}
                  className="glass-panel rounded-3xl p-5 border border-[#1b3842] hover:border-[#2dd4bf]/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#2dd4bf] transition-colors">
                        Explore Monthly Grid →
                      </h4>
                      <p className="text-xs text-[#859ca2] mt-0.5">
                        View and toggle any day across the entire month
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-[#142930] flex items-center justify-center text-[#2dd4bf]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Monthly Matrix View */}
        {currentTab === "monthly" && (
          <div className="animate-fadeIn">
            <MonthlyMatrix />
          </div>
        )}

        {/* Tab 3: Yearly Dashboard View */}
        {currentTab === "yearly" && (
          <div className="animate-fadeIn">
            <YearlyDashboard />
          </div>
        )}
      </main>

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <HabitProvider>
      <HabitDashboard />
    </HabitProvider>
  );
}
