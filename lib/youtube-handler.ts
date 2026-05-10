import * as WebBrowser from 'expo-web-browser';
import { Platform, Linking } from 'react-native';

/**
 * Gerenciador de Links do YouTube
 * Abre vídeoaulas corretamente em mobile e web
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  url: string;
}

/**
 * Extrair ID do vídeo de uma URL do YouTube
 */
export function extractYouTubeVideoId(url: string): string | null {
  const regexps = [
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
    /^(.*\/)?([^/]+)$/,
  ];

  for (const regexp of regexps) {
    const match = url.match(regexp);
    if (match && match[7].length === 11) {
      return match[7];
    }
  }

  return null;
}

/**
 * Construir URL do YouTube a partir do ID
 */
export function buildYouTubeUrl(videoId: string, type: 'watch' | 'embed' = 'watch'): string {
  if (type === 'embed') {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Obter URL da thumbnail do vídeo
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' = 'medium'): string {
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
}

/**
 * Abrir vídeo do YouTube
 */
export async function openYouTubeVideo(videoId: string): Promise<void> {
  try {
    const url = buildYouTubeUrl(videoId, 'watch');

    if (Platform.OS === 'web') {
      // Web: abrir em nova aba
      window.open(url, '_blank');
    } else if (Platform.OS === 'ios') {
      // iOS: tentar abrir no app do YouTube, senão no navegador
      const youtubeAppUrl = `youtube://watch?v=${videoId}`;

      try {
        const canOpen = await Linking.canOpenURL(youtubeAppUrl);
        if (canOpen) {
          await Linking.openURL(youtubeAppUrl);
        } else {
          // Fallback para navegador
          await WebBrowser.openBrowserAsync(url);
        }
      } catch {
        // Se falhar, usar navegador
        await WebBrowser.openBrowserAsync(url);
      }
    } else if (Platform.OS === 'android') {
      // Android: tentar abrir no app do YouTube, senão no navegador
      const youtubeAppUrl = `vnd.youtube:${videoId}`;

      try {
        const canOpen = await Linking.canOpenURL(youtubeAppUrl);
        if (canOpen) {
          await Linking.openURL(youtubeAppUrl);
        } else {
          // Fallback para navegador
          await WebBrowser.openBrowserAsync(url);
        }
      } catch {
        // Se falhar, usar navegador
        await WebBrowser.openBrowserAsync(url);
      }
    }
  } catch (error) {
    console.error('Erro ao abrir vídeo do YouTube:', error);
    throw error;
  }
}

/**
 * Abrir URL completa do YouTube
 */
export async function openYouTubeUrl(url: string): Promise<void> {
  try {
    const videoId = extractYouTubeVideoId(url);

    if (videoId) {
      await openYouTubeVideo(videoId);
    } else {
      // Se não conseguir extrair o ID, abrir URL diretamente
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    }
  } catch (error) {
    console.error('Erro ao abrir URL do YouTube:', error);
    throw error;
  }
}

/**
 * Abrir playlist do YouTube
 */
export async function openYouTubePlaylist(playlistId: string): Promise<void> {
  try {
    const url = `https://www.youtube.com/playlist?list=${playlistId}`;

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else if (Platform.OS === 'ios') {
      const youtubeAppUrl = `youtube://list/${playlistId}`;

      try {
        const canOpen = await Linking.canOpenURL(youtubeAppUrl);
        if (canOpen) {
          await Linking.openURL(youtubeAppUrl);
        } else {
          await WebBrowser.openBrowserAsync(url);
        }
      } catch {
        await WebBrowser.openBrowserAsync(url);
      }
    } else if (Platform.OS === 'android') {
      const youtubeAppUrl = `vnd.youtube:playlist/${playlistId}`;

      try {
        const canOpen = await Linking.canOpenURL(youtubeAppUrl);
        if (canOpen) {
          await Linking.openURL(youtubeAppUrl);
        } else {
          await WebBrowser.openBrowserAsync(url);
        }
      } catch {
        await WebBrowser.openBrowserAsync(url);
      }
    }
  } catch (error) {
    console.error('Erro ao abrir playlist do YouTube:', error);
    throw error;
  }
}

/**
 * Abrir canal do YouTube
 */
export async function openYouTubeChannel(channelId: string): Promise<void> {
  try {
    const url = `https://www.youtube.com/channel/${channelId}`;

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else if (Platform.OS === 'ios') {
      const youtubeAppUrl = `youtube://user/${channelId}`;

      try {
        const canOpen = await Linking.canOpenURL(youtubeAppUrl);
        if (canOpen) {
          await Linking.openURL(youtubeAppUrl);
        } else {
          await WebBrowser.openBrowserAsync(url);
        }
      } catch {
        await WebBrowser.openBrowserAsync(url);
      }
    } else if (Platform.OS === 'android') {
      const youtubeAppUrl = `vnd.youtube:user/${channelId}`;

      try {
        const canOpen = await Linking.canOpenURL(youtubeAppUrl);
        if (canOpen) {
          await Linking.openURL(youtubeAppUrl);
        } else {
          await WebBrowser.openBrowserAsync(url);
        }
      } catch {
        await WebBrowser.openBrowserAsync(url);
      }
    }
  } catch (error) {
    console.error('Erro ao abrir canal do YouTube:', error);
    throw error;
  }
}

/**
 * Validar se URL é do YouTube
 */
export function isYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
  return youtubeRegex.test(url);
}

/**
 * Formatar duração do vídeo (segundos para MM:SS)
 */
export function formatVideoDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Criar objeto YouTubeVideo a partir de dados
 */
export function createYouTubeVideo(
  url: string,
  title: string,
  channel: string,
  duration: number = 0
): YouTubeVideo | null {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return {
    id: videoId,
    title,
    channel,
    duration: formatVideoDuration(duration),
    thumbnail: getYouTubeThumbnail(videoId, 'high'),
    url: buildYouTubeUrl(videoId, 'watch'),
  };
}
