-- Enhanced Security Measures for StitchesX
-- Run this in your Supabase SQL Editor

-- 1. Create security events table for monitoring
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- 2. Create failed login attempts tracking
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  attempt_count INTEGER DEFAULT 1,
  first_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on failed login attempts
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- 3. Create suspicious activity detection
CREATE TABLE IF NOT EXISTS public.suspicious_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on suspicious activity
ALTER TABLE public.suspicious_activity ENABLE ROW LEVEL SECURITY;

-- 4. Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_severity TEXT,
  p_description TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_events (
    user_id, event_type, severity, description, 
    ip_address, user_agent, metadata
  ) VALUES (
    p_user_id, p_event_type, p_severity, p_description,
    p_ip_address, p_user_agent, p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to track failed login attempts
CREATE OR REPLACE FUNCTION public.track_failed_login(
  p_email TEXT,
  p_ip_address INET,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  attempt_record RECORD;
  max_attempts INTEGER := 5;
  block_duration INTERVAL := '1 hour';
BEGIN
  -- Check if there's an existing record for this email/IP combination
  SELECT * INTO attempt_record 
  FROM public.failed_login_attempts 
  WHERE email = p_email AND ip_address = p_ip_address;
  
  IF attempt_record IS NULL THEN
    -- First failed attempt
    INSERT INTO public.failed_login_attempts (email, ip_address, user_agent)
    VALUES (p_email, p_ip_address, p_user_agent);
    
    -- Log security event
    PERFORM public.log_security_event(
      NULL, 'failed_login', 'medium', 
      'Failed login attempt for email: ' || p_email,
      p_ip_address, p_user_agent
    );
    
    RETURN FALSE; -- Not blocked yet
  ELSE
    -- Update existing record
    UPDATE public.failed_login_attempts 
    SET 
      attempt_count = attempt_count + 1,
      last_attempt = NOW(),
      is_blocked = (attempt_count + 1 >= max_attempts),
      blocked_until = CASE 
        WHEN attempt_count + 1 >= max_attempts THEN NOW() + block_duration
        ELSE blocked_until
      END
    WHERE email = p_email AND ip_address = p_ip_address;
    
    -- Log security event
    PERFORM public.log_security_event(
      NULL, 'failed_login', 'high', 
      'Multiple failed login attempts for email: ' || p_email || ' (attempt ' || (attempt_record.attempt_count + 1) || ')',
      p_ip_address, p_user_agent
    );
    
    -- Check if should be blocked
    IF attempt_record.attempt_count + 1 >= max_attempts THEN
      RETURN TRUE; -- Blocked
    ELSE
      RETURN FALSE; -- Not blocked yet
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to check if IP is blocked
CREATE OR REPLACE FUNCTION public.is_ip_blocked(p_ip_address INET)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.failed_login_attempts 
    WHERE ip_address = p_ip_address 
      AND is_blocked = TRUE 
      AND blocked_until > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to detect suspicious activity
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_ip_address INET,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  risk_score INTEGER := 0;
  recent_activities INTEGER;
  different_ips INTEGER;
  activity_description TEXT;
BEGIN
  -- Check for multiple rapid activities (potential bot)
  SELECT COUNT(*) INTO recent_activities
  FROM public.security_events 
  WHERE user_id = p_user_id 
    AND created_at > NOW() - INTERVAL '5 minutes';
  
  IF recent_activities > 10 THEN
    risk_score := risk_score + 30;
  END IF;
  
  -- Check for multiple IP addresses (potential account takeover)
  SELECT COUNT(DISTINCT ip_address) INTO different_ips
  FROM public.security_events 
  WHERE user_id = p_user_id 
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF different_ips > 3 THEN
    risk_score := risk_score + 25;
  END IF;
  
  -- Check for unusual user agent patterns
  IF p_user_agent IS NOT NULL AND p_user_agent LIKE '%bot%' THEN
    risk_score := risk_score + 20;
  END IF;
  
  -- Check for suspicious IP ranges (you can customize this)
  IF p_ip_address::text LIKE '192.168.%' OR p_ip_address::text LIKE '10.%' THEN
    risk_score := risk_score + 10; -- Internal IPs might be suspicious for public app
  END IF;
  
  -- Determine activity description
  activity_description := 'Suspicious activity detected: ' || p_activity_type;
  IF risk_score > 50 THEN
    activity_description := activity_description || ' (HIGH RISK)';
  ELSIF risk_score > 25 THEN
    activity_description := activity_description || ' (MEDIUM RISK)';
  ELSE
    activity_description := activity_description || ' (LOW RISK)';
  END IF;
  
  -- Log suspicious activity if risk score is above threshold
  IF risk_score > 25 THEN
    INSERT INTO public.suspicious_activity (
      user_id, activity_type, risk_score, description,
      ip_address, user_agent, metadata
    ) VALUES (
      p_user_id, p_activity_type, risk_score, activity_description,
      p_ip_address, p_user_agent, p_metadata
    );
    
    -- Log security event
    PERFORM public.log_security_event(
      p_user_id, 'suspicious_activity', 
      CASE 
        WHEN risk_score > 75 THEN 'critical'
        WHEN risk_score > 50 THEN 'high'
        ELSE 'medium'
      END,
      activity_description,
      p_ip_address, p_user_agent, p_metadata
    );
  END IF;
  
  RETURN risk_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to clean up old security data
CREATE OR REPLACE FUNCTION public.cleanup_security_data()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Clean up old failed login attempts (older than 30 days)
  DELETE FROM public.failed_login_attempts 
  WHERE last_attempt < NOW() - INTERVAL '30 days';
  
  -- Clean up old security events (older than 1 year)
  DELETE FROM public.security_events 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Clean up resolved suspicious activities (older than 6 months)
  DELETE FROM public.suspicious_activity 
  WHERE is_resolved = TRUE AND created_at < NOW() - INTERVAL '6 months';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create security dashboard view
CREATE OR REPLACE VIEW public.security_dashboard AS
SELECT 
  'Failed Login Attempts (24h)' as metric,
  COUNT(*) as count
FROM public.failed_login_attempts 
WHERE last_attempt > NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
  'Blocked IPs' as metric,
  COUNT(*) as count
FROM public.failed_login_attempts 
WHERE is_blocked = TRUE AND blocked_until > NOW()
UNION ALL
SELECT 
  'Suspicious Activities (24h)' as metric,
  COUNT(*) as count
FROM public.suspicious_activity 
WHERE created_at > NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
  'High Risk Activities (24h)' as metric,
  COUNT(*) as count
FROM public.suspicious_activity 
WHERE risk_score > 75 AND created_at > NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
  'Security Events (24h)' as metric,
  COUNT(*) as count
FROM public.security_events 
WHERE created_at > NOW() - INTERVAL '24 hours';

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_failed_login_email ON public.failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_ip ON public.failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_failed_login_blocked ON public.failed_login_attempts(is_blocked);
CREATE INDEX IF NOT EXISTS idx_suspicious_activity_user_id ON public.suspicious_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_suspicious_activity_risk_score ON public.suspicious_activity(risk_score);

-- 11. Grant necessary permissions
GRANT SELECT, INSERT ON public.security_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.failed_login_attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.suspicious_activity TO authenticated;
GRANT SELECT ON public.security_dashboard TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_security_event(UUID, TEXT, TEXT, TEXT, INET, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.track_failed_login(TEXT, INET, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_ip_blocked(INET) TO authenticated;
GRANT EXECUTE ON FUNCTION public.detect_suspicious_activity(UUID, TEXT, INET, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_security_data() TO authenticated;

-- 12. Create function to get user security summary
CREATE OR REPLACE FUNCTION public.get_user_security_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'user_id', p_user_id,
    'recent_failed_logins', (
      SELECT COUNT(*) 
      FROM public.failed_login_attempts 
      WHERE email = (SELECT email FROM auth.users WHERE id = p_user_id)
        AND last_attempt > NOW() - INTERVAL '24 hours'
    ),
    'suspicious_activities', (
      SELECT COUNT(*) 
      FROM public.suspicious_activity 
      WHERE user_id = p_user_id 
        AND created_at > NOW() - INTERVAL '7 days'
    ),
    'high_risk_activities', (
      SELECT COUNT(*) 
      FROM public.suspicious_activity 
      WHERE user_id = p_user_id 
        AND risk_score > 75 
        AND created_at > NOW() - INTERVAL '7 days'
    ),
    'last_security_event', (
      SELECT jsonb_build_object(
        'event_type', event_type,
        'severity', severity,
        'description', description,
        'created_at', created_at
      )
      FROM public.security_events 
      WHERE user_id = p_user_id 
      ORDER BY created_at DESC 
      LIMIT 1
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission for security summary
GRANT EXECUTE ON FUNCTION public.get_user_security_summary(UUID) TO authenticated;

