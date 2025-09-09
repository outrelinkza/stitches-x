-- Ultimate Security Fix - Remove SECURITY DEFINER Completely
-- Run this in your Supabase SQL Editor

-- 1. Force drop all views and any dependencies
DROP VIEW IF EXISTS public.gdpr_compliance_dashboard CASCADE;
DROP VIEW IF EXISTS public.security_dashboard CASCADE;
DROP VIEW IF EXISTS public.user_stats CASCADE;

-- 2. Drop any existing functions that might be creating these views
DROP FUNCTION IF EXISTS public.refresh_gdpr_dashboard() CASCADE;
DROP FUNCTION IF EXISTS public.refresh_security_dashboard() CASCADE;
DROP FUNCTION IF EXISTS public.refresh_user_stats() CASCADE;
DROP FUNCTION IF EXISTS public.refresh_all_dashboards() CASCADE;

-- 3. Create simple tables instead of views (no SECURITY DEFINER possible)
CREATE TABLE IF NOT EXISTS public.gdpr_compliance_dashboard (
  id SERIAL PRIMARY KEY,
  metric TEXT NOT NULL,
  count BIGINT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.security_dashboard (
  id SERIAL PRIMARY KEY,
  metric TEXT NOT NULL,
  count BIGINT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_stats (
  id SERIAL PRIMARY KEY,
  metric TEXT NOT NULL,
  count BIGINT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create simple functions to populate the tables (without SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.update_gdpr_dashboard()
RETURNS VOID AS $$
BEGIN
  -- Clear existing data
  DELETE FROM public.gdpr_compliance_dashboard;
  
  -- Insert fresh data
  INSERT INTO public.gdpr_compliance_dashboard (metric, count, updated_at)
  SELECT 
    'Pending GDPR Requests' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.gdpr_requests 
  WHERE status = 'pending'
  UNION ALL
  SELECT 
    'Data Export Requests (30 days)' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.gdpr_requests 
  WHERE request_type = 'data_export' 
    AND created_at > NOW() - INTERVAL '30 days'
  UNION ALL
  SELECT 
    'Data Deletion Requests (30 days)' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.gdpr_requests 
  WHERE request_type = 'data_deletion' 
    AND created_at > NOW() - INTERVAL '30 days'
  UNION ALL
  SELECT 
    'Total GDPR Requests' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.gdpr_requests;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_security_dashboard()
RETURNS VOID AS $$
BEGIN
  -- Clear existing data
  DELETE FROM public.security_dashboard;
  
  -- Insert fresh data
  INSERT INTO public.security_dashboard (metric, count, updated_at)
  SELECT 
    'Failed Login Attempts (24h)' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.failed_login_attempts 
  WHERE last_attempt > NOW() - INTERVAL '24 hours'
  UNION ALL
  SELECT 
    'Blocked IPs' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.failed_login_attempts 
  WHERE is_blocked = TRUE AND blocked_until > NOW()
  UNION ALL
  SELECT 
    'Suspicious Activities (24h)' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.suspicious_activity 
  WHERE created_at > NOW() - INTERVAL '24 hours'
  UNION ALL
  SELECT 
    'High Risk Activities (24h)' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.suspicious_activity 
  WHERE risk_score > 75 AND created_at > NOW() - INTERVAL '24 hours'
  UNION ALL
  SELECT 
    'Security Events (24h)' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.security_events 
  WHERE created_at > NOW() - INTERVAL '24 hours'
  UNION ALL
  SELECT 
    'Total Security Events' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.security_events;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS VOID AS $$
BEGIN
  -- Clear existing data
  DELETE FROM public.user_stats;
  
  -- Insert fresh data
  INSERT INTO public.user_stats (metric, count, updated_at)
  SELECT 
    'Total Profiles' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.profiles
  UNION ALL
  SELECT 
    'Active Users (30 days)' as metric,
    COUNT(*) as count,
    NOW() as updated_at
  FROM public.profiles
  WHERE updated_at > NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- 5. Create a function to update all dashboards
CREATE OR REPLACE FUNCTION public.update_all_dashboards()
RETURNS VOID AS $$
BEGIN
  PERFORM public.update_gdpr_dashboard();
  PERFORM public.update_security_dashboard();
  PERFORM public.update_user_stats();
END;
$$ LANGUAGE plpgsql;

-- 6. Enable RLS on dashboard tables
ALTER TABLE public.gdpr_compliance_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for dashboard tables
CREATE POLICY "Authenticated users can read GDPR dashboard" ON public.gdpr_compliance_dashboard
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read security dashboard" ON public.security_dashboard
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read user stats" ON public.user_stats
  FOR SELECT USING (auth.role() = 'authenticated');

-- 8. Grant permissions
GRANT SELECT ON public.gdpr_compliance_dashboard TO authenticated;
GRANT SELECT ON public.security_dashboard TO authenticated;
GRANT SELECT ON public.user_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_gdpr_dashboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_security_dashboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_all_dashboards() TO authenticated;

-- 9. Populate the dashboards with initial data
SELECT public.update_all_dashboards();

-- 10. Verify the tables are created and populated
SELECT 'GDPR Dashboard' as dashboard, metric, count FROM public.gdpr_compliance_dashboard
UNION ALL
SELECT 'Security Dashboard' as dashboard, metric, count FROM public.security_dashboard
UNION ALL
SELECT 'User Stats' as dashboard, metric, count FROM public.user_stats;

-- 11. Check that no views exist with SECURITY DEFINER
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views 
WHERE schemaname = 'public' 
  AND viewname IN ('gdpr_compliance_dashboard', 'security_dashboard', 'user_stats');
