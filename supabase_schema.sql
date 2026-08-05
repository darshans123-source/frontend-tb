-- Supabase Schema Migration & RLS Security Policies for TB Quest

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  usn TEXT,
  college TEXT,
  department TEXT,
  semester TEXT,
  phone TEXT,
  gender TEXT,
  dob TEXT,
  address TEXT,
  district TEXT,
  state TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  accuracy NUMERIC DEFAULT 0,
  streak INTEGER DEFAULT 0,
  completed_cases INTEGER DEFAULT 0,
  completed_modules INTEGER DEFAULT 0,
  completed_quizzes INTEGER DEFAULT 0,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles for leaderboard" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Allow users to insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. User Module Progress Table
CREATE TABLE IF NOT EXISTS public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own module progress" 
  ON public.user_module_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own module progress" 
  ON public.user_module_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own module progress" 
  ON public.user_module_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- 3. Quiz Results Table
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  xp_gained INTEGER NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own quiz results" 
  ON public.quiz_results FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results" 
  ON public.quiz_results FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 4. User Achievements / Badges Table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own achievements" 
  ON public.user_achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
  ON public.user_achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 5. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  total_xp INTEGER NOT NULL,
  cases_mastered INTEGER NOT NULL,
  accuracy NUMERIC NOT NULL,
  issue_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own certificates" 
  ON public.certificates FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates" 
  ON public.certificates FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 6. User Bookmarks Table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, case_id)
);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own bookmarks" 
  ON public.user_bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" 
  ON public.user_bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.user_bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- 7. CMS Articles Table
CREATE TABLE IF NOT EXISTS public.cms_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT DEFAULT '3 min',
  summary TEXT,
  content TEXT[],
  key_highlights TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cms_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to CMS articles"
  ON public.cms_articles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated insert access to CMS articles"
  ON public.cms_articles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 8. CMS Announcements Table
CREATE TABLE IF NOT EXISTS public.cms_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'ANNOUNCEMENT',
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cms_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to announcements"
  ON public.cms_announcements FOR SELECT
  USING (true);

CREATE POLICY "Authenticated insert access to announcements"
  ON public.cms_announcements FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

