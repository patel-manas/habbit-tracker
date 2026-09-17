"use client";

import React from "react";
import { useHabits } from "@/lib/habitContext";
import { Sparkles, Plus, User, LogOut, Calendar, BarChart3, CheckSquare, ShieldCheck } from "lucide-react";

interface HeaderProps {
  currentTab: "today" | "monthly" | "yearly";
  onTabChange: (tab: "today" | "monthly" | "yearly") => void;
  onOpenAddHabit: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenAddHabit,
  onOpenAuth,
}) => {
  const { user, isFirebaseActive, getStats, logout } = useHabits();
  const stats = getStats();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#1c3942]/60 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: User greeting & rest rating */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1a3a44] to-[#2dd4bf]/40 p-0.5 shadow-md hover:scale-105 transition-transform"
              title="Account & Auth"
            >
              <div className="w-full h-full rounded-[14px] bg-[#0c1b1f] flex items-center justify-center text-[#dcf743] font-bold text-base">
                {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : "MP"}
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#2dd4bf] border-2 border-[#091518] rounded-full" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Hi, {user?.displayName || "Manas"}
                </h1>
                {user?.isDemo && (
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#1c3942] text-[#859ca2] border border-[#2a4d58]">
                    Demo
                  </span>
                )}
                {isFirebaseActive && !user?.isDemo && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/30">
                    <ShieldCheck className="w-3 h-3" /> Cloud Synced
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs text-[#859ca2]">
                  <Sparkles className="w-3 h-3 text-[#dcf743]" />
                  <span>Consistency:</span>
                  <span className="text-white font-medium">{stats.yearlyConsistencyScore}%</span>
                </span>
                <span className="text-[#35535c]">•</span>
                <span className="text-xs text-[#2dd4bf] font-medium">
                  {stats.completedToday}/{stats.totalHabits} Done Today
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Quick Add */}
          <button
            onClick={onOpenAddHabit}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-[#dcf743] text-[#091518] font-bold shadow-lg shadow-[#dcf743]/15 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-[#0f2127] border border-[#1b3842] shadow-inner">
          <button
            onClick={() => onTabChange("today")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === "today"
                ? "bg-[#1d3943] text-white shadow-md shadow-black/20"
                : "text-[#859ca2] hover:text-white"
            }`}
          >
            <CheckSquare className="w-4 h-4 text-[#dcf743]" />
            Today
          </button>
          <button
            onClick={() => onTabChange("monthly")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === "monthly"
                ? "bg-[#1d3943] text-white shadow-md shadow-black/20"
                : "text-[#859ca2] hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4 text-[#2dd4bf]" />
            Monthly View
          </button>
          <button
            onClick={() => onTabChange("yearly")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === "yearly"
                ? "bg-[#1d3943] text-white shadow-md shadow-black/20"
                : "text-[#859ca2] hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#fb923c]" />
            Yearly Dashboard
          </button>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAddHabit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#dcf743] hover:bg-[#e4fc57] text-[#091518] font-bold text-xs sm:text-sm shadow-md shadow-[#dcf743]/20 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Habit</span>
          </button>

          {user ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#13272e] hover:bg-[#19323b] text-[#859ca2] hover:text-white border border-[#1f3d47] text-xs font-medium transition-all"
              title="Account Settings"
            >
              <User className="w-4 h-4" />
              <span className="max-w-[100px] truncate">{user.displayName || "Account"}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-[#1a3842] hover:bg-[#234754] text-white text-xs font-semibold border border-[#274c59] transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
