import { NextResponse } from "next/server";
import { DEFAULT_HABITS } from "@/lib/defaultData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_HABITS,
    count: DEFAULT_HABITS.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const newHabit = {
      id: `habit-${Date.now()}`,
      title: body.title,
      description: body.description || "",
      category: body.category || "fitness",
      color: body.color || "#ddf247",
      icon: body.icon || "Dumbbell",
      frequency: body.frequency || "daily",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newHabit,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process habit" },
      { status: 500 }
    );
  }
}
