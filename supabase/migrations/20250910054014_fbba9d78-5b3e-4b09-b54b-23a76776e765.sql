-- Create functions to increment vote counts
CREATE OR REPLACE FUNCTION public.increment_poll_option_votes(option_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.poll_options 
  SET votes = votes + 1 
  WHERE id = option_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_poll_total_votes(poll_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.polls 
  SET total_votes = total_votes + 1 
  WHERE id = poll_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;