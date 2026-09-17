"use client";

import React, { useState } from "react";
import { useHabits } from "@/lib/habitContext";
import { HabitCategory } from "@/lib/types";
import { HabitIcon, AVAILABLE_ICONS } from "@/lib/icons";
import { X, Sparkles } from "lucide-react";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: string; value: HabitCategory }[] = [
  { label: "Fitness", value: "fitness" },
  { label: "Productivity", value: "productivity" },
  { label: "Health", value: "health" },
  { label: "Learning", value: "learning" },
  { label: "Mindfulness", value: "mindfulness" },
  { label: "Other", value: "other" },
];

const COLORS = [
  "#ddf247", // Neon lime
  "#2dd4bf", // Mint teal
  "#38bdf8", // Sky cyan
  "#c084fc", // Purple
  "#fb923c", // Warm peach
  "#f43f5e", // Rose
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose }) => {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HabitCategory>("fitness");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState("Dumbbell");
  const [frequency, setFrequency] = useState<"daily" | "weekdays" | "weekends">("daily");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    await addHabit({
      title: title.trim(),
      description: description.trim(),
      category,
      color,
      icon,
      frequency,
    });
    setSubmitting(false);
    onClose();
    // Reset fields
    setTitle("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-[#22444e] shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#142a32] hover:bg-[#1a3844] text-[#859ca2] hover:text-white flex items-center justify-center border border-[#1e3c46] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center border"
            style={{
              backgroundColor: `${color}15`,
              borderColor: `${color}40`,
              color: color,
            }}
          >
            <HabitIcon name={icon} size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Create New Habit</h3>
            <p className="text-xs text-[#859ca2]">Define your daily ritual and build momentum</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title input */}
          <div>
            <label className="block text-xs font-semibold text-[#859ca2] uppercase tracking-wider mb-1.5">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 30 Min Strength Training"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#0c1a1e] border border-[#1d3c46] text-white text-sm focus:outline-none focus:border-[#dcf743] transition-colors placeholder:text-[#4f6870]"
            />
          </div>

          {/* Description input */}
          <div>
            <label className="block text-xs font-semibold text-[#859ca2] uppercase tracking-wider mb-1.5">
              Target / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 5 sets compound exercises or 8000 steps"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#0c1a1e] border border-[#1d3c46] text-white text-sm focus:outline-none focus:border-[#dcf743] transition-colors placeholder:text-[#4f6870]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[#859ca2] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    category === cat.value
                      ? "bg-[#1f3f4a] border-[#2dd4bf] text-white shadow-sm"
                      : "bg-[#0c1a1e] border-[#18343e] text-[#859ca2] hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color & Icon Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Color Accent */}
            <div>
              <label className="block text-xs font-semibold text-[#859ca2] uppercase tracking-wider mb-1.5">
                Color Accent
              </label>
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-xl transition-all ${
                      color === c
                        ? "scale-125 ring-2 ring-white shadow-lg"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-xs font-semibold text-[#859ca2] uppercase tracking-wider mb-1.5">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#0c1a1e] border border-[#1d3c46] text-white text-xs focus:outline-none focus:border-[#dcf743]"
              >
                <option value="daily">Every Day</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekends">Weekends Only</option>
              </select>
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#859ca2] uppercase tracking-wider mb-1.5">
              Choose Icon
            </label>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`p-2 rounded-xl border flex-shrink-0 transition-all ${
                    icon === ic
                      ? "bg-[#1d3d47] border-[#dcf743] text-[#dcf743] scale-110"
                      : "bg-[#0c1a1e] border-[#18343e] text-[#6d8a92] hover:text-white"
                  }`}
                >
                  <HabitIcon name={ic} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#18343e] mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#859ca2] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#dcf743] hover:bg-[#e6fc58] text-[#091518] font-bold text-xs shadow-md shadow-[#dcf743]/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? "Creating..." : "Create Habit"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
