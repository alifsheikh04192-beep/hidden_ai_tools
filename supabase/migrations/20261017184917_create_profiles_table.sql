/*
# Create profiles table for lifetime access tracking

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users on delete cascade)
  - `email` (text, the user's email from OAuth)
  - `has_lifetime_access` (boolean, default false — privileged column, NOT user-editable directly)
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `profiles`.
- SELECT policy: authenticated users can read only their own profile row.
- UPDATE policy: authenticated users can update their own profile row EXCEPT the
  privileged `has_lifetime_access` column (enforced via column-level privilege: REVOKE
  UPDATE on has_lifetime_access from authenticated).
- A SECURITY DEFINER function `grant_lifetime_access()` is the ONLY way to flip
  has_lifetime_access to true. In production this would be called by a payment
  webhook after verifying a Whop/Lemon Squeezy payment; in this demo it is called
  from the client right after the (mocked) checkout step, and also reachable via
  the Dev Mode unlock passcode HIDDEN2026. Execute is granted to `authenticated`.
3. Trigger
- `handle_new_user` trigger on auth.users inserts a matching profiles row on signup
  so every signed-in user has a profile to read.
4. Notes
- has_lifetime_access is the single source of truth for removing the blur paywall.
- The frontend mirrors it into localStorage so the unlocked state persists across
  reloads even before the Supabase session is re-hydrated.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  has_lifetime_access boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Revoke direct writes to the privileged column so users cannot self-grant access
-- by updating has_lifetime_access through the Data API.
REVOKE UPDATE (has_lifetime_access) ON profiles FROM authenticated;

-- SECURITY DEFINER function: the privileged path that flips has_lifetime_access.
-- Only callable by authenticated users, for their own row.
CREATE OR REPLACE FUNCTION grant_lifetime_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles SET has_lifetime_access = true WHERE id = auth.uid();
  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION grant_lifetime_access() TO authenticated;

-- Auto-create a profile row when a new auth.users row is inserted.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
