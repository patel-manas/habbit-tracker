import { Habit, DayLog } from "./types";

export const DEFAULT_HABITS: Habit[] = [
  {
    id: "habit-1",
    title: "Daily Workout & Movement",
    description: "At least 45 mins cardio, weights or mobility",
    category: "fitness",
    color: "#ddf247", // Neon lime from screenshot
    icon: "Dumbbell",
    frequency: "daily",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "habit-2",
    title: "Deep Focus Session",
    description: "90 minutes distraction-free creative or dev work",
    category: "productivity",
    color: "#38bdf8", // Sky blue
    icon: "Flame",
    frequency: "daily",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "habit-3",
    title: "Hydration (2.5L Water)",
    description: "Drink 4-5 bottles throughout the day",
    category: "health",
    color: "#2dd4bf", // Mint cyan
    icon: "Droplets",
    frequency: "daily",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "habit-4",
    title: "Read 20 Pages",
    description: "Non-fiction, architecture, or philosophy",
    category: "learning",
    color: "#c084fc", // Soft purple
    icon: "BookOpen",
    frequency: "daily",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "habit-5",
    title: "Evening Wind Down & Sleep by 11",
    description: "No blue light 1h before bed, 7-8h restorative sleep",
    category: "mindfulness",
    color: "#fb923c", // Warm peach
    icon: "Moon",
    frequency: "daily",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

// Generate sensible past logs for the current and previous month so heatmaps look great
export function generateSeedLogs(habits: Habit[]): Record<string, DayLog> {
  const logs: Record<string, DayLog> = {};
  const today = new Date();
  
  // Seed past 90 days
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    
    // Deterministic pseudo-randomness for realistic streak patterns
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const completed: string[] = [];
    
    habits.forEach((habit, idx) => {
      const prob = (i === 0) 
        ? (idx < 3 ? 1 : 0) // today partially done
        : (isWeekend ? 0.65 : 0.82) - (idx * 0.05);
      
      const pseudo = ((d.getDate() * 17 + idx * 31 + d.getMonth() * 11) % 100) / 100;
      if (pseudo < prob) {
        completed.push(habit.id);
      }
    });

    logs[dateStr] = {
      date: dateStr,
      completedHabitIds: completed,
      mood: i % 4 === 0 ? "awesome" : i % 4 === 1 ? "fine" : "peaceful",
      tags: i % 2 === 0 ? ["Sport", "Stayed in"] : ["High energy", "Rainy"],
    };
  }

  return logs;
}
