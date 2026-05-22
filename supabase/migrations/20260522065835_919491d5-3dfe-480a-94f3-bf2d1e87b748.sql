
-- Segmentation + suivi séquence sur les leads guide
ALTER TABLE public.guide_downloads
  ADD COLUMN IF NOT EXISTS segment text CHECK (segment IN ('particulier','pro','artisan')),
  ADD COLUMN IF NOT EXISTS j2_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS j7_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;

CREATE INDEX IF NOT EXISTS guide_downloads_j2_pending_idx
  ON public.guide_downloads (created_at)
  WHERE j2_sent_at IS NULL AND unsubscribed_at IS NULL AND opt_in = true;

CREATE INDEX IF NOT EXISTS guide_downloads_j7_pending_idx
  ON public.guide_downloads (created_at)
  WHERE j7_sent_at IS NULL AND unsubscribed_at IS NULL AND opt_in = true;

-- Table d'événements de tracking (anonyme)
CREATE TABLE IF NOT EXISTS public.tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL CHECK (char_length(event) <= 80),
  segment text CHECK (segment IN ('particulier','pro','artisan')),
  path text CHECK (char_length(path) <= 500),
  referrer text CHECK (char_length(referrer) <= 500),
  session_id text CHECK (char_length(session_id) <= 80),
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tracking_events_event_idx ON public.tracking_events (event, created_at DESC);
CREATE INDEX IF NOT EXISTS tracking_events_created_idx ON public.tracking_events (created_at DESC);

ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;

-- Insertion ouverte (tracking côté client) — validation côté serveur via createServerFn
CREATE POLICY "Anyone can insert tracking events"
  ON public.tracking_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Lecture réservée aux admins
CREATE POLICY "Admins can read tracking events"
  ON public.tracking_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
