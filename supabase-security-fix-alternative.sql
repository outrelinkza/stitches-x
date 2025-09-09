-- Alternative Security Fix - Replace Views with Tables
-- Run this in your Supabase SQL Editor

-- 1. Drop all problematic views
DROP VIEW IF EXISTS public.gdpr_compliance_dashboard CASCADE;
DROP VIEW IF EXISTS public.security_dashboard CASCADE;
DROP VIEW IF EXISTS public.user_stats CASCADE;

-- 2. Create tables instead of views (no SECURITY DEFINER issues)
CREATE TABLE IF NOT EXISTS public.gdpr_compliance_dashboard (
  metric TEXT,
  count BIGINT
);

CREATE TABLE IF NOT EXISTS public.security_dashboard (
  metric TEXT,
  count BIGINT
);

CREATE TABLE IF NOT EXISTS public.user_stats (
  metric TEXT,
  count BIGINT
);

-- 3. Create function to populate GDPR dashboard
CREATE OR REPLACE FUNCTION public.refresh_gdpr_dashboard()
RETURNS VOID AS $$
BEGIN
  -- Clear existing data
  DELETE FROM public.gdpr_compliance_dashboard;
  
  -- Insert fresh data
  INSERT INTO public.gdpr_compliance_dashboard (metric, count)
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Create function to populate security dashboard
CREATE OR REPLACE FUNCTION public.refresh_security_dashboard()
RETURNS VOID AS $$
BEGIN
  -- Clear existing data
  DELETE FROM public.security_dashboard;
  
  -- Insert fresh data
  INSERT INTO public.security_dashboard (metric, count)
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Create function to populate user stats
CREATE OR REPLACE FUNCTION public.refresh_user_stats()
RETURNS VOID AS $$
BEGIN
  -- Clear existing data
  DELETE FROM public.user_stats;
  
  -- Insert fresh data
  INSERT INTO public.user_stats (metric, count)
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. Create function to refresh all dashboards
CREATE OR REPLACE FUNCTION public.refresh_all_dashboards()
RETURNS VOID AS $$
BEGIN
  PERFORM public.refresh_gdpr_dashboard();
  PERFORM public.refresh_security_dashboard();
  PERFORM public.refresh_user_stats();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. Enable RLS on dashboard tables
ALTER TABLE public.gdpr_compliance_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for dashboard tables
CREATE POLICY "Authenticated users can read GDPR dashboard" ON public.gdpr_compliance_dashboard
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read security dashboard" ON public.security_dashboard
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read user stats" ON public.user_stats
  FOR SELECT USING (auth.role() = 'authenticated');

-- 9. Grant permissions
GRANT SELECT ON public.gdpr_compliance_dashboard TO authenticated;
GRANT SELECT ON public.security_dashboard TO authenticated;
GRANT SELECT ON public.user_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_gdpr_dashboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_security_dashboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_user_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_all_dashboards() TO authenticated;

-- 10. Populate the dashboards with initial data
SELECT public.refresh_all_dashboards();

-- 11. Verify the tables are created and populated
SELECT 'GDPR Dashboard' as dashboard, * FROM public.gdpr_compliance_dashboard
UNION ALL
SELECT 'Security Dashboard' as dashboard, * FROM public.security_dashboard
UNION ALL
SELECT 'User Stats' as dashboard, * FROM public.user_stats;

