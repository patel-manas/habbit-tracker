import { NextResponse } from "next/server";
import { DEFAULT_HABITS } from "@/lib/defaultData";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_HABITS,
    count: DEFAULT_HABITS.length,
  });
}
