-- Drop the restrictive reports policy and restore public visibility
DROP POLICY IF EXISTS "Users can view only their own reports" ON public.reports;

-- Create new policy allowing all authenticated users to view all reports
CREATE POLICY "Users can view all reports" 
ON public.reports 
FOR SELECT 
USING (true);

-- Ensure comments are also publicly viewable by all authenticated users
DROP POLICY IF EXISTS "Users can view all comments" ON public.comments;

CREATE POLICY "Users can view all comments" 
ON public.comments 
FOR SELECT 
USING (true);