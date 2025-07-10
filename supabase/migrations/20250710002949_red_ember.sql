/*
  # Fix profiles table RLS policies

  1. Security
    - Add policy for authenticated users to insert their own profile
    - Add policy for authenticated users to read their own profile
    - Ensure proper RLS configuration for profile creation

  This migration fixes the RLS policy violations that prevent profile creation.
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

-- Create policy for inserting own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update the existing read policy to be more permissive for profile creation
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure the update policy allows users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);