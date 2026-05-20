-- 1. Fix search_path on generate_project_ref
CREATE OR REPLACE FUNCTION public.generate_project_ref()
RETURNS text
LANGUAGE sql
SET search_path = public
AS $$
  SELECT 'PRJ-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
$$;

-- 2. Tighten public project insert policy
DROP POLICY IF EXISTS "Anyone can submit a project" ON public.projects;

CREATE POLICY "Anyone can submit a qualified project"
ON public.projects FOR INSERT
WITH CHECK (
  status = 'qualified'
  AND matched_artisan_id IS NULL
  AND credits_cost = 1
  AND length(client_name) BETWEEN 2 AND 120
  AND client_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(ville) BETWEEN 2 AND 80
  AND code_postal ~ '^\d{5}$'
);

-- 3. Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.accept_project_match(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.accept_project_match(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.refund_project_match(uuid, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.refund_project_match(uuid, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_artisan() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_initial_bonus() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM public, anon, authenticated;