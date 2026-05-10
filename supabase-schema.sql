-- ============================================================================
-- APROVA+ SUPABASE SCHEMA
-- ============================================================================
-- Execute these SQL commands in your Supabase SQL Editor to create all tables

-- ============================================================================
-- 1. USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  concurso TEXT NOT NULL,
  horasPerDay INTEGER NOT NULL DEFAULT 2,
  trabalha BOOLEAN NOT NULL DEFAULT false,
  difficulty TEXT NOT NULL DEFAULT 'procrastination' CHECK (difficulty IN ('procrastination', 'organization', 'consistency', 'focus')),
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- ============================================================================
-- 2. USER PROGRESS TABLE (Daily progress tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  horasEstudadas DECIMAL(5, 2) NOT NULL DEFAULT 0,
  tarefasConcluidas INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  ultimoAcesso TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(userId, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_userId ON public.user_progress(userId);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON public.user_progress(date);

-- ============================================================================
-- 3. USER TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  materia TEXT NOT NULL,
  concluida BOOLEAN NOT NULL DEFAULT false,
  dataVencimento DATE,
  dataConclusao TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_tasks_userId ON public.user_tasks(userId);
CREATE INDEX IF NOT EXISTS idx_user_tasks_concluida ON public.user_tasks(concluida);

-- ============================================================================
-- 4. USER NOTES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  area TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_notes_userId ON public.user_notes(userId);
CREATE INDEX IF NOT EXISTS idx_user_notes_area ON public.user_notes(area);

-- ============================================================================
-- 5. SUBJECT PROGRESS TABLE (Progress by subject/area)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subject_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  materia TEXT NOT NULL,
  progresso DECIMAL(5, 2) NOT NULL DEFAULT 0,
  horasEstudadas DECIMAL(10, 2) NOT NULL DEFAULT 0,
  ultimaRevisao TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(userId, materia)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subject_progress_userId ON public.subject_progress(userId);
CREATE INDEX IF NOT EXISTS idx_subject_progress_materia ON public.subject_progress(materia);

-- ============================================================================
-- 6. DAILY STATS TABLE (Detailed daily statistics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  horasEstudadas DECIMAL(5, 2) NOT NULL DEFAULT 0,
  tarefasConcluidas INTEGER NOT NULL DEFAULT 0,
  questoesResolvidas INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(userId, data)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_stats_userId ON public.daily_stats(userId);
CREATE INDEX IF NOT EXISTS idx_daily_stats_data ON public.daily_stats(data);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- USER PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- USER PROGRESS POLICIES
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = userId);

-- USER TASKS POLICIES
CREATE POLICY "Users can view own tasks"
  ON public.user_tasks FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert own tasks"
  ON public.user_tasks FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own tasks"
  ON public.user_tasks FOR UPDATE
  USING (auth.uid() = userId);

CREATE POLICY "Users can delete own tasks"
  ON public.user_tasks FOR DELETE
  USING (auth.uid() = userId);

-- USER NOTES POLICIES
CREATE POLICY "Users can view own notes"
  ON public.user_notes FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert own notes"
  ON public.user_notes FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own notes"
  ON public.user_notes FOR UPDATE
  USING (auth.uid() = userId);

CREATE POLICY "Users can delete own notes"
  ON public.user_notes FOR DELETE
  USING (auth.uid() = userId);

-- SUBJECT PROGRESS POLICIES
CREATE POLICY "Users can view own subject progress"
  ON public.subject_progress FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert own subject progress"
  ON public.subject_progress FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own subject progress"
  ON public.subject_progress FOR UPDATE
  USING (auth.uid() = userId);

-- DAILY STATS POLICIES
CREATE POLICY "Users can view own daily stats"
  ON public.daily_stats FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert own daily stats"
  ON public.daily_stats FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own daily stats"
  ON public.daily_stats FOR UPDATE
  USING (auth.uid() = userId);

-- ============================================================================
-- FUNCTIONS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updatedAt
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tasks_updated_at
  BEFORE UPDATE ON public.user_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notes_updated_at
  BEFORE UPDATE ON public.user_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subject_progress_updated_at
  BEFORE UPDATE ON public.subject_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at
  BEFORE UPDATE ON public.daily_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Você pode adicionar dados de teste aqui se necessário
-- Exemplo:
-- INSERT INTO public.user_profiles (id, email, name, concurso, horasPerDay, trabalha, difficulty)
-- VALUES ('user-id-here', 'user@example.com', 'João Silva', 'TJSP', 2, true, 'procrastination');
