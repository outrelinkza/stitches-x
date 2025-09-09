-- Complete Security Fixes for StitchesX
-- Run this in your Supabase SQL Editor

-- 1. Drop all problematic views completely
DROP VIEW IF EXISTS public.gdpr_compliance_dashboard CASCADE;
DROP VIEW IF EXISTS public.security_dashboard CASCADE;

-- 2. Recreate views without SECURITY DEFINER and without exposing auth.users
CREATE VIEW public.gdpr_compliance_dashboard AS
SELECT 
  'Pending GDPR Requests' as metric,
  COUNT(*) as count
FROM public.gdpr_requests 
WHERE status = 'pending'
UNION ALL
SELECT 
  'Data Export Requests (30 days)' as metric,
  COUNT(*) as count
FROM public.gdpr_requests 
WHERE request_type = 'data_export' 
  AND created_at > NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'Data Deletion Requests (30 days)' as metric,
  COUNT(*) as count
FROM public.gdpr_requests 
WHERE request_type = 'data_deletion' 
  AND created_at > NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'Total GDPR Requests' as metric,
  COUNT(*) as count
FROM public.gdpr_requests;

-- 3. Recreate security dashboard without SECURITY DEFINER and without exposing auth.users
CREATE VIEW public.security_dashboard AS
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
WHERE created_at > NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
  'Total Security Events' as metric,
  COUNT(*) as count
FROM public.security_events;

-- 4. Fix all functions with proper search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
  
  -- Check for suspicious IP ranges
  IF p_ip_address::text LIKE '192.168.%' OR p_ip_address::text LIKE '10.%' THEN
    risk_score := risk_score + 10;
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.log_gdpr_action(
  p_user_id UUID,
  p_action TEXT,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, new_data, created_at)
  VALUES (p_user_id, p_action, p_details, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.check_retention_compliance()
RETURNS TABLE (
  table_name TEXT,
  record_count BIGINT,
  oldest_record TIMESTAMP WITH TIME ZONE,
  retention_violation BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'user_activity'::TEXT,
    COUNT(*),
    MIN(created_at),
    (MIN(created_at) < NOW() - INTERVAL '1 year') as retention_violation
  FROM public.user_activity
  UNION ALL
  SELECT 
    'anonymous_usage'::TEXT,
    COUNT(*),
    MIN(created_at),
    (MIN(created_at) < NOW() - INTERVAL '1 year') as retention_violation
  FROM public.anonymous_usage
  UNION ALL
  SELECT 
    'gdpr_requests'::TEXT,
    COUNT(*),
    MIN(created_at),
    (MIN(created_at) < NOW() - INTERVAL '3 years') as retention_violation
  FROM public.gdpr_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, created_at, updated_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.cleanup_expired_data()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete expired user activity data (1 year retention)
  DELETE FROM public.user_activity 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Delete expired anonymous usage data (1 year retention)
  DELETE FROM public.anonymous_usage 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Delete expired GDPR requests (3 years retention)
  DELETE FROM public.gdpr_requests 
  WHERE created_at < NOW() - INTERVAL '3 years';
  
  -- Log the cleanup
  INSERT INTO public.data_retention_log (table_name, record_id, user_id, retention_period, expires_at)
  VALUES ('cleanup_job', gen_random_uuid(), NULL, INTERVAL '1 year', NOW() + INTERVAL '1 year');
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.export_user_data(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'user_id', user_uuid,
    'export_date', NOW(),
    'profile_data', (
      SELECT to_jsonb(p.*) 
      FROM public.profiles p 
      WHERE p.user_id = user_uuid
    ),
    'invoices', (
      SELECT jsonb_agg(to_jsonb(i.*)) 
      FROM public.invoices i 
      WHERE i.user_id = user_uuid
    ),
    'clients', (
      SELECT jsonb_agg(to_jsonb(c.*)) 
      FROM public.clients c 
      WHERE c.user_id = user_uuid
    ),
    'user_activity', (
      SELECT jsonb_agg(to_jsonb(ua.*)) 
      FROM public.user_activity ua 
      WHERE ua.user_id = user_uuid
    ),
    'gdpr_requests', (
      SELECT jsonb_agg(to_jsonb(gr.*)) 
      FROM public.gdpr_requests gr 
      WHERE gr.user_id = user_uuid
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.delete_user_data(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Delete user data in order (respecting foreign key constraints)
  DELETE FROM public.gdpr_requests WHERE user_id = user_uuid;
  DELETE FROM public.user_activity WHERE user_id = user_uuid;
  DELETE FROM public.invoices WHERE user_id = user_uuid;
  DELETE FROM public.clients WHERE user_id = user_uuid;
  DELETE FROM public.profiles WHERE user_id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.anonymize_user_data(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Anonymize profile data
  UPDATE public.profiles 
  SET 
    name = 'Anonymized User',
    company_name = 'Anonymized Company',
    phone = NULL,
    address = 'Anonymized Address',
    city = 'Anonymized City',
    state = 'Anonymized State',
    zip_code = '00000',
    country = 'Anonymized Country',
    website = NULL
  WHERE user_id = user_uuid;
  
  -- Anonymize client data
  UPDATE public.clients 
  SET 
    name = 'Anonymized Client',
    email = 'anonymized@example.com',
    phone = NULL,
    address = 'Anonymized Address',
    city = 'Anonymized City',
    state = 'Anonymized State',
    zip_code = '00000',
    country = 'Anonymized Country'
  WHERE user_id = user_uuid;
  
  -- Anonymize invoice data
  UPDATE public.invoices 
  SET 
    client_name = 'Anonymized Client',
    client_email = 'anonymized@example.com',
    client_address = 'Anonymized Address',
    company_name = 'Anonymized Company',
    company_address = 'Anonymized Address'
  WHERE user_id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Grant permissions to views (without SECURITY DEFINER)
GRANT SELECT ON public.gdpr_compliance_dashboard TO authenticated;
GRANT SELECT ON public.security_dashboard TO authenticated;

-- 6. Create a simple user count view that doesn't expose auth.users directly
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  'Total Profiles' as metric,
  COUNT(*) as count
FROM public.profiles
UNION ALL
SELECT 
  'Active Users (30 days)' as metric,
  COUNT(*) as count
FROM public.profiles
WHERE updated_at > NOW() - INTERVAL '30 days';

GRANT SELECT ON public.user_stats TO authenticated;

