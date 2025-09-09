// Enhanced Security Functions for StitchesX
import { supabase } from './supabase';

export interface SecurityEvent {
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata?: any;
}

export interface SuspiciousActivity {
  activityType: string;
  riskScore: number;
  description: string;
  metadata?: any;
}

// Security event logging
export async function logSecurityEvent(
  userId: string | null,
  event: SecurityEvent,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    const { error } = await supabase.rpc('log_security_event', {
      p_user_id: userId,
      p_event_type: event.eventType,
      p_severity: event.severity,
      p_description: event.description,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
      p_metadata: event.metadata
    });

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (error) {
    console.error('Security event logging error:', error);
  }
}

// Track failed login attempts
export async function trackFailedLogin(
  email: string,
  ipAddress: string,
  userAgent?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('track_failed_login', {
      p_email: email,
      p_ip_address: ipAddress,
      p_user_agent: userAgent
    });

    if (error) {
      console.error('Failed to track failed login:', error);
      return false;
    }

    return data; // Returns true if IP should be blocked
  } catch (error) {
    console.error('Failed login tracking error:', error);
    return false;
  }
}

// Check if IP is blocked
export async function isIpBlocked(ipAddress: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_ip_blocked', {
      p_ip_address: ipAddress
    });

    if (error) {
      console.error('Failed to check IP block status:', error);
      return false;
    }

    return data;
  } catch (error) {
    console.error('IP block check error:', error);
    return false;
  }
}

// Detect suspicious activity
export async function detectSuspiciousActivity(
  userId: string,
  activity: SuspiciousActivity,
  ipAddress?: string,
  userAgent?: string
): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('detect_suspicious_activity', {
      p_user_id: userId,
      p_activity_type: activity.activityType,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
      p_metadata: activity.metadata
    });

    if (error) {
      console.error('Failed to detect suspicious activity:', error);
      return 0;
    }

    return data; // Returns risk score
  } catch (error) {
    console.error('Suspicious activity detection error:', error);
    return 0;
  }
}

// Get user security summary
export async function getUserSecuritySummary(userId: string): Promise<any> {
  try {
    const { data, error } = await supabase.rpc('get_user_security_summary', {
      p_user_id: userId
    });

    if (error) {
      console.error('Failed to get user security summary:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('User security summary error:', error);
    return null;
  }
}

// Input validation and sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[sanitizeInput(key)] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);
    
    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (attempt.count >= this.maxAttempts) {
      return false;
    }
    
    attempt.count++;
    return true;
  }
  
  getRemainingAttempts(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return this.maxAttempts;
    
    const now = Date.now();
    if (now > attempt.resetTime) {
      return this.maxAttempts;
    }
    
    return Math.max(0, this.maxAttempts - attempt.count);
  }
  
  getResetTime(key: string): number | null {
    const attempt = this.attempts.get(key);
    if (!attempt) return null;
    
    const now = Date.now();
    if (now > attempt.resetTime) return null;
    
    return attempt.resetTime;
  }
}

// Security headers helper
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.stripe.com https://*.supabase.co;"
  };
}

// IP address validation
export function isValidIpAddress(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// Get client IP address from request
export function getClientIp(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    '127.0.0.1'
  );
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

// Hash sensitive data (for logging)
export function hashSensitiveData(data: string): string {
  // Simple hash for logging purposes (not for security)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Security event types
export const SecurityEventTypes = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  ACCOUNT_CREATED: 'account_created',
  ACCOUNT_DELETED: 'account_deleted',
  PASSWORD_CHANGED: 'password_changed',
  DATA_EXPORTED: 'data_exported',
  DATA_DELETED: 'data_deleted',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  INVALID_INPUT: 'invalid_input',
  UNAUTHORIZED_ACCESS: 'unauthorized_access'
} as const;

// Security severity levels
export const SecuritySeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;
