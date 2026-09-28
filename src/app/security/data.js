export const topics = [
  {
    slug: "core-vulnerabilities",
    title: "XSS, CSRF & Input Sanitization",
    tags: ["XSS", "CSRF", "Content Security Policy", "Input sanitization"],
    description: "Defending against the most common web exploits where attackers inject malicious scripts or forge requests on behalf of users.",
    insights: "WHEN/WHERE TO USE: Everywhere user input is rendered or state-changing requests are made. WHY: To prevent total account takeover. React inherently protects against basic XSS, but dangerouslySetInnerHTML bypasses it. Use DOMPurify before rendering HTML. Use Anti-CSRF tokens or SameSite cookies for POST requests.",
    code: `import DOMPurify from 'dompurify';

export function SafeHtmlContent({ userProvidedHtml }) {
  // ❌ BAD: Opens you to XSS attacks if HTML contains <script> tags
  // <div dangerouslySetInnerHTML={{ __html: userProvidedHtml }} />

  // ✅ GOOD: Sanitize first!
  const cleanHtml = DOMPurify.sanitize(userProvidedHtml);
  
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

// In Next.js (next.config.js), set a strict CSP to block inline scripts:
/*
const cspHeader = \`
  default-src 'self';
  script-src 'self' 'nonce-random123';
  style-src 'self' 'unsafe-inline';
\`
*/`
  },
  {
    slug: "authn-vs-authz",
    title: "AuthN vs AuthZ",
    tags: ["Authentication", "Authorization", "Authentication ≠ Authorization"],
    description: "The fundamental difference between knowing WHO a user is (Authentication) vs knowing WHAT they are allowed to do (Authorization).",
    insights: "WHEN/WHERE TO USE: At every API endpoint and protected route. WHY: Being logged in (AuthN) does not mean you have permission to delete a project (AuthZ). Never rely on hiding UI buttons for security; always authorize the action again on the backend.",
    code: `// Next.js Route Handler Example (Server-side)
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  // 1. AUTHENTICATION (Who are you?)
  const session = await getSession(request);
  if (!session?.userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // 2. AUTHORIZATION (Are you allowed to delete this specific project?)
  const project = await db.project.findById(params.id);
  
  // They are authenticated, but do they own this project?
  if (project.ownerId !== session.userId && session.role !== 'ADMIN') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Safe to proceed
  await db.project.delete(params.id);
  return NextResponse.json({ success: true });
}`
  },
  {
    slug: "session-tokens",
    title: "Secure Tokens & Cookies",
    tags: ["Secure cookies", "Token storage"],
    description: "The architecture of safely storing JWTs, session IDs, and other sensitive credentials on the client side.",
    insights: "WHEN/WHERE TO USE: When persisting user sessions. WHY: LocalStorage is vulnerable to XSS (if an attacker runs JS, they steal the token). Always store sensitive tokens in HttpOnly, Secure, SameSite=Strict cookies. JavaScript cannot read HttpOnly cookies.",
    code: `// Setting a secure cookie in a Next.js Server Action or Route Handler
import { cookies } from 'next/headers';

export async function loginUser(email, password) {
  const token = await generateJwt(email, password);
  
  // ✅ GOOD: XSS attacks cannot access this token
  cookies().set('session-token', token, {
    httpOnly: true, // Prevents JS access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'lax', // Prevents CSRF
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  // ❌ BAD: Sending the token to the client to put in LocalStorage
  // return { token }
}`
  },
  {
    slug: "api-infrastructure",
    title: "APIs, CORS & Rate Limiting",
    tags: ["CORS", "Rate limiting", "File upload security"],
    description: "Protecting your servers from denial-of-service, abusive scraping, and malicious file executions.",
    insights: "WHEN/WHERE TO USE: At the infrastructure/API gateway level. WHY: CORS prevents random websites from making AJAX calls to your API. Rate limiting stops brute-force attacks on login endpoints. For file uploads, NEVER trust the file extension; validate the magic numbers/mime-type on the server.",
    code: `// Next.js Middleware Rate Limiting (Conceptual)
import { NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/redis';

export async function middleware(request) {
  // Only limit the login route to prevent brute-forcing
  if (request.nextUrl.pathname.startsWith('/api/login')) {
    const ip = request.ip || '127.0.0.1';
    
    // Allow 5 attempts per 15 minutes
    const { success } = await rateLimiter.limit(ip);
    
    if (!success) {
      return new NextResponse("Too many login attempts. Try again later.", { 
        status: 429 
      });
    }
  }
  
  return NextResponse.next();
}`
  },
  {
    slug: "config-supply-chain",
    title: "Secrets & Supply Chain",
    tags: ["Environment variables", "Secrets management", "Dependency vulnerabilities"],
    description: "Keeping API keys out of source control and ensuring the npm packages you install aren't compromised.",
    insights: "WHEN/WHERE TO USE: Throughout the entire CI/CD and development lifecycle. WHY: Hardcoded secrets will be scraped by bots within seconds of pushing to GitHub. Use tools like 'npm audit' to catch malicious dependencies.",
    code: `// Environment Variable Security in Next.js

// ✅ NEXT_PUBLIC_ is safe to expose to the browser (e.g. Stripe Publishable Key)
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY;

// ❌ NEVER prefix real secrets with NEXT_PUBLIC_
// This will leak your DB password into the client-side JavaScript bundle!
// const dbPassword = process.env.NEXT_PUBLIC_DB_PASSWORD;

// ✅ Server-only secrets have no prefix. Next.js strips them from client bundles.
export async function getDbConnection() {
  const dbUrl = process.env.DATABASE_URL;
  // connect...
}`
  }
];
