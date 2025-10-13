-- Create function to check if user exists by email
CREATE OR REPLACE FUNCTION public.check_user_exists(email_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE email = email_input);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_user_exists(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_exists(TEXT) TO anon;
