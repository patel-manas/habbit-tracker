import React from "react";
import {
  Dumbbell,
  Flame,
  Droplets,
  BookOpen,
  Moon,
  Sun,
  Heart,
  Sparkles,
  Brain,
  Footprints,
  Zap,
  Apple,
  Coffee,
  Music,
  Smile,
  Trophy,
  Target,
  Clock,
  Activity,
  Check,
  LucideProps,
} from "lucide-react";

export const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Dumbbell,
  Flame,
  Droplets,
  BookOpen,
  Moon,
  Sun,
  Heart,
  Sparkles,
  Brain,
  Footprints,
  Zap,
  Apple,
  Coffee,
  Music,
  Smile,
  Trophy,
  Target,
  Clock,
  Activity,
  Check,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export const HabitIcon: React.FC<{ name: string; className?: string; size?: number }> = ({
  name,
  className = "w-5 h-5",
  size = 20,
}) => {
  const IconComponent = ICON_MAP[name] || Activity;
  return <IconComponent className={className} size={size} />;
};
