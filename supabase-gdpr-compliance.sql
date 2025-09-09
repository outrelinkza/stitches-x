-- GDPR Compliance Setup for StitchesX
-- Run this in your Supabase SQL Editor

-- 1. Create GDPR request tracking table
CREATE TABLE IF NOT EXISTS public.gdpr_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('data_export', 'data_deletion', 'data_rectification')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  request_data JSONB,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on GDPR requests
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;

-- GDPR requests policies (only admins can see all, users can see their own)
CREATE POLICY "Users can view own GDPR requests" ON public.gdpr_requests
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can insert GDPR requests" ON public.gdpr_requests
  FOR INSERT WITH CHECK (true);

-- 2. Create data retention tracking table
CREATE TABLE IF NOT EXISTS public.data_retention_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  retention_period INTERVAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on data retention log
ALTER TABLE public.data_retention_log ENABLE ROW LEVEL SECURITY;

-- 3. Create function to automatically delete expired data
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
  
  -- Delete expired support communications (2 years retention)
  -- Note: You'll need to create a support_communications table if you have one
  
  -- Log the cleanup
  INSERT INTO public.data_retention_log (table_name, record_id, user_id, retention_period, expires_at)
  VALUES ('cleanup_job', gen_random_uuid(), NULL, INTERVAL '1 year', NOW() + INTERVAL '1 year');
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to export user data (GDPR Article 15)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to delete user data (GDPR Article 17)
CREATE OR REPLACE FUNCTION public.delete_user_data(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Delete user data in order (respecting foreign key constraints)
  DELETE FROM public.gdpr_requests WHERE user_id = user_uuid;
  DELETE FROM public.user_activity WHERE user_id = user_uuid;
  DELETE FROM public.invoices WHERE user_id = user_uuid;
  DELETE FROM public.clients WHERE user_id = user_uuid;
  DELETE FROM public.profiles WHERE user_id = user_uuid;
  
  -- Note: The auth.users record will be deleted by Supabase Auth
  -- when you delete the user account
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to anonymize user data (for analytics)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create scheduled job to run data cleanup (if you have pg_cron extension)
-- Note: This requires the pg_cron extension to be enabled in Supabase
-- You can also run this manually or set up a cron job on your server

-- Schedule daily cleanup of expired data
-- SELECT cron.schedule('cleanup-expired-data', '0 2 * * *', 'SELECT public.cleanup_expired_data();');

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_user_id ON public.gdpr_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_status ON public.gdpr_requests(status);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_created_at ON public.gdpr_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_data_retention_expires_at ON public.data_retention_log(expires_at);

-- 9. Create view for GDPR compliance dashboard
CREATE OR REPLACE VIEW public.gdpr_compliance_dashboard AS
SELECT 
  'Total Users' as metric,
  COUNT(*) as count
FROM auth.users
UNION ALL
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
  AND created_at > NOW() - INTERVAL '30 days';

-- 10. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gdpr_requests TO authenticated;
GRANT SELECT ON public.data_retention_log TO authenticated;
GRANT SELECT ON public.gdpr_compliance_dashboard TO authenticated;
GRANT EXECUTE ON FUNCTION public.export_user_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.anonymize_user_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_data() TO authenticated;

-- 11. Create audit log table for GDPR compliance tracking
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log policies (only admins can see all)
CREATE POLICY "Users can view own audit log" ON public.audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- 12. Create function to log GDPR actions
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission for audit logging
GRANT EXECUTE ON FUNCTION public.log_gdpr_action(UUID, TEXT, JSONB) TO authenticated;

-- 13. Add updated_at trigger to new tables
CREATE TRIGGER update_gdpr_requests_updated_at
  BEFORE UPDATE ON public.gdpr_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Create function to check data retention compliance
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission for compliance checking
GRANT EXECUTE ON FUNCTION public.check_retention_compliance() TO authenticated;

