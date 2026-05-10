/**
 * Aprova+ Service Worker
 * Implementa cache estratégico, sincronização offline e atualizações automáticas
 */

const CACHE_VERSION = 'aprova-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Assets estáticos que devem ser cacheados na instalação
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/global.css',
  '/assets/images/icon.png',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/manifest.json',
];

/**
 * Evento: Instalação do Service Worker
 * Cache de assets estáticos
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Cacheando assets estáticos');
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.warn('[SW] Erro ao cachear alguns assets:', error);
        // Continuar mesmo se alguns assets falharem
      });
    })
  );
  
  // Forçar o novo SW a tomar controle imediatamente
  self.skipWaiting();
});

/**
 * Evento: Ativação do Service Worker
 * Limpeza de caches antigos
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Deletar caches antigos
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== API_CACHE &&
            cacheName !== IMAGE_CACHE
          ) {
            console.log('[SW] Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Tomar controle de todas as abas
  self.clients.claim();
});

/**
 * Evento: Requisição de rede
 * Estratégia: Cache First para assets, Network First para APIs
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorar requisições para chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Estratégia para APIs (Network First)
  if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Estratégia para imagens (Cache First)
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Estratégia para outros assets (Cache First)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Estratégia padrão para documentos (Network First)
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

/**
 * Estratégia: Cache First
 * Tenta cache primeiro, depois rede
 */
async function cacheFirstStrategy(request, cacheName) {
  try {
    // Verificar cache
    const cached = await caches.match(request);
    if (cached) {
      // Atualizar cache em background
      updateCacheInBackground(request, cacheName);
      return cached;
    }

    // Se não está em cache, buscar da rede
    const response = await fetch(request);
    
    // Cachear resposta bem-sucedida
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error('[SW] Erro em cacheFirstStrategy:', error);
    
    // Retornar página offline se disponível
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Retornar página offline genérica
    return caches.match('/offline.html').catch(() => {
      return new Response('Offline - Página não disponível', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain',
        }),
      });
    });
  }
}

/**
 * Estratégia: Network First
 * Tenta rede primeiro, depois cache
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    // Tentar rede primeiro
    const response = await fetch(request);
    
    // Cachear resposta bem-sucedida
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error('[SW] Erro em networkFirstStrategy:', error);
    
    // Fallback para cache
    const cached = await caches.match(request);
    if (cached) return cached;

    // Se for uma API, retornar erro apropriado
    if (request.destination === '' || request.destination === 'fetch') {
      return new Response(
        JSON.stringify({
          error: 'Offline',
          message: 'Sem conexão com a internet',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }
      );
    }

    // Retornar página offline
    return caches.match('/offline.html').catch(() => {
      return new Response('Offline - Página não disponível', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain',
        }),
      });
    });
  }
}

/**
 * Atualizar cache em background
 */
async function updateCacheInBackground(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
  } catch (error) {
    // Silenciosamente falhar
  }
}

/**
 * Evento: Mensagem do cliente
 * Comunicação entre app e Service Worker
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      console.log('[SW] Pulando espera e ativando novo SW');
      self.skipWaiting();
      break;

    case 'CLEAR_CACHE':
      console.log('[SW] Limpando cache...');
      clearAllCaches();
      break;

    case 'CACHE_URLS':
      console.log('[SW] Cacheando URLs:', payload);
      cacheUrls(payload);
      break;

    case 'GET_CACHE_SIZE':
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
      });
      break;

    default:
      console.log('[SW] Mensagem desconhecida:', type);
  }
});

/**
 * Limpar todos os caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  console.log('[SW] Todos os caches foram limpos');
}

/**
 * Cachear múltiplas URLs
 */
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await Promise.all(
      urls.map((url) =>
        fetch(url)
          .then((response) => {
            if (response.ok) {
              cache.put(url, response.clone());
            }
          })
          .catch((error) => {
            console.warn(`[SW] Erro ao cachear ${url}:`, error);
          })
      )
    );
    console.log('[SW] URLs cacheadas com sucesso');
  } catch (error) {
    console.error('[SW] Erro ao cachear URLs:', error);
  }
}

/**
 * Obter tamanho total do cache
 */
async function getCacheSize() {
  if (!navigator.storage || !navigator.storage.estimate) {
    return 0;
  }

  const estimate = await navigator.storage.estimate();
  return estimate.usage || 0;
}

/**
 * Sincronização em background (Background Sync API)
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync:', event.tag);

  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }

  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }

  if (event.tag === 'sync-notes') {
    event.waitUntil(syncNotes());
  }
});

/**
 * Sincronizar progresso do usuário
 */
async function syncProgress() {
  try {
    console.log('[SW] Sincronizando progresso...');
    const response = await fetch('/api/sync/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error('[SW] Erro ao sincronizar progresso:', error);
    throw error;
  }
}

/**
 * Sincronizar tarefas do usuário
 */
async function syncTasks() {
  try {
    console.log('[SW] Sincronizando tarefas...');
    const response = await fetch('/api/sync/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error('[SW] Erro ao sincronizar tarefas:', error);
    throw error;
  }
}

/**
 * Sincronizar anotações do usuário
 */
async function syncNotes() {
  try {
    console.log('[SW] Sincronizando anotações...');
    const response = await fetch('/api/sync/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error('[SW] Erro ao sincronizar anotações:', error);
    throw error;
  }
}

console.log('[SW] Service Worker carregado e pronto');
