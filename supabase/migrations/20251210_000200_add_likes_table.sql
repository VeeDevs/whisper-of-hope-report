CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (report_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_report_id ON public.likes(report_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);
