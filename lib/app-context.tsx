import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, DayTask, UserProfile, generateTodayTasks, loadState, saveState, updateStreak } from "./store";
import { AuthService } from "./auth-service";
import { SyncService } from "./sync-service";

interface AppContextValue {
  state: AppState;
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  toggleTiredMode: () => Promise<void>;
  toggleSound: () => Promise<void>;
  addStudyTime: (minutes: number) => Promise<void>;
  resetApp: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  syncToSupabase: () => Promise<void>;
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
    notes: [],
    questionsAnswered: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Inicializar: restaurar sessão e carregar estado local
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Restaurar sessão Supabase
      const { session, user } = await AuthService.restoreSession();
      if (session && user) {
        setIsAuthenticated(true);
        setUserId(user.id);
        setUserEmail(user.email || null);
        // Carregar dados do Supabase
        await loadSupabaseData(user.id);
      }

      // Carregar estado local
      const loaded = await loadState();
      setState(loaded);
    } catch (error) {
      console.error("Erro ao inicializar app:", error);
      // Carregar apenas estado local em caso de erro
      const loaded = await loadState();
      setState(loaded);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSupabaseData = async (uid: string) => {
    try {
      // Carregar perfil
      const profile = await AuthService.getUserProfile(uid);
      if (profile) {
        const userProfile: UserProfile = {
          name: profile.name,
          concurso: profile.concurso,
          horasPerDay: profile.horasPerDay,
          trabalha: profile.trabalha,
          difficulty: profile.difficulty,
          onboardingDone: true,
          createdAt: profile.createdAt,
        };
        setState((prev) => ({ ...prev, profile: userProfile }));
      }

      // Carregar progresso
      const { data: progressData } = await SyncService.getUserProgress(uid, 1);
      if (progressData && progressData.length > 0) {
        const today = progressData[0];
        setState((prev) => ({
          ...prev,
          totalHours: today.horasEstudadas,
          tasksCompletedTotal: today.tarefasConcluidas,
          streak: today.streak,
        }));
      }

      // Carregar anotações
      const { data: notesData } = await SyncService.getUserNotes(uid);
      if (notesData) {
        const convertedNotes = notesData.map((n: any) => ({
          id: n.id,
          title: n.titulo,
          content: n.conteudo,
          area: n.area,
          concurso: "",
          createdAt: new Date(n.createdAt).getTime(),
          updatedAt: new Date(n.updatedAt).getTime(),
          tags: [],
        }));
        setState((prev) => ({ ...prev, notes: convertedNotes }));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do Supabase:", error);
    }
  };

  const completeOnboarding = async (profile: UserProfile) => {
    const tasks = generateTodayTasks(profile, false);
    const next: AppState = { ...state, profile, todayTasks: tasks };
    setState(next);
    await saveState(next);

    // Sincronizar com Supabase se autenticado
    if (isAuthenticated && userId) {
      try {
        await AuthService.updateUserProfile(userId, {
          name: profile.name,
          concurso: profile.concurso,
          horasPerDay: profile.horasPerDay,
          trabalha: profile.trabalha,
          difficulty: profile.difficulty,
        } as any);
      } catch (error) {
        console.error("Erro ao sincronizar perfil:", error);
      }
    }
  };

  const toggleTask = async (taskId: string) => {
    const tasks = state.todayTasks.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    const justCompleted = tasks.find((t) => t.id === taskId)?.done;
    const tasksCompletedTotal = justCompleted
      ? state.tasksCompletedTotal + 1
      : Math.max(0, state.tasksCompletedTotal - 1);

    const allDone = tasks.every((t) => t.done);
    let streakData = { streak: state.streak, lastStudyDate: state.lastStudyDate };
    if (allDone) {
      streakData = updateStreak(state);
    }

    const next: AppState = { ...state, todayTasks: tasks, tasksCompletedTotal, ...streakData };
    setState(next);
    await saveState(next);

    // Sincronizar com Supabase
    if (isAuthenticated && userId) {
      try {
        await SyncService.syncDailyProgress(userId, {
          tarefasConcluidas: tasksCompletedTotal,
          streak: streakData.streak,
        } as any);
      } catch (error) {
        console.error("Erro ao sincronizar tarefa:", error);
      }
    }
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

    // Sincronizar com Supabase
    if (isAuthenticated && userId) {
      try {
        await SyncService.syncDailyProgress(userId, {
          horasEstudadas: totalHours,
          streak: streakData.streak,
        } as any);
      } catch (error) {
        console.error("Erro ao sincronizar tempo de estudo:", error);
      }
    }
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
      notes: [],
      questionsAnswered: {},
    };
    setState(fresh);
    await saveState(fresh);

    // Fazer logout se autenticado
    if (isAuthenticated) {
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user, session, error } = await AuthService.login(email, password);
      if (error || !user) throw new Error(error || "Falha ao fazer login");

      setIsAuthenticated(true);
      setUserId(user.id);
      setUserEmail(user.email || null);

      // Carregar dados do Supabase
      await loadSupabaseData(user.id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      const { error } = await AuthService.logout();
      if (error) throw new Error(error);

      setIsAuthenticated(false);
      setUserId(null);
      setUserEmail(null);
      await resetApp();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { user, error } = await AuthService.signup(email, password, {
        email,
        name,
        concurso: "",
        horasPerDay: 2,
        trabalha: false,
        difficulty: "procrastination",
      });

      if (error || !user) throw new Error(error || "Falha ao criar conta");

      setIsAuthenticated(true);
      setUserId(user.id);
      setUserEmail(user.email || null);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const syncToSupabase = async () => {
    if (!isAuthenticated || !userId) return;

    try {
      // Sincronizar progresso
      await SyncService.syncDailyProgress(userId, {
        horasEstudadas: state.totalHours,
        tarefasConcluidas: state.tasksCompletedTotal,
        streak: state.streak,
      } as any);

      // Sincronizar anotações
      for (const note of state.notes) {
        if (!note.id) {
          await SyncService.createNote(userId, {
            titulo: note.title || "",
            conteudo: note.content || "",
            area: note.area || "",
          } as any);
        }
      }
    } catch (error) {
      console.error("Erro ao sincronizar com Supabase:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        isLoading,
        isAuthenticated,
        userId,
        userEmail,
        completeOnboarding,
        toggleTask,
        toggleTiredMode,
        toggleSound,
        addStudyTime,
        resetApp,
        login,
        logout,
        signup,
        syncToSupabase,
      }}
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
