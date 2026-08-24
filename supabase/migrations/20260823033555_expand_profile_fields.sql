/*
# Expand profiles table with creator profile fields

1. Schema Changes
- `profiles` table: add columns for the expanded profile screen:
  - `bio` (text, nullable, max 150 chars) — short user bio shown below username
  - `creator_level` (integer, not null, default 1) — creator level, starts at 1 for all users
  - `signature` (text, nullable, max 50 chars) — customizable tagline/quote
  - `streak_days` (integer, not null, default 0) — consecutive days of creation
  - `total_creations` (integer, not null, default 0) — total count of user's creations
  - `featured_creation_id` (uuid, nullable) — placeholder for pinning a creation to profile top

2. Security
- No policy changes needed — existing owner-scoped CRUD policies on `profiles` already cover these new columns.

3. Important Notes
- All new columns are nullable or have safe defaults, so existing profile rows are unaffected.
- `creator_level` defaults to 1 as specified.
- `streak_days` and `total_creations` default to 0 since no creations table exists yet.
- `featured_creation_id` is nullable and has no foreign key since no creations table exists yet.
- When a creations table is added later, `featured_creation_id` can be altered to add a FK, and `total_creations`/`streak_days` can be maintained via triggers.
*/

-- Add bio column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
END $$;

-- Add creator_level column (default 1)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'creator_level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN creator_level integer NOT NULL DEFAULT 1;
  END IF;
END $$;

-- Add signature column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'signature'
  ) THEN
    ALTER TABLE profiles ADD COLUMN signature text;
  END IF;
END $$;

-- Add streak_days column (default 0)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'streak_days'
  ) THEN
    ALTER TABLE profiles ADD COLUMN streak_days integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Add total_creations column (default 0)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_creations'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_creations integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Add featured_creation_id column (nullable, no FK yet)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'featured_creation_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN featured_creation_id uuid;
  END IF;
END $$;

-- Refresh PostgREST schema cache so the API recognizes the new columns
NOTIFY pgrst, 'reload schema';
