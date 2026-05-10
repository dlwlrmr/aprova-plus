import { supabase } from './supabase';

/**
 * Gerenciador de conteúdo dinâmico
 * Sincroniza questões, vídeoaulas, dicas de livros e outros conteúdos
 */

export interface ContentVersion {
  id: string;
  type: 'questions' | 'videos' | 'books' | 'tips';
  concurso: string;
  version: number;
  lastUpdated: string;
  checksum: string;
}

export interface CachedContent {
  type: string;
  concurso: string;
  version: number;
  data: any;
  cachedAt: number;
}

const CONTENT_CACHE_KEY = 'aprova_content_cache';
const CONTENT_VERSIONS_KEY = 'aprova_content_versions';
const CONTENT_CHECK_INTERVAL = 3600000; // 1 hora

export class ContentManager {
  /**
   * Verificar se há conteúdo novo disponível
   */
  static async checkForUpdates(concurso: string): Promise<ContentVersion[]> {
    try {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('concurso', concurso)
        .order('lastUpdated', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao verificar atualizações de conteúdo:', error);
      return [];
    }
  }

  /**
   * Obter questões do Supabase ou cache
   */
  static async getQuestions(
    concurso: string,
    forceRefresh = false
  ): Promise<any[]> {
    try {
      // Verificar cache local
      if (!forceRefresh) {
        const cached = await this.getFromCache('questions', concurso);
        if (cached) {
          console.log('[ContentManager] Questões obtidas do cache');
          return cached;
        }
      }

      // Buscar do Supabase
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('concurso', concurso)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      // Cachear resultado
      if (data) {
        await this.saveToCache('questions', concurso, data);
      }

      console.log(`[ContentManager] ${data?.length || 0} questões carregadas`);
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
      // Retornar cache como fallback
      return (await this.getFromCache('questions', concurso)) || [];
    }
  }

  /**
   * Obter vídeoaulas do Supabase ou cache
   */
  static async getVideos(
    concurso: string,
    forceRefresh = false
  ): Promise<any[]> {
    try {
      if (!forceRefresh) {
        const cached = await this.getFromCache('videos', concurso);
        if (cached) {
          console.log('[ContentManager] Vídeos obtidos do cache');
          return cached;
        }
      }

      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('concurso', concurso)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      if (data) {
        await this.saveToCache('videos', concurso, data);
      }

      console.log(`[ContentManager] ${data?.length || 0} vídeos carregados`);
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
      return (await this.getFromCache('videos', concurso)) || [];
    }
  }

  /**
   * Obter dicas de livros do Supabase ou cache
   */
  static async getBooks(
    concurso: string,
    forceRefresh = false
  ): Promise<any[]> {
    try {
      if (!forceRefresh) {
        const cached = await this.getFromCache('books', concurso);
        if (cached) {
          console.log('[ContentManager] Livros obtidos do cache');
          return cached;
        }
      }

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('concurso', concurso)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      if (data) {
        await this.saveToCache('books', concurso, data);
      }

      console.log(`[ContentManager] ${data?.length || 0} livros carregados`);
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      return (await this.getFromCache('books', concurso)) || [];
    }
  }

  /**
   * Obter dicas gerais do Supabase ou cache
   */
  static async getTips(
    concurso: string,
    forceRefresh = false
  ): Promise<any[]> {
    try {
      if (!forceRefresh) {
        const cached = await this.getFromCache('tips', concurso);
        if (cached) {
          console.log('[ContentManager] Dicas obtidas do cache');
          return cached;
        }
      }

      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .eq('concurso', concurso)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      if (data) {
        await this.saveToCache('tips', concurso, data);
      }

      console.log(`[ContentManager] ${data?.length || 0} dicas carregadas`);
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar dicas:', error);
      return (await this.getFromCache('tips', concurso)) || [];
    }
  }

  /**
   * Salvar conteúdo no cache local
   */
  private static async saveToCache(
    type: string,
    concurso: string,
    data: any
  ): Promise<void> {
    try {
      const cache: Record<string, CachedContent> =
        JSON.parse(localStorage.getItem(CONTENT_CACHE_KEY) || '{}') || {};

      const key = `${type}:${concurso}`;
      cache[key] = {
        type,
        concurso,
        version: 1,
        data,
        cachedAt: Date.now(),
      };

      localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(cache));
      console.log(`[ContentManager] Cache salvo: ${key}`);
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  /**
   * Obter conteúdo do cache local
   */
  private static async getFromCache(
    type: string,
    concurso: string
  ): Promise<any[] | null> {
    try {
      const cache: Record<string, CachedContent> =
        JSON.parse(localStorage.getItem(CONTENT_CACHE_KEY) || '{}') || {};

      const key = `${type}:${concurso}`;
      const cached = cache[key];

      if (!cached) return null;

      // Verificar se cache expirou (24 horas)
      const cacheAge = Date.now() - cached.cachedAt;
      const cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas

      if (cacheAge > cacheExpiry) {
        console.log(`[ContentManager] Cache expirado: ${key}`);
        delete cache[key];
        localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(cache));
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Erro ao obter cache:', error);
      return null;
    }
  }

  /**
   * Limpar cache de conteúdo
   */
  static async clearCache(type?: string, concurso?: string): Promise<void> {
    try {
      if (!type || !concurso) {
        localStorage.removeItem(CONTENT_CACHE_KEY);
        console.log('[ContentManager] Cache completo limpo');
        return;
      }

      const cache: Record<string, CachedContent> =
        JSON.parse(localStorage.getItem(CONTENT_CACHE_KEY) || '{}') || {};

      const key = `${type}:${concurso}`;
      delete cache[key];

      localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(cache));
      console.log(`[ContentManager] Cache limpo: ${key}`);
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  /**
   * Obter informações de cache
   */
  static async getCacheInfo(): Promise<{
    size: number;
    items: number;
    lastUpdated: number;
  }> {
    try {
      const cache: Record<string, CachedContent> =
        JSON.parse(localStorage.getItem(CONTENT_CACHE_KEY) || '{}') || {};

      const items = Object.keys(cache).length;
      const size = new Blob([JSON.stringify(cache)]).size;
      const lastUpdated = Math.max(
        ...Object.values(cache).map((c) => c.cachedAt),
        0
      );

      return { size, items, lastUpdated };
    } catch (error) {
      console.error('Erro ao obter info do cache:', error);
      return { size: 0, items: 0, lastUpdated: 0 };
    }
  }

  /**
   * Sincronizar conteúdo em background
   */
  static async syncContentInBackground(concurso: string): Promise<void> {
    try {
      console.log('[ContentManager] Sincronizando conteúdo em background...');

      // Carregar todos os tipos de conteúdo com forceRefresh
      await Promise.all([
        this.getQuestions(concurso, true),
        this.getVideos(concurso, true),
        this.getBooks(concurso, true),
        this.getTips(concurso, true),
      ]);

      console.log('[ContentManager] Sincronização completa');
    } catch (error) {
      console.error('Erro ao sincronizar conteúdo:', error);
    }
  }
}
