-- Show sign-in times in Denver time.
--
-- signed_in_at was a timestamp without a time zone, written as UTC, so evening
-- jams appeared to spill into the next day. This marks the existing values as
-- UTC (the same moments, now zone-aware) and makes Mountain time the database
-- default, so the Neon console and queries show Denver dates and times,
-- daylight saving included.
--
-- Run once in the Neon SQL Editor. Safe to re-run.

DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name = 'signins' AND column_name = 'signed_in_at') = 'timestamp without time zone' THEN
    ALTER TABLE signins
      ALTER COLUMN signed_in_at TYPE timestamptz USING signed_in_at AT TIME ZONE 'UTC';
  END IF;
END $$;

ALTER DATABASE neondb SET timezone TO 'America/Denver';

-- Takes effect for new connections. In the SQL Editor, check with:
--   SELECT id, first_name, signed_in_at FROM signins ORDER BY id DESC LIMIT 5;
-- Last jam's sign-ins should read 2026-10-05 ~17:30-18:40 -06.
