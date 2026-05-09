import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, DayTask, UserProfile, generateTodayTasks, loadState, saveState, updateStreak } from "./store";

interface AppContextValue {
  state: AppState;
  isLoading: boolean;
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  toggleTiredMode: () => Promise<void>;
  toggleSound: () => Promise<void>;
  addStudyTime: (minutes: number) => Promise<void>;
  resetApp: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    profile: null,
    streak: 0,
    lastStudyDate: null,
    totalHours: 0,
    weeklyHours: [0, 0, 0, 0, 0, 0, 0],
    todayTasks: [],
    tiredModeActive: false,
    soundEnabled: true,
    tasksCompletedTotal: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadState().then((loaded) => {
      setState(loaded);
      setIsLoading(false);
    });
  }, []);

  const completeOnboarding = async (profile: UserProfile) => {
    const tasks = generateTodayTasks(profile, false);
    const next: AppState = { ...state, profile, todayTasks: tasks };
    setState(next);
    await saveState(next);
  };

  const toggleTask = async (taskId: string) => {
    const tasks = state.todayTasks.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    const justCompleted = tasks.find((t) => t.id === taskId)?.done;
    const tasksCompletedTotal = justCompleted
      ? state.tasksCompletedTotal + 1
      : Math.max(0, state.tasksCompletedTotal - 1);

    // Check if all tasks done → update streak
    const allDone = tasks.every((t) => t.done);
    let streakData = { streak: state.streak, lastStudyDate: state.lastStudyDate };
    if (allDone) {
      streakData = updateStreak(state);
    }

    const next: AppState = { ...state, todayTasks: tasks, tasksCompletedTotal, ...streakData };
    setState(next);
    await saveState(next);
  };

  const toggleTiredMode = async () => {
    const tiredModeActive = !state.tiredModeActive;
    const tasks = state.profile
      ? generateTodayTasks(state.profile, tiredModeActive)
      : state.todayTasks;
    const next: AppState = { ...state, tiredModeActive, todayTasks: tasks };
    setState(next);
    await saveState(next);
  };

  const toggleSound = async () => {
    const next: AppState = { ...state, soundEnabled: !state.soundEnabled };
    setState(next);
    await saveState(next);
  };

  const addStudyTime = async (minutes: number) => {
    const hours = minutes / 60;
    const dayOfWeek = new Date().getDay();
    const weeklyHours = [...state.weeklyHours];
    weeklyHours[dayOfWeek] = (weeklyHours[dayOfWeek] || 0) + hours;
    const totalHours = state.totalHours + hours;
    const streakData = updateStreak(state);
    const next: AppState = { ...state, totalHours, weeklyHours, ...streakData };
    setState(next);
    await saveState(next);
  };

  const resetApp = async () => {
    const fresh: AppState = {
      profile: null,
      streak: 0,
      lastStudyDate: null,
      totalHours: 0,
      weeklyHours: [0, 0, 0, 0, 0, 0, 0],
      todayTasks: [],
      tiredModeActive: false,
      soundEnabled: true,
      tasksCompletedTotal: 0,
    };
    setState(fresh);
    await saveState(fresh);
  };

  return (
    <AppContext.Provider
      value={{ state, isLoading, completeOnboarding, toggleTask, toggleTiredMode, toggleSound, addStudyTime, resetApp }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
