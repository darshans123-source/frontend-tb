-- ========================================================
-- TB QUEST SUPABASE DATABASE SCHEMA MIGRATION
-- Production Ready Schema for Profiles, Quizzes, Answers, XP & Levels
-- ========================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'student',
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_quizzes INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  unanswered INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  current_question INTEGER DEFAULT 1,
  current_quiz_id UUID,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add columns if profiles already exists in current database
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_quizzes') THEN
        ALTER TABLE public.profiles ADD COLUMN total_quizzes INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'correct_answers') THEN
        ALTER TABLE public.profiles ADD COLUMN correct_answers INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'wrong_answers') THEN
        ALTER TABLE public.profiles ADD COLUMN wrong_answers INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'unanswered') THEN
        ALTER TABLE public.profiles ADD COLUMN unanswered INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'progress_percentage') THEN
        ALTER TABLE public.profiles ADD COLUMN progress_percentage INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'current_question') THEN
        ALTER TABLE public.profiles ADD COLUMN current_question INTEGER DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'current_quiz_id') THEN
        ALTER TABLE public.profiles ADD COLUMN current_quiz_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_activity') THEN
        ALTER TABLE public.profiles ADD COLUMN last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 2. QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id UUID,
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  unanswered INTEGER DEFAULT 50,
  xp_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 3. QUIZ ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  selected_option TEXT,
  correct BOOLEAN DEFAULT FALSE,
  answered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_attempt_question UNIQUE (attempt_id, question_number)
);

-- 4. XP HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.xp_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT,
  xp INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. LEVELS TABLE
CREATE TABLE IF NOT EXISTS public.levels (
  level INTEGER PRIMARY KEY,
  min_xp INTEGER NOT NULL,
  max_xp INTEGER NOT NULL
);

-- Seed Level Data (Levels 1 to 5)
INSERT INTO public.levels (level, min_xp, max_xp) VALUES
  (1, 0, 99),
  (2, 100, 199),
  (3, 200, 299),
  (4, 300, 399),
  (5, 400, 500)
ON CONFLICT (level) DO UPDATE SET
  min_xp = EXCLUDED.min_xp,
  max_xp = EXCLUDED.max_xp;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

-- Levels Policy (Read for all users)
DROP POLICY IF EXISTS "Public levels read access" ON public.levels;
CREATE POLICY "Public levels read access" ON public.levels FOR SELECT USING (true);

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile or faculty/admin view" ON public.profiles;
CREATE POLICY "Users can view own profile or faculty/admin view" ON public.profiles 
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('faculty', 'admin'));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Quiz Attempts Policies
DROP POLICY IF EXISTS "Users can view own attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts 
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('faculty', 'admin'));

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.quiz_attempts;
CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own attempts" ON public.quiz_attempts;
CREATE POLICY "Users can update own attempts" ON public.quiz_attempts 
  FOR UPDATE USING (auth.uid() = user_id);

-- Quiz Answers Policies
DROP POLICY IF EXISTS "Users can view own answers" ON public.quiz_answers;
CREATE POLICY "Users can view own answers" ON public.quiz_answers 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.quiz_attempts WHERE id = attempt_id AND (user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('faculty', 'admin')))
  );

DROP POLICY IF EXISTS "Users can insert own answers" ON public.quiz_answers;
CREATE POLICY "Users can insert own answers" ON public.quiz_answers 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.quiz_attempts WHERE id = attempt_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own answers" ON public.quiz_answers;
CREATE POLICY "Users can update own answers" ON public.quiz_answers 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.quiz_attempts WHERE id = attempt_id AND user_id = auth.uid())
  );

-- XP History Policies
DROP POLICY IF EXISTS "Users can view own xp history" ON public.xp_history;
CREATE POLICY "Users can view own xp history" ON public.xp_history 
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('faculty', 'admin'));

DROP POLICY IF EXISTS "Users can insert own xp history" ON public.xp_history;
CREATE POLICY "Users can insert own xp history" ON public.xp_history 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable Realtime Replication for Profiles & Quiz Attempts
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_attempts;
