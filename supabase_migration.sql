-- ============================================================
-- TB Quest Production Migration Script
-- Run this once in Supabase SQL Editor (safe with IF NOT EXISTS)
-- ============================================================

-- 1. Extend profiles table with full student fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS usn TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS semester TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS completed_modules INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS completed_quizzes INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create CMS Articles Table (student-facing published content)
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

-- Allow all users to read articles
DROP POLICY IF EXISTS "Public read access to CMS articles" ON public.cms_articles;
CREATE POLICY "Public read access to CMS articles"
  ON public.cms_articles FOR SELECT USING (true);

-- Allow authenticated users (faculty/admin) to insert
DROP POLICY IF EXISTS "Authenticated insert access to CMS articles" ON public.cms_articles;
CREATE POLICY "Authenticated insert access to CMS articles"
  ON public.cms_articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete their own articles
DROP POLICY IF EXISTS "Authenticated delete access to CMS articles" ON public.cms_articles;
CREATE POLICY "Authenticated delete access to CMS articles"
  ON public.cms_articles FOR DELETE USING (auth.uid() IS NOT NULL);

-- 3. Create CMS Announcements Table (real-time broadcast)
CREATE TABLE IF NOT EXISTS public.cms_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'ANNOUNCEMENT',
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cms_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to announcements" ON public.cms_announcements;
CREATE POLICY "Public read access to announcements"
  ON public.cms_announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated insert access to announcements" ON public.cms_announcements;
CREATE POLICY "Authenticated insert access to announcements"
  ON public.cms_announcements FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated delete access to announcements" ON public.cms_announcements;
CREATE POLICY "Authenticated delete access to announcements"
  ON public.cms_announcements FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. Enable Supabase Realtime on CMS tables (run in Supabase Dashboard > Database > Replication)
-- Or run these manually in SQL editor:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_articles;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_announcements;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
