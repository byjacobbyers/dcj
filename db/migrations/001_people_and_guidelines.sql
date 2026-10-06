-- Jam sign-in: one row per person, plus payment amount and the guidelines
-- version each sign-in agreed to.
--
-- Run once in the Neon SQL Editor, before deploying the code that uses it.
-- Safe to re-run: every step checks whether it has already been applied.

BEGIN;

-- People, matched by email (stored trimmed and lower-cased).
CREATE TABLE IF NOT EXISTS people (
  id          serial PRIMARY KEY,
  email       text NOT NULL UNIQUE,
  first_name  text NOT NULL,
  last_name   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE signins ADD COLUMN IF NOT EXISTS person_id integer REFERENCES people (id);
-- Dollars; NULL for work trade and for sign-ins from before amounts existed.
ALTER TABLE signins ADD COLUMN IF NOT EXISTS amount integer;
-- The guidelines version date (from Sanity Site settings) agreed to at this sign-in.
ALTER TABLE signins ADD COLUMN IF NOT EXISTS guidelines_version date;

CREATE INDEX IF NOT EXISTS signins_person_id_idx ON signins (person_id);

-- Payment methods are now cash, card (Card / Venmo) and work_trade. Older rows
-- keep 'none'. Make the column plain text and replace any earlier check.
ALTER TABLE signins ALTER COLUMN payment_method TYPE text USING payment_method::text;

DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'signins'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%payment_method%'
  LOOP
    EXECUTE format('ALTER TABLE signins DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE signins ADD CONSTRAINT signins_payment_method_check
  CHECK (payment_method IN ('cash', 'card', 'work_trade', 'none'));

ALTER TABLE signins DROP CONSTRAINT IF EXISTS signins_amount_check;
ALTER TABLE signins ADD CONSTRAINT signins_amount_check
  CHECK (amount IS NULL OR amount IN (10, 15, 20));

-- Backfill: one person per distinct email, named from their latest sign-in.
INSERT INTO people (email, first_name, last_name, created_at)
SELECT DISTINCT ON (lower(trim(email)))
  lower(trim(email)),
  trim(first_name),
  trim(last_name),
  (SELECT min(s2.signed_in_at) FROM signins s2 WHERE lower(trim(s2.email)) = lower(trim(s.email)))
FROM signins s
WHERE trim(email) <> ''
ORDER BY lower(trim(email)), signed_in_at DESC
ON CONFLICT (email) DO NOTHING;

UPDATE signins s
SET person_id = p.id
FROM people p
WHERE s.person_id IS NULL
  AND lower(trim(s.email)) = p.email;

COMMIT;

-- Check afterwards (both should look right before deploying):
--   SELECT count(*) AS people FROM people;
--   SELECT count(*) AS unlinked_signins FROM signins WHERE person_id IS NULL;
