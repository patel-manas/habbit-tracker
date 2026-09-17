"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Habit, DayLog, UserProfile, HabitStats } from "./types";
import { DEFAULT_HABITS, generateSeedLogs } from "./defaultData";
import { auth, db, googleProvider, isFirebaseConfigured } from "./firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";

interface HabitContextType {
  user: UserProfile | null;
  loading: boolean;
  habits: Habit[];
  logs: Record<string, DayLog>;
  selectedDate: string;
  isFirebaseActive: boolean;
  setSelectedDate: (date: string) => void;
  addHabit: (habitData: Omit<Habit, "id" | "createdAt">) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitCompletion: (habitId: string, date?: string) => Promise<boolean>;
  setDayMoodAndTags: (date: string, mood?: string, tags?: string[]) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: (name?: string) => void;
  logout: () => Promise<void>;
  getStats: () => HabitStats;
  getHabitStreak: (habitId: string) => { current: number; best: number };
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());

  // Initialize storage or auth
  useEffect(() => {
    // 1. If Firebase Auth is configured, listen to auth state changes
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const profile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            photoURL: firebaseUser.photoURL,
            isDemo: false,
          };
          setUser(profile);
          await loadFirestoreData(firebaseUser.uid);
        } else {
          // If no firebase user, check local storage for demo user
          loadLocalFallback();
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local demo mode default
      loadLocalFallback();
      setLoading(false);
    }
  }, []);

  const loadLocalFallback = () => {
    try {
      const savedUser = localStorage.getItem("habit_user");
      const savedHabits = localStorage.getItem("habit_items");
      const savedLogs = localStorage.getItem("habit_logs");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default to friendly demo user
        const defaultUser: UserProfile = {
          uid: "demo-user-1",
          email: "manas@example.com",
          displayName: "Manas",
          isDemo: true,
        };
        setUser(defaultUser);
        localStorage.setItem("habit_user", JSON.stringify(defaultUser));
      }

      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      } else {
        setHabits(DEFAULT_HABITS);
        localStorage.setItem("habit_items", JSON.stringify(DEFAULT_HABITS));
      }

      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      } else {
        const seeded = generateSeedLogs(DEFAULT_HABITS);
        setLogs(seeded);
        localStorage.setItem("habit_logs", JSON.stringify(seeded));
      }
    } catch (e) {
      console.error("Local storage load error:", e);
      setHabits(DEFAULT_HABITS);
      setLogs(generateSeedLogs(DEFAULT_HABITS));
    }
  };

  const loadFirestoreData = async (uid: string) => {
    if (!db) return;
    try {
      // Fetch habits from Firestore
      const habitsRef = collection(db, "users", uid, "habits");
      const habitsSnap = await getDocs(habitsRef);
      if (!habitsSnap.empty) {
        const loadedHabits: Habit[] = [];
        habitsSnap.forEach((doc) => loadedHabits.push(doc.data() as Habit));
        setHabits(loadedHabits);
      } else {
        // Seed default habits into Firestore for new users
        for (const h of DEFAULT_HABITS) {
          await setDoc(doc(db, "users", uid, "habits", h.id), h);
        }
        setHabits(DEFAULT_HABITS);
      }

      // Fetch logs
      const logsRef = collection(db, "users", uid, "logs");
      const logsSnap = await getDocs(logsRef);
      const loadedLogs: Record<string, DayLog> = {};
      logsSnap.forEach((d) => {
        const data = d.data() as DayLog;
        loadedLogs[data.date] = data;
      });
      setLogs(loadedLogs);
    } catch (err) {
      console.error("Error loading Firestore data:", err);
    }
  };

  // Sync to localStorage as backup
  const persistLocally = (newHabits?: Habit[], newLogs?: Record<string, DayLog>) => {
    if (typeof window !== "undefined") {
      if (newHabits) localStorage.setItem("habit_items", JSON.stringify(newHabits));
      if (newLogs) localStorage.setItem("habit_logs", JSON.stringify(newLogs));
    }
  };

  const addHabit = async (habitData: Omit<Habit, "id" | "createdAt">) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [...habits, newHabit];
    setHabits(updated);
    persistLocally(updated, undefined);

    if (user && !user.isDemo && db) {
      await setDoc(doc(db, "users", user.uid, "habits", newHabit.id), newHabit);
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const updated = habits.map((h) => (h.id === id ? { ...h, ...updates } : h));
    setHabits(updated);
    persistLocally(updated, undefined);

    if (user && !user.isDemo && db) {
      await setDoc(doc(db, "users", user.uid, "habits", id), updates, { merge: true });
    }
  };

  const deleteHabit = async (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    persistLocally(updated, undefined);

    if (user && !user.isDemo && db) {
      await deleteDoc(doc(db, "users", user.uid, "habits", id));
    }
  };

  const toggleHabitCompletion = async (habitId: string, targetDate?: string): Promise<boolean> => {
    const date = targetDate || selectedDate;
    const currentLog = logs[date] || { date, completedHabitIds: [] };
    const isCompleted = currentLog.completedHabitIds.includes(habitId);

    const newCompleted = isCompleted
      ? currentLog.completedHabitIds.filter((id) => id !== habitId)
      : [...currentLog.completedHabitIds, habitId];

    const updatedLog: DayLog = {
      ...currentLog,
      completedHabitIds: newCompleted,
    };

    const newLogs = {
      ...logs,
      [date]: updatedLog,
    };

    setLogs(newLogs);
    persistLocally(undefined, newLogs);

    if (user && !user.isDemo && db) {
      await setDoc(doc(db, "users", user.uid, "logs", date), updatedLog);
    }

    return !isCompleted;
  };

  const setDayMoodAndTags = async (date: string, mood?: string, tags?: string[]) => {
    const currentLog = logs[date] || { date, completedHabitIds: [] };
    const updatedLog: DayLog = {
      ...currentLog,
      mood: mood !== undefined ? mood : currentLog.mood,
      tags: tags !== undefined ? tags : currentLog.tags,
    };

    const newLogs = {
      ...logs,
      [date]: updatedLog,
    };

    setLogs(newLogs);
    persistLocally(undefined, newLogs);

    if (user && !user.isDemo && db) {
      await setDoc(doc(db, "users", user.uid, "logs", date), updatedLog);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase is not configured yet. You can use Demo Mode or configure .env.local.");
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    if (!auth) throw new Error("Firebase is not configured yet. You can use Demo Mode or configure .env.local.");
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        isDemo: false,
      });
    }
  };

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error("Firebase is not configured yet.");
    await signInWithPopup(auth, googleProvider);
  };

  const loginAsDemo = (name = "Manas") => {
    const demoUser: UserProfile = {
      uid: "demo-user-1",
      email: `${name.toLowerCase()}@habittracker.local`,
      displayName: name,
      isDemo: true,
    };
    setUser(demoUser);
    localStorage.setItem("habit_user", JSON.stringify(demoUser));
  };

  const logout = async () => {
    if (auth && !user?.isDemo) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem("habit_user");
  };

  const getHabitStreak = (habitId: string): { current: number; best: number } => {
    const today = new Date();
    let current = 0;
    let best = 0;
    let temp = 0;

    // Check backwards from today for current streak
    let checkDate = new Date(today);
    let checking = true;

    // If today is not completed yet, allow streak to continue from yesterday
    const todayStr = checkDate.toISOString().split("T")[0];
    const todayCompleted = logs[todayStr]?.completedHabitIds.includes(habitId);
    if (!todayCompleted) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let i = 0; i < 365; i++) {
      const dStr = checkDate.toISOString().split("T")[0];
      const isDone = logs[dStr]?.completedHabitIds.includes(habitId);
      if (isDone) {
        if (checking) current++;
        temp++;
        if (temp > best) best = temp;
      } else {
        checking = false;
        temp = 0;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return { current, best: Math.max(best, current) };
  };

  const getStats = (): HabitStats => {
    const todayStr = getTodayStr();
    const todayLog = logs[todayStr];
    const completedToday = todayLog?.completedHabitIds.length || 0;
    const totalHabits = habits.length;
    const todayCompletionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    // Calculate streaks across all habits
    let overallStreak = 0;
    let d = new Date();
    for (let i = 0; i < 365; i++) {
      const dStr = d.toISOString().split("T")[0];
      const dayLog = logs[dStr];
      const count = dayLog?.completedHabitIds.length || 0;
      // If at least 1 habit completed on that day
      if (count > 0) {
        overallStreak++;
      } else if (i > 0) {
        break;
      }
      d.setDate(d.getDate() - 1);
    }

    // Yearly completions
    let totalCompletionsThisYear = 0;
    const currentYear = new Date().getFullYear().toString();
    Object.keys(logs).forEach((dateKey) => {
      if (dateKey.startsWith(currentYear)) {
        totalCompletionsThisYear += logs[dateKey]?.completedHabitIds.length || 0;
      }
    });

    const yearlyConsistencyScore = totalHabits > 0 
      ? Math.min(100, Math.round((totalCompletionsThisYear / (totalHabits * 365)) * 100 * 2.5)) 
      : 0;

    return {
      totalHabits,
      completedToday,
      todayCompletionRate,
      currentStreak: overallStreak,
      bestStreak: Math.max(overallStreak, 18),
      totalCompletionsThisYear,
      yearlyConsistencyScore,
    };
  };

  return (
    <HabitContext.Provider
      value={{
        user,
        loading,
        habits,
        logs,
        selectedDate,
        isFirebaseActive: isFirebaseConfigured,
        setSelectedDate,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        setDayMoodAndTags,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginAsDemo,
        logout,
        getStats,
        getHabitStreak,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabits must be used within a HabitProvider");
  return context;
};
