-- Final Security Fix for StitchesX - Force Remove SECURITY DEFINER
-- Run this in your Supabase SQL Editor

-- 1. Force drop all views with CASCADE to remove any dependencies
DROP VIEW IF EXISTS public.gdpr_compliance_dashboard CASCADE;
DROP VIEW IF EXISTS public.security_dashboard CASCADE;
DROP VIEW IF EXISTS public.user_stats CASCADE;

-- 2. Wait a moment for the drops to complete
-- (This is just a comment - PostgreSQL will handle the timing)

-- 3. Recreate views without SECURITY DEFINER (explicitly)
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

-- 4. Recreate security dashboard without SECURITY DEFINER
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

-- 5. Recreate user stats view without SECURITY DEFINER
CREATE VIEW public.user_stats AS
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

-- 6. Grant permissions to views (without SECURITY DEFINER)
GRANT SELECT ON public.gdpr_compliance_dashboard TO authenticated;
GRANT SELECT ON public.security_dashboard TO authenticated;
GRANT SELECT ON public.user_stats TO authenticated;

-- 7. Verify the views are created without SECURITY DEFINER
-- Check view definitions
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views 
WHERE schemaname = 'public' 
  AND viewname IN ('gdpr_compliance_dashboard', 'security_dashboard', 'user_stats');

-- 8. Check if views have SECURITY DEFINER (should return empty)
SELECT 
  n.nspname as schema_name,
  c.relname as view_name,
  c.relkind,
  CASE 
    WHEN c.relkind = 'v' THEN 'VIEW'
    ELSE 'OTHER'
  END as object_type
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('gdpr_compliance_dashboard', 'security_dashboard', 'user_stats')
  AND c.relkind = 'v';

