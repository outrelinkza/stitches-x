-- Welcome Email Trigger for StitchesX
-- Run this in your Supabase SQL Editor

-- Create function to send welcome email when user is created
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Send welcome email to new user
  PERFORM public.send_welcome_email(
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to send welcome email when user signs up
DROP TRIGGER IF EXISTS send_welcome_email_trigger ON auth.users;
CREATE TRIGGER send_welcome_email_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email_on_signup();
