import { NextResponse } from "next/server";
import { DEFAULT_HABITS, generateSeedLogs } from "@/lib/defaultData";

export async function GET() {
  const seedLogs = generateSeedLogs(DEFAULT_HABITS);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLog = seedLogs[todayStr];
  const completedToday = todayLog?.completedHabitIds.length || 0;

  let totalCompletionsThisYear = 0;
  const currentYear = new Date().getFullYear().toString();
  Object.keys(seedLogs).forEach((dateKey) => {
    if (dateKey.startsWith(currentYear)) {
      totalCompletionsThisYear += seedLogs[dateKey]?.completedHabitIds.length || 0;
    }
  });

  return NextResponse.json({
    success: true,
    stats: {
      totalHabits: DEFAULT_HABITS.length,
      completedToday,
      todayCompletionRate: Math.round((completedToday / DEFAULT_HABITS.length) * 100),
      currentStreak: 12,
      bestStreak: 24,
      totalCompletionsThisYear,
      yearlyConsistencyScore: 84,
    },
  });
}
