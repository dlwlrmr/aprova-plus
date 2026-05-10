# 🚀 Integração Supabase - Aprova+

Guia completo para configurar o Aprova+ com Supabase para autenticação e persistência de dados.

## 📋 Pré-requisitos

- Conta Supabase criada em https://supabase.com
- Projeto Supabase já criado
- Credenciais do Supabase (URL e Anon Key)

## 🔧 Passo 1: Configurar Variáveis de Ambiente

As variáveis de ambiente já foram configuradas no sistema. Elas são:

```
EXPO_PUBLIC_SUPABASE_URL=https://tttazumnjmxbcfwtbzqz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_q3LFPE8YkoxuR2i05_lEfQ_g1deTUAn
```

## 📊 Passo 2: Criar Schema no Supabase

1. Abra o **Supabase Dashboard** → Seu projeto
2. Vá para **SQL Editor** (no menu lateral esquerdo)
3. Clique em **New Query**
4. Cole o conteúdo completo do arquivo `supabase-schema.sql`
5. Clique em **Run** para executar

**O que será criado:**
- `user_profiles` — Perfil do usuário
- `user_progress` — Progresso diário
- `user_tasks` — Tarefas do usuário
- `user_notes` — Anotações do usuário
- `subject_progress` — Progresso por matéria
- `daily_stats` — Estatísticas diárias
- Políticas de Row Level Security (RLS)
- Triggers para atualizar `updatedAt` automaticamente

## 🔐 Passo 3: Habilitar Autenticação

1. Vá para **Authentication** → **Providers**
2. Certifique-se de que **Email** está habilitado
3. Vá para **Authentication** → **Email Templates**
4. Configure o template de confirmação (opcional)

## 🧪 Passo 4: Testar a Integração

### No Expo Go (Mobile)

1. Abra o app no Expo Go
2. Clique em **Cadastro**
3. Preencha:
   - Nome: Seu nome
   - Email: seu@email.com
   - Senha: mínimo 6 caracteres
4. Clique em **Criar conta**
5. Será redirecionado para **Onboarding**
6. Selecione um concurso e complete o onboarding
7. Dados serão salvos no Supabase automaticamente

### Verificar no Supabase

1. Vá para **Table Editor**
2. Clique em `user_profiles`
3. Você deve ver seu usuário criado
4. Clique em `user_progress` para ver o progresso do dia

## 🔄 Sincronização em Tempo Real

O app está configurado com **Supabase Realtime**. Isso significa:

- Quando você atualiza dados em um dispositivo, outros dispositivos recebem a atualização automaticamente
- Progresso, tarefas e anotações são sincronizadas em tempo real
- Funciona mesmo offline — dados são sincronizados quando reconectar

### Testar Sincronização em Tempo Real

1. Abra o app em dois dispositivos/emuladores
2. Faça login com a mesma conta em ambos
3. Complete uma tarefa em um dispositivo
4. O outro dispositivo deve atualizar automaticamente

## 📱 Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────┐
│                    Aprova+ Auth Flow                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. App inicia → Restaura sessão do SecureStore         │
│     ↓                                                    │
│  2. Se não há sessão → Tela de Login/Signup             │
│     ↓                                                    │
│  3. Usuário faz login/signup → Supabase Auth            │
│     ↓                                                    │
│  4. Sessão salva em SecureStore (iOS) ou AsyncStorage   │
│     ↓                                                    │
│  5. Se é novo usuário → Onboarding                      │
│     ↓                                                    │
│  6. Após onboarding → Tela Hoje (Tabs)                  │
│     ↓                                                    │
│  7. Dados sincronizados com Supabase em tempo real      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🛡️ Segurança

### Row Level Security (RLS)

Todas as tabelas têm **RLS habilitado**. Isso significa:

- Cada usuário pode ver apenas seus próprios dados
- Não é possível acessar dados de outro usuário mesmo com a chave anônima
- Todas as queries são filtradas automaticamente pelo `auth.uid()`

### Exemplo de Política RLS

```sql
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);
```

## 🔗 Estrutura de Dados

### user_profiles
```
{
  id: UUID (referencia auth.users.id),
  email: string,
  name: string,
  concurso: string,
  horasPerDay: number,
  trabalha: boolean,
  difficulty: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### user_progress
```
{
  id: UUID,
  userId: UUID,
  date: date,
  horasEstudadas: decimal,
  tarefasConcluidas: number,
  streak: number,
  ultimoAcesso: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### user_tasks
```
{
  id: UUID,
  userId: UUID,
  titulo: string,
  descricao: string,
  materia: string,
  concluida: boolean,
  dataVencimento: date,
  dataConclusao: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### user_notes
```
{
  id: UUID,
  userId: UUID,
  titulo: string,
  conteudo: string,
  area: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🐛 Troubleshooting

### Erro: "Supabase URL and Anon Key are required"

**Solução:** Verifique se as variáveis de ambiente estão configuradas corretamente no arquivo `.env` ou no sistema.

### Erro: "PGRST116" ao criar usuário

**Solução:** Verifique se o schema SQL foi executado corretamente. Execute novamente o arquivo `supabase-schema.sql`.

### Dados não sincronizam entre dispositivos

**Solução:**
1. Verifique se o Realtime está habilitado no Supabase (Settings → Replication)
2. Certifique-se de que ambos os dispositivos estão com a mesma conta
3. Reinicie o app

### Sessão não persiste após fechar o app

**Solução:**
1. Verifique se o SecureStore (iOS) ou AsyncStorage (Android) está funcionando
2. Tente fazer logout e login novamente
3. Verifique os logs do console para erros de armazenamento

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## 🚀 Próximos Passos

1. **Notificações Push** — Implementar notificações diárias para estudar
2. **Backup de Dados** — Adicionar exportação de dados do usuário
3. **Analytics** — Rastrear quais áreas o usuário estuda mais
4. **Gamificação** — Adicionar badges e achievements
5. **Social** — Compartilhar progresso com amigos

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do console do app
2. Abra o Supabase Dashboard e verifique os logs de erro
3. Consulte a documentação do Supabase
4. Crie uma issue no repositório do projeto
