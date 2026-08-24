/*
# Add updated_at auto-trigger for profiles

- Creates a trigger that automatically sets `updated_at = now()` whenever a profile row is updated.
- This ensures the `updated_at` column always reflects the last modification time,
  which is used for cache-busting avatar URLs after upload.
*/

DROP TRIGGER IF EXISTS profiles_set_updated_at ON profiles;
DROP FUNCTION IF EXISTS set_updated_at();

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
