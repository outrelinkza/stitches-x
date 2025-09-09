import { NextApiRequest, NextApiResponse } from 'next';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  maxRequests: number = 10,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const key = `${ip}-${req.url}`;
  const now = Date.now();
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    res.status(429).json({ error: 'Too many requests' });
    return false;
  }
  
  current.count++;
  return true;
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

export function validateRequiredFields(data: any, requiredFields: string[]): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

export function isValidAmount(amount: any): boolean {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && num <= 1000000; // Max £1M
}

export function isValidInvoiceNumber(invoiceNumber: any): boolean {
  if (typeof invoiceNumber !== 'string') return false;
  return /^[A-Z0-9-]+$/i.test(invoiceNumber) && invoiceNumber.length <= 50;
}

export function logSecurityEvent(
  event: string,
  details: any,
  req: NextApiRequest
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    url: req.url,
    method: req.method
  };
  
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry));
  
  // In production, send to monitoring service
  // await sendToMonitoring(logEntry);
}
