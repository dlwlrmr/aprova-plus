import { supabase, UserProgress, UserTask, UserNote, SubjectProgress, DailyStats } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class SyncService {
  /**
   * Sincronizar progresso diário do usuário
   */
  static async syncDailyProgress(userId: string, progress: Partial<UserProgress>) {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Verificar se já existe progresso para hoje
      const { data: existingProgress, error: fetchError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("userId", userId)
        .eq("date", today)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingProgress) {
        // Atualizar progresso existente
        const { error: updateError } = await supabase
          .from("user_progress")
          .update({
            ...progress,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", existingProgress.id);

        if (updateError) throw updateError;
        return { error: null };
      } else {
        // Criar novo progresso
        const { error: insertError } = await supabase.from("user_progress").insert([
          {
            userId,
            date: today,
            horasEstudadas: progress.horasEstudadas || 0,
            tarefasConcluidas: progress.tarefasConcluidas || 0,
            streak: progress.streak || 0,
            ultimoAcesso: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);

        if (insertError) throw insertError;
        return { error: null };
      }
    } catch (error: any) {
      console.error("Erro ao sincronizar progresso:", error);
      return { error: error.message };
    }
  }

  /**
   * Obter progresso do usuário
   */
  static async getUserProgress(userId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("userId", userId)
        .gte("date", startDateStr)
        .order("date", { ascending: false });

      if (error) throw error;
      return { data: data as UserProgress[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  /**
   * Criar tarefa do usuário
   */
  static async createTask(userId: string, task: Omit<UserTask, "id" | "createdAt" | "updatedAt">) {
    try {
      const { data, error } = await supabase
        .from("user_tasks")
        .insert([
          {
            ...task,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data: data as UserTask, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Atualizar tarefa do usuário
   */
  static async updateTask(taskId: string, updates: Partial<UserTask>) {
    try {
      const { error } = await supabase
        .from("user_tasks")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", taskId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Obter tarefas do usuário
   */
  static async getUserTasks(userId: string, completed?: boolean) {
    try {
      let query = supabase.from("user_tasks").select("*").eq("userId", userId);

      if (completed !== undefined) {
        query = query.eq("concluida", completed);
      }

      const { data, error } = await query.order("dataVencimento", { ascending: true });

      if (error) throw error;
      return { data: data as UserTask[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  /**
   * Criar anotação do usuário
   */
  static async createNote(userId: string, note: Omit<UserNote, "id" | "createdAt" | "updatedAt">) {
    try {
      const { data, error } = await supabase
        .from("user_notes")
        .insert([
          {
            ...note,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data: data as UserNote, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Obter anotações do usuário
   */
  static async getUserNotes(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_notes")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });

      if (error) throw error;
      return { data: data as UserNote[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  /**
   * Deletar anotação
   */
  static async deleteNote(noteId: string) {
    try {
      const { error } = await supabase.from("user_notes").delete().eq("id", noteId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Sincronizar progresso de matéria
   */
  static async syncSubjectProgress(userId: string, materia: string, updates: Partial<SubjectProgress>) {
    try {
      // Verificar se já existe progresso para a matéria
      const { data: existing, error: fetchError } = await supabase
        .from("subject_progress")
        .select("*")
        .eq("userId", userId)
        .eq("materia", materia)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existing) {
        // Atualizar
        const { error: updateError } = await supabase
          .from("subject_progress")
          .update({
            ...updates,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) throw updateError;
        return { error: null };
      } else {
        // Criar novo
        const { error: insertError } = await supabase.from("subject_progress").insert([
          {
            userId,
            materia,
            progresso: updates.progresso || 0,
            horasEstudadas: updates.horasEstudadas || 0,
            ultimaRevisao: updates.ultimaRevisao || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);

        if (insertError) throw insertError;
        return { error: null };
      }
    } catch (error: any) {
      console.error("Erro ao sincronizar progresso de matéria:", error);
      return { error: error.message };
    }
  }

  /**
   * Obter progresso de matérias
   */
  static async getSubjectsProgress(userId: string) {
    try {
      const { data, error } = await supabase
        .from("subject_progress")
        .select("*")
        .eq("userId", userId)
        .order("progresso", { ascending: false });

      if (error) throw error;
      return { data: data as SubjectProgress[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  /**
   * Registrar estatísticas diárias
   */
  static async recordDailyStats(userId: string, stats: Omit<DailyStats, "id" | "createdAt" | "updatedAt">) {
    try {
      const { error } = await supabase.from("daily_stats").insert([
        {
          ...stats,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Obter estatísticas diárias
   */
  static async getDailyStats(userId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("daily_stats")
        .select("*")
        .eq("userId", userId)
        .gte("data", startDateStr)
        .order("data", { ascending: false });

      if (error) throw error;
      return { data: data as DailyStats[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }
}
