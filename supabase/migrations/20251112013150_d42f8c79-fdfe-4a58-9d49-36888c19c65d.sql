-- Create a global group chat table
CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- Policies: anyone authenticated can read; only owners can insert
CREATE POLICY "Users can view group messages"
  ON public.group_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Users can post group messages"
  ON public.group_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;