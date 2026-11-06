-- TB Quest — Level 1 Snake & Ladders progress (Supabase migration)
--
-- OWNER STEP: run this file ONCE in the Supabase SQL Editor
-- (Dashboard > SQL Editor) for project ulhpwvoehhuecddbjohs.
-- It is NOT run by the app and NOT run by any agent.
--
-- What it stores (one row per student):
--   player position (current_square), score, XP, accuracy,
--   correct / wrong answers, questions answered, completion status,
--   which questions were completed / missed, and last played date.
--
-- Until this migration is run, the game keeps working from localStorage
-- on the device and the Supabase save simply reports "local only".
-- NOTE: the user_id references auth.users, so it covers email/Google
-- students. PIN students (Name + Phone + 4-digit key, stored in
-- public.student_accounts with no auth.users row) cannot write here
-- yet; their progress stays in localStorage until a PIN-account link
-- is added. That is a known, intentional limit — do not weaken the
-- foreign key to work around it.

CREATE TABLE IF NOT EXISTS public.snake_ladder_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_square INTEGER NOT NULL DEFAULT 1 CHECK (current_square BETWEEN 1 AND 100),
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  accuracy NUMERIC NOT NULL DEFAULT 0 CHECK (accuracy BETWEEN 0 AND 100),
  correct_answers INTEGER NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  wrong_answers INTEGER NOT NULL DEFAULT 0 CHECK (wrong_answers >= 0),
  questions_answered INTEGER NOT NULL DEFAULT 0 CHECK (questions_answered >= 0),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_question_ids TEXT[] NOT NULL DEFAULT '{}',
  missed_question_ids TEXT[] NOT NULL DEFAULT '{}',
  last_played_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS snake_ladder_progress_user_idx
  ON public.snake_ladder_progress (user_id);

ALTER TABLE public.snake_ladder_progress ENABLE ROW LEVEL SECURITY;

-- A student can only read / write their OWN progress row.
DROP POLICY IF EXISTS "Users can select their own snake progress" ON public.snake_ladder_progress;
CREATE POLICY "Users can select their own snake progress"
  ON public.snake_ladder_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own snake progress" ON public.snake_ladder_progress;
CREATE POLICY "Users can insert their own snake progress"
  ON public.snake_ladder_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own snake progress" ON public.snake_ladder_progress;
CREATE POLICY "Users can update their own snake progress"
  ON public.snake_ladder_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own snake progress" ON public.snake_ladder_progress;
CREATE POLICY "Users can delete their own snake progress"
  ON public.snake_ladder_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Verify after running:
--   SELECT * FROM public.snake_ladder_progress LIMIT 1;
-- The app upserts one row per student (onConflict user_id) after every
-- answered question and on completion; before this migration runs, those
-- calls fail safely and the game uses localStorage instead.
