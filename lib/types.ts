export type HabitCategory = 'health' | 'fitness' | 'productivity' | 'mindfulness' | 'learning' | 'other';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  color: string; // e.g. '#ddf247'
  icon: string;  // Lucide icon key
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
  targetDaysPerWeek?: number;
  createdAt: string;
  archived?: boolean;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  completedHabitIds: string[];
  mood?: string;
  notes?: string;
  tags?: string[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  provider?: "google.com" | "password" | "demo";
  createdAt?: string;
  lastLoginAt?: string;
  isDemo?: boolean;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  todayCompletionRate: number;
  currentStreak: number;
  bestStreak: number;
  totalCompletionsThisYear: number;
  yearlyConsistencyScore: number;
}
