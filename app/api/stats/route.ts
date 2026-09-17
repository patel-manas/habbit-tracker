import { NextResponse } from "next/server";
import { DEFAULT_HABITS, generateSeedLogs } from "@/lib/defaultData";

export const dynamic = "force-static";

export async function GET() {
  const seedLogs = generateSeedLogs(DEFAULT_HABITS);
  return NextResponse.json({
    success: true,
    stats: {
      totalHabits: DEFAULT_HABITS.length,
      currentStreak: 12,
      yearlyConsistencyScore: 84,
    },
  });
}
