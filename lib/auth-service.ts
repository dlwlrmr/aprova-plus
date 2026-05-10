import { supabase, UserProfile } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class AuthService {
  /**
   * Registrar novo usuário
   */
  static async signup(email: string, password: string, profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">) {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Falha ao criar usuário");

      // Criar perfil do usuário
      const { error: profileError } = await supabase.from("user_profiles").insert([
        {
          id: authData.user.id,
          email,
          name: profile.name,
          concurso: profile.concurso,
          horasPerDay: profile.horasPerDay,
          trabalha: profile.trabalha,
          difficulty: profile.difficulty,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      if (profileError) throw profileError;

      // Inicializar progresso do usuário
      const { error: progressError } = await supabase.from("user_progress").insert([
        {
          userId: authData.user.id,
          date: new Date().toISOString().split("T")[0],
          horasEstudadas: 0,
          tarefasConcluidas: 0,
          streak: 0,
          ultimoAcesso: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      if (progressError) throw progressError;

      return { user: authData.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  /**
   * Login de usuário
   */
  static async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Falha ao fazer login");

      // Salvar sessão localmente
      await AsyncStorage.setItem("@aprova_user_id", data.user.id);
      await AsyncStorage.setItem("@aprova_session", JSON.stringify(data.session));

      return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
      return { user: null, session: null, error: error.message };
    }
  }

  /**
   * Logout de usuário
   */
  static async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Limpar sessão local
      await AsyncStorage.removeItem("@aprova_user_id");
      await AsyncStorage.removeItem("@aprova_session");

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Restaurar sessão persistente
   */
  static async restoreSession() {
    try {
      const sessionJson = await AsyncStorage.getItem("@aprova_session");
      if (!sessionJson) return { session: null, user: null };

      const session = JSON.parse(sessionJson);
      const { data, error } = await supabase.auth.refreshSession(session);

      if (error || !data.session) {
        await AsyncStorage.removeItem("@aprova_session");
        await AsyncStorage.removeItem("@aprova_user_id");
        return { session: null, user: null };
      }

      return { session: data.session, user: data.user };
    } catch (error: any) {
      console.error("Erro ao restaurar sessão:", error);
      return { session: null, user: null };
    }
  }

  /**
   * Obter usuário atual
   */
  static async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;
      return data.user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obter perfil do usuário
   */
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    } catch (error: any) {
      console.error("Erro ao obter perfil:", error);
      return null;
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Redefinir senha
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "aprova://reset-password",
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
}


