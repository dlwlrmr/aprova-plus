import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required");
}

// Custom storage adapter for Supabase Auth
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("Error getting item from secure store:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error("Error setting item in secure store:", error);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error("Error removing item from secure store:", error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types for Supabase tables
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  concurso: string;
  horasPerDay: number;
  trabalha: boolean;
  difficulty: "procrastination" | "organization" | "consistency" | "focus";
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  date: string;
  horasEstudadas: number;
  tarefasConcluidas: number;
  streak: number;
  ultimoAcesso: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserTask {
  id: string;
  userId: string;
  titulo: string;
  descricao: string;
  materia: string;
  concluida: boolean;
  dataVencimento: string;
  dataConclusao: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  titulo: string;
  conteudo: string;
  area: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectProgress {
  id: string;
  userId: string;
  materia: string;
  progresso: number;
  horasEstudadas: number;
  ultimaRevisao: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyStats {
  id: string;
  userId: string;
  data: string;
  horasEstudadas: number;
  tarefasConcluidas: number;
  questoesResolvidas: number;
  createdAt: string;
  updatedAt: string;
}
