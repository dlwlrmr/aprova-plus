import { useEffect, useState, useCallback } from 'react';

export interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  isOnline: boolean;
  cacheSize: number;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
    isRegistered: false,
    isUpdateAvailable: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    cacheSize: 0,
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Registrar Service Worker
  useEffect(() => {
    if (!state.isSupported) {
      console.warn('Service Worker não suportado neste navegador');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });

        console.log('[App] Service Worker registrado:', reg);
        setRegistration(reg);
        setState((prev) => ({ ...prev, isRegistered: true }));

        // Verificar atualizações periodicamente
        setInterval(() => {
          reg.update();
        }, 60000); // A cada 1 minuto

        // Listener para atualização disponível
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nova versão disponível
              console.log('[App] Atualização disponível');
              setState((prev) => ({ ...prev, isUpdateAvailable: true }));

              // Notificar usuário
              notifyUpdateAvailable();
            }
          });
        });
      } catch (error) {
        console.error('[App] Erro ao registrar Service Worker:', error);
      }
    };

    registerServiceWorker();
  }, [state.isSupported]);

  // Monitorar status online/offline
  useEffect(() => {
    const handleOnline = () => {
      console.log('[App] Online');
      setState((prev) => ({ ...prev, isOnline: true }));
      syncPendingData();
    };

    const handleOffline = () => {
      console.log('[App] Offline');
      setState((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Obter tamanho do cache
  const getCacheSize = useCallback(async () => {
    if (!navigator.storage || !navigator.storage.estimate) {
      return 0;
    }

    try {
      const estimate = await navigator.storage.estimate();
      const sizeInMB = (estimate.usage || 0) / (1024 * 1024);
      setState((prev) => ({ ...prev, cacheSize: sizeInMB }));
      return sizeInMB;
    } catch (error) {
      console.error('[App] Erro ao obter tamanho do cache:', error);
      return 0;
    }
  }, []);

  // Atualizar para nova versão
  const updateServiceWorker = useCallback(async () => {
    if (!registration || !registration.waiting) {
      console.warn('[App] Nenhuma atualização disponível');
      return;
    }

    // Enviar mensagem para o novo SW
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Recarregar página quando o novo SW tomar controle
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, [registration]);

  // Limpar cache
  const clearCache = useCallback(async () => {
    if (!registration) {
      console.warn('[App] Service Worker não registrado');
      return;
    }

    // Enviar mensagem para limpar cache
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }

    console.log('[App] Cache limpo');
    setState((prev) => ({ ...prev, cacheSize: 0 }));
  }, [registration]);

  // Cachear URLs específicas
  const cacheUrls = useCallback(async (urls: string[]) => {
    if (!registration) {
      console.warn('[App] Service Worker não registrado');
      return;
    }

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_URLS',
        payload: urls,
      });
    }

    console.log('[App] URLs cacheadas:', urls);
  }, [registration]);

  // Sincronizar dados pendentes
  const syncPendingData = useCallback(async () => {
    if (!registration) {
      console.warn('[App] Service Worker não registrado');
      return;
    }

    try {
      // Usar Background Sync API se disponível
      if ('sync' in registration) {
        const syncManager = (registration as any).sync;
        await syncManager.register('sync-progress');
        await syncManager.register('sync-tasks');
        await syncManager.register('sync-notes');
        console.log('[App] Sincronização em background agendada');
      }
    } catch (error) {
      console.error('[App] Erro ao agendar sincronização:', error);
    }
  }, [registration]);

  // Obter tamanho do cache ao montar
  useEffect(() => {
    getCacheSize();
  }, [getCacheSize]);

  return {
    ...state,
    registration,
    updateServiceWorker,
    clearCache,
    cacheUrls,
    syncPendingData,
    getCacheSize,
  };
}

/**
 * Notificar usuário sobre atualização disponível
 */
function notifyUpdateAvailable() {
  // Mostrar notificação no navegador
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Aprova+ Atualizado', {
      body: 'Uma nova versão está disponível. Recarregue a página para atualizar.',
      icon: '/assets/images/icon-192.png',
      badge: '/assets/images/icon-192.png',
      tag: 'aprova-update',
      requireInteraction: true,
    });
  }
}
