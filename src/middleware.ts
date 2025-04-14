import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get response
  const response = NextResponse.next();

  // Add security headers (less restrictive for development)
  const ContentSecurityPolicy = process.env.NODE_ENV === 'production' 
    ? `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://via.placeholder.com https://images.unsplash.com;
      font-src 'self' data:;
      connect-src 'self' ws: wss:;
      frame-src 'self';
      worker-src 'self' blob:;
    `
    : ''; // Skip CSP in development to avoid Fast Refresh issues

  // Only set CSP in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim());
  }
  
  // These headers are safe in both environments
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    // Apply to all pages except static assets and api routes
    '/((?!_next/static|_next/image|api|favicon.ico).*)',
  ],
}; 