# 🚀 Aprova+ PWA - Guia Completo

Aprova+ agora é um **Progressive Web App (PWA)** moderno com atualizações automáticas, sincronização offline e funcionamento perfeito em navegador e mobile.

## 📱 O que é PWA?

Um **Progressive Web App** é um aplicativo web que funciona como um app nativo, oferecendo:

- ✅ Instalação na tela inicial (sem App Store)
- ✅ Funcionamento offline
- ✅ Sincronização em background
- ✅ Atualizações automáticas
- ✅ Notificações push
- ✅ Performance otimizada

## 🎯 Recursos Implementados

### 1. **Web App Manifest** (`manifest.json`)
Define metadados do app: nome, ícones, cores, atalhos e muito mais.

```json
{
  "name": "Aprova+ - Seu Companheiro de Estudos",
  "short_name": "Aprova+",
  "display": "standalone",
  "start_url": "/",
  "theme_color": "#7c3aed",
  "background_color": "#ffffff"
}
```

### 2. **Service Worker** (`service-worker.js`)
Gerencia cache inteligente, sincronização offline e atualizações.

**Estratégias de Cache:**
- **Cache First** — Assets estáticos (CSS, JS, imagens)
- **Network First** — APIs e documentos HTML
- **Stale While Revalidate** — Atualizar cache em background

### 3. **Atualizações Automáticas**
O app verifica atualizações a cada 1 minuto e notifica o usuário.

```typescript
// Verificar atualizações
const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();

// Atualizar quando disponível
if (isUpdateAvailable) {
  updateServiceWorker(); // Recarrega com nova versão
}
```

### 4. **Sincronização de Conteúdo Dinâmico**
Questões, vídeoaulas e livros são sincronizados automaticamente.

```typescript
// Carregar questões (usa cache se offline)
const questions = await ContentManager.getQuestions('TJSP');

// Sincronizar em background
await ContentManager.syncContentInBackground('TJSP');
```

### 5. **Funcionamento Offline**
- Conteúdo cacheado funciona sem internet
- Página offline amigável quando recurso não está em cache
- Sincronização automática quando reconectar

## 📲 Como Instalar no Celular

### iOS (Safari)
1. Abra o app no Safari
2. Toque em **Compartilhar** (ícone de seta para cima)
3. Selecione **Adicionar à Tela Inicial**
4. Escolha um nome e toque em **Adicionar**

### Android (Chrome)
1. Abra o app no Chrome
2. Toque no menu (⋮) no canto superior direito
3. Selecione **Instalar app** ou **Adicionar à Tela Inicial**
4. Confirme a instalação

## 🔄 Ciclo de Vida do PWA

```
┌─────────────────────────────────────────────────────────┐
│                   Aprova+ PWA Lifecycle                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Primeira Visita                                     │
│     ↓                                                    │
│  2. Service Worker Instalado                           │
│     ↓                                                    │
│  3. Assets Cacheados (Cache First)                      │
│     ↓                                                    │
│  4. App Funciona Offline                               │
│     ↓                                                    │
│  5. Verifica Atualizações (a cada 1 min)               │
│     ↓                                                    │
│  6. Se Nova Versão → Notifica Usuário                  │
│     ↓                                                    │
│  7. Usuário Clica "Atualizar" → Recarrega              │
│     ↓                                                    │
│  8. Novo Service Worker Ativado                        │
│     ↓                                                    │
│  9. Cache Antigo Limpo                                 │
│     ↓                                                    │
│  10. App Pronto com Nova Versão                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🗂️ Estrutura de Arquivos PWA

```
aprova-plus/
├── public/
│   ├── manifest.json           ← Web App Manifest
│   ├── service-worker.js       ← Service Worker
│   └── offline.html            ← Página offline
├── hooks/
│   └── use-service-worker.ts   ← Hook para gerenciar SW
├── lib/
│   ├── content-manager.ts      ← Gerenciador de conteúdo
│   └── supabase.ts             ← Cliente Supabase
├── components/
│   └── update-notification.tsx ← Notificação de atualização
└── app/
    └── _layout.tsx             ← Root layout com UpdateNotification
```

## 🔧 Configuração do Service Worker

### Estratégia de Cache para Questões

```typescript
// Cache First Strategy
// 1. Tenta obter do cache
// 2. Se não encontrar, busca da rede
// 3. Cacheia o resultado
// 4. Atualiza cache em background

const questions = await ContentManager.getQuestions('TJSP');
// Resultado é cacheado automaticamente
```

### Sincronização em Background

```typescript
// Background Sync API
// Sincroniza dados quando reconectar à internet

if ('sync' in registration) {
  await registration.sync.register('sync-progress');
  await registration.sync.register('sync-tasks');
  await registration.sync.register('sync-notes');
}
```

## 📊 Monitoramento de Cache

### Verificar Tamanho do Cache

```typescript
const { cacheSize, getCacheSize } = useServiceWorker();

// Obter tamanho em MB
const size = await getCacheSize();
console.log(`Cache: ${size.toFixed(2)} MB`);
```

### Limpar Cache Manualmente

```typescript
const { clearCache } = useServiceWorker();

// Limpar todo o cache
await clearCache();

// Ou limpar tipo específico
await ContentManager.clearCache('questions', 'TJSP');
```

## 🌐 Testes no Navegador

### Chrome DevTools

1. Abra **DevTools** (F12)
2. Vá para **Application** → **Service Workers**
3. Verifique se o SW está registrado
4. Clique em **Offline** para simular offline
5. Recarregue a página

### Verificar Cache

1. **Application** → **Cache Storage**
2. Veja os caches criados:
   - `aprova-v1-static` — Assets estáticos
   - `aprova-v1-dynamic` — Documentos HTML
   - `aprova-v1-api` — Respostas de API
   - `aprova-v1-images` — Imagens

## 🚀 Deploy e Atualizações

### Fluxo de Atualização

1. **Novo Deploy** — Versão nova disponível no servidor
2. **Check** — App verifica a cada 1 minuto
3. **Notify** — Notifica usuário sobre atualização
4. **Update** — Usuário clica "Atualizar Agora"
5. **Reload** — Página recarrega com nova versão
6. **Cleanup** — Cache antigo é limpo

### Versionamento

```javascript
// service-worker.js
const CACHE_VERSION = 'aprova-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
```

Para atualizar, altere `CACHE_VERSION` para `'aprova-v2'`.

## 📋 Checklist de Implementação

- [x] Web App Manifest configurado
- [x] Service Worker implementado
- [x] Cache estratégico (Cache First, Network First)
- [x] Atualizações automáticas
- [x] Sincronização de conteúdo dinâmico
- [x] Funcionamento offline
- [x] Página offline amigável
- [x] Notificação de atualização
- [x] Background Sync API
- [x] Gerenciador de conteúdo
- [ ] Notificações push web
- [ ] Compartilhamento de dados
- [ ] Instalação automática em alguns navegadores

## 🔐 Segurança

### HTTPS Obrigatório
- Service Workers **só funcionam em HTTPS** (ou localhost)
- Certifique-se de que o servidor usa SSL/TLS

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'">
```

### Validação de Dados
- Sempre validar dados do cache
- Verificar integridade de conteúdo
- Usar CORS apropriadamente

## 📊 Métricas de Performance

### Lighthouse Score
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 90+

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🐛 Troubleshooting

### Service Worker não registra
```javascript
// Verificar console para erros
navigator.serviceWorker.register('/service-worker.js')
  .catch(error => console.error('Erro:', error));
```

### Cache não atualiza
```javascript
// Forçar atualização
registration.update();

// Ou limpar cache
await caches.delete('aprova-v1-static');
```

### Offline não funciona
1. Verifique se SW está instalado
2. Verifique se página está em cache
3. Verifique HTTPS
4. Limpe cache do navegador

## 📚 Recursos Úteis

- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [MDN - Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN - Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PWA Builder](https://www.pwabuilder.com/)

## 🎉 Próximos Passos

1. **Notificações Push** — Lembrar usuário para estudar
2. **Compartilhamento** — Compartilhar progresso nas redes sociais
3. **Sincronização P2P** — Sincronizar entre dispositivos do usuário
4. **Analytics** — Rastrear uso e performance
5. **A/B Testing** — Testar novas funcionalidades
