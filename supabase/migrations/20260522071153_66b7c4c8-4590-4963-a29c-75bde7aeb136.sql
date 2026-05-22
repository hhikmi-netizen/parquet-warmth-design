CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Unschedule previous version if exists
DO $$
BEGIN
  PERFORM cron.unschedule('guide-sequence-hourly');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'guide-sequence-hourly',
  '5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--d0e613ac-ac77-4533-8a49-5e2903b49c44.lovable.app/api/public/guide-sequence',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-key', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'GUIDE_CRON_SECRET' LIMIT 1)
    ),
    body := '{}'::jsonb
  );
  $$
);