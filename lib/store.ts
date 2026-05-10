import AsyncStorage from "@react-native-async-storage/async-storage";

export type Difficulty = "procrastination" | "organization" | "consistency" | "focus";

export interface UserProfile {
  name: string;
  concurso: string;
  horasPerDay: number;
  trabalha: boolean;
  difficulty: Difficulty;
  onboardingDone: boolean;
  createdAt: string;
}

export interface DayTask {
  id: string;
  title: string;
  subject: string;
  durationMin: number;
  done: boolean;
  isReview?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  area: string;
  concurso: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface AppState {
  profile: UserProfile | null;
  streak: number;
  lastStudyDate: string | null;
  totalHours: number;
  weeklyHours: number[];
  todayTasks: DayTask[];
  tiredModeActive: boolean;
  soundEnabled: boolean;
  tasksCompletedTotal: number;
  notes: Note[];
  questionsAnswered: { [key: string]: number }; // questionId -> 1 (correto) ou 0 (errado)
}

const STORAGE_KEY = "@aprova_plus_state";

const defaultState: AppState = {
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

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export async function saveState(state: Partial<AppState>): Promise<void> {
  try {
    const current = await loadState();
    const next = { ...current, ...state };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

export async function clearState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function generateTodayTasks(profile: UserProfile, tiredMode: boolean): DayTask[] {
  const subjects = profile.concurso
    ? getSubjectsForConcurso(profile.concurso)
    : ["Português", "Matemática", "Direito Constitucional", "Informática"];

  const maxTasks = tiredMode ? 2 : Math.min(Math.ceil(profile.horasPerDay * 1.5), 5);
  const durationMin = tiredMode ? 20 : Math.round((profile.horasPerDay * 60) / maxTasks);

  return subjects.slice(0, maxTasks).map((subject, i) => ({
    id: `task_${Date.now()}_${i}`,
    title: `Estudar ${subject}`,
    subject,
    durationMin,
    done: false,
    isReview: i === maxTasks - 1,
  }));
}

function getSubjectsForConcurso(concurso: string): string[] {
  const lower = concurso.toLowerCase();
  if (lower.includes("tjsp") || lower.includes("tribunal")) {
    return ["Português", "Direito Constitucional", "Direito Administrativo", "Informática", "Revisão Geral"];
  }
  if (lower.includes("policia") || lower.includes("pc") || lower.includes("pm")) {
    return ["Português", "Matemática", "Direito Penal", "Legislação Específica", "Revisão"];
  }
  if (lower.includes("receita") || lower.includes("fiscal")) {
    return ["Português", "Matemática", "Direito Tributário", "Contabilidade", "Revisão"];
  }
  return ["Português", "Matemática", "Direito Constitucional", "Conhecimentos Gerais", "Revisão"];
}

export function updateStreak(state: AppState): { streak: number; lastStudyDate: string } {
  const today = new Date().toISOString().split("T")[0];
  const last = state.lastStudyDate;

  if (last === today) {
    return { streak: state.streak, lastStudyDate: today };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = last === yesterday ? state.streak + 1 : 1;

  return { streak: newStreak, lastStudyDate: today };
}
