"use client";

import React, { useState } from "react";
import { Habit } from "@/lib/types";
import { useHabits } from "@/lib/habitContext";
import { HabitIcon } from "@/lib/icons";
import { Check, Flame, MoreVertical, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { selectedDate, logs, toggleHabitCompletion, deleteHabit, getHabitStreak } = useHabits();
  const [showMenu, setShowMenu] = useState(false);

  const currentLog = logs[selectedDate];
  const isCompleted = currentLog?.completedHabitIds.includes(habit.id) || false;
  const streak = getHabitStreak(habit.id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const becameCompleted = await toggleHabitCompletion(habit.id, selectedDate);
    if (becameCompleted) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: [habit.color || "#dcf743", "#2dd4bf", "#ffffff"],
      });
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`group relative overflow-hidden rounded-3xl p-4 sm:p-5 transition-all duration-200 border cursor-pointer ${
        isCompleted
          ? "bg-gradient-to-r from-[#142d34] to-[#12272e] border-[#2dd4bf]/40 shadow-lg shadow-black/20"
          : "bg-[#0f2127]/90 hover:bg-[#142930] border-[#1a353f] hover:border-[#244b58]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon & Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${habit.color}15`,
              border: `1.5px solid ${habit.color}40`,
              color: habit.color,
            }}
          >
            <HabitIcon name={habit.icon} size={22} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#162d35] text-[#859ca2]">
                {habit.category}
              </span>
              {streak.current > 0 && (
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#fb923c]">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>{streak.current}d</span>
                </span>
              )}
            </div>

            <h4
              className={`text-sm sm:text-base font-bold truncate mt-1 transition-colors ${
                isCompleted ? "text-white line-through opacity-80" : "text-white"
              }`}
            >
              {habit.title}
            </h4>
            {habit.description && (
              <p className="text-xs text-[#859ca2] truncate max-w-sm">
                {habit.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Checkbox / Action button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isCompleted
                ? "bg-[#dcf743] text-[#091518] shadow-md shadow-[#dcf743]/20 scale-105"
                : "bg-[#142930] hover:bg-[#1b3741] text-[#4d6a74] hover:text-[#859ca2] border border-[#224551]"
            }`}
            title={isCompleted ? "Mark incomplete" : "Mark complete"}
          >
            <Check
              className={`w-5 h-5 transition-transform duration-200 ${
                isCompleted ? "stroke-[3.5] scale-110" : "stroke-[2.5]"
              }`}
            />
          </button>

          {/* More options (delete) */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="w-8 h-8 rounded-xl hover:bg-[#18343e] text-[#5e7c85] hover:text-white flex items-center justify-center transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-9 z-20 w-36 rounded-2xl bg-[#0f2127] border border-[#1e3c46] shadow-2xl p-1.5"
              >
                <button
                  onClick={() => {
                    deleteHabit(habit.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#f87171] hover:bg-[#f87171]/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Habit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
