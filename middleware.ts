import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = request.nextUrl.pathname;

  // Check if the path starts with /api/
  if (path.startsWith('/api/')) {
    // Add CORS headers for API routes
    const response = NextResponse.next();
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }
    
    return response;
  }

  // Check if the path is protected (requires authentication)
  const protectedPaths = ['/dashboard', '/profile', '/settings', '/invoices', '/clients'];
  const isProtectedPath = protectedPaths.some(protectedPath => path.startsWith(protectedPath));

  if (isProtectedPath) {
    // Check for authentication token in cookies or headers
    const token = request.cookies.get('sb-access-token') || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect to auth page if not authenticated
      const authUrl = new URL('/auth', request.url);
      authUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(authUrl);
    }
  }

  // Check if user is trying to access auth pages while already authenticated
  const authPaths = ['/auth', '/forgot-password', '/reset-password'];
  const isAuthPath = authPaths.some(authPath => path.startsWith(authPath));

  if (isAuthPath) {
    const token = request.cookies.get('sb-access-token') || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (token) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://checkout.stripe.com",
    "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

