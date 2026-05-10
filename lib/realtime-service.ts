import { supabase } from "./supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map();

  /**
   * Inscrever em mudanças de progresso do usuário em tempo real
   */
  static subscribeToProgressChanges(
    userId: string,
    onProgressUpdate: (data: any) => void,
    onError?: (error: any) => void
  ) {
    const channelName = `user_progress:${userId}`;

    // Evitar múltiplas inscrições no mesmo canal
    if (this.channels.has(channelName)) {
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_progress",
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          onProgressUpdate(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Inscrito em mudanças de progresso para ${userId}`);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          if (onError) onError(new Error(`Canal ${channelName} fechado`));
          this.channels.delete(channelName);
        }
      });

    this.channels.set(channelName, channel);
  }

  /**
   * Inscrever em mudanças de tarefas do usuário em tempo real
   */
  static subscribeToTaskChanges(
    userId: string,
    onTaskUpdate: (data: any) => void,
    onError?: (error: any) => void
  ) {
    const channelName = `user_tasks:${userId}`;

    if (this.channels.has(channelName)) {
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_tasks",
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          onTaskUpdate(payload);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Inscrito em mudanças de tarefas para ${userId}`);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          if (onError) onError(new Error(`Canal ${channelName} fechado`));
          this.channels.delete(channelName);
        }
      });

    this.channels.set(channelName, channel);
  }

  /**
   * Inscrever em mudanças de anotações do usuário em tempo real
   */
  static subscribeToNoteChanges(
    userId: string,
    onNoteUpdate: (data: any) => void,
    onError?: (error: any) => void
  ) {
    const channelName = `user_notes:${userId}`;

    if (this.channels.has(channelName)) {
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_notes",
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          onNoteUpdate(payload);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Inscrito em mudanças de anotações para ${userId}`);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          if (onError) onError(new Error(`Canal ${channelName} fechado`));
          this.channels.delete(channelName);
        }
      });

    this.channels.set(channelName, channel);
  }

  /**
   * Inscrever em mudanças de progresso de matérias em tempo real
   */
  static subscribeToSubjectProgressChanges(
    userId: string,
    onSubjectUpdate: (data: any) => void,
    onError?: (error: any) => void
  ) {
    const channelName = `subject_progress:${userId}`;

    if (this.channels.has(channelName)) {
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subject_progress",
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          onSubjectUpdate(payload);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Inscrito em mudanças de progresso de matérias para ${userId}`);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          if (onError) onError(new Error(`Canal ${channelName} fechado`));
          this.channels.delete(channelName);
        }
      });

    this.channels.set(channelName, channel);
  }

  /**
   * Desinscrever de um canal específico
   */
  static unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`Desinscrito do canal ${channelName}`);
    }
  }

  /**
   * Desinscrever de todos os canais
   */
  static unsubscribeAll() {
    for (const [channelName, channel] of this.channels.entries()) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
    console.log("Desinscrito de todos os canais");
  }

  /**
   * Obter lista de canais ativos
   */
  static getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }
}
