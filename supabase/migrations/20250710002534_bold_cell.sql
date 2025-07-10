/*
  # Add automatic profile creation trigger

  1. New Function
    - `handle_new_user()` - Creates a profile automatically when a user signs up

  2. New Trigger
    - Triggers on INSERT to auth.users table
    - Automatically creates a profile with user data from auth metadata

  3. Security
    - Function runs with security definer privileges
    - Ensures profile is created even if RLS policies would normally block it
*/

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, sector)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'Usuário'),
    'worker',
    'general'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();