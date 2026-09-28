export const topics = [
  {
    slug: "core-architecture",
    title: "Core Architecture",
    tags: ["App Router", "Server Components", "Client Components"],
    description: "The App Router marks a paradigm shift in Next.js, prioritizing server-first rendering and a new mental model for component boundaries.",
    insights: "CRITICAL FLOW: Server Component -> Server Data Fetching -> Client Component (ONLY when interaction is required). Maximize Server Components for performance and security; push interactivity down the tree to isolate client bundles.",
    code: `// Server Component (Default)
export default async function Page() {
  // Fetch data directly on the server
  const data = await fetch('https://api.example.com/data').then(res => res.json());

  return (
    <main>
      <h1>Server rendered data: {data.title}</h1>
      {/* Pass data as props to a Client Component for interaction */}
      <InteractiveButton id={data.id} />
    </main>
  );
}

// Client Component
'use client';
import { useState } from 'react';

export function InteractiveButton({ id }) {
  const [clicked, setClicked] = useState(false);
  return <button onClick={() => setClicked(true)}>Interact {id}</button>;
}`
  },
  {
    slug: "advanced-routing",
    title: "Advanced Routing",
    tags: ["Dynamic routes", "Parallel routes", "Intercepting routes", "Route Handlers"],
    description: "Beyond simple file-based routing, App Router enables complex UI patterns natively. Route Handlers replace API routes, while advanced routing patterns allow for sophisticated layouts.",
    insights: "Use Parallel Routes (@folder) for independent loading states (like dashboards). Use Intercepting Routes ((..)folder) to load routes within the current layout context (e.g., expanding a photo in a modal without losing the background).",
    code: `// Route Handler: app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const id = params.id;
  const user = await db.user.findUnique({ where: { id } });
  
  if (!user) {
    return new NextResponse('User not found', { status: 404 });
  }
  
  return NextResponse.json(user);
}`
  },
  {
    slug: "rendering-strategies",
    title: "Rendering Strategies",
    tags: ["SSR", "SSG", "ISR", "Streaming", "Suspense"],
    description: "Modern Next.js blurs the line between static and dynamic rendering. Streaming allows sending UI chunks progressively to the client.",
    insights: "Wrap slow data-fetching Server Components in <Suspense>. This allows the rest of the page to render instantly (like SSG) while the heavy data streams in dynamically, dramatically improving perceived performance and TTFB.",
    code: `import { Suspense } from 'react';
import { Skeleton } from './Skeleton';

// Slow component
async function HeavyDataList() {
  const data = await fetchSlowData();
  return <ul>{data.map(item => <li key={item}>{item}</li>)}</ul>;
}

export default function Page() {
  return (
    <div>
      <h1>Fast Header</h1>
      {/* Page renders instantly, this section streams in later */}
      <Suspense fallback={<Skeleton count={5} />}>
        <HeavyDataList />
      </Suspense>
    </div>
  );
}`
  },
  {
    slug: "data-mutations-caching",
    title: "Data Mutations & Caching",
    tags: ["Server Actions", "Caching", "Revalidation", "fetch caching", "generateStaticParams"],
    description: "Next.js aggressively caches fetch requests by default. Server Actions provide a seamless, RPC-like way to mutate data directly from the client without manually writing API endpoints.",
    insights: "Master the cache. Use tag-based or path-based revalidation (revalidateTag, revalidatePath) after a Server Action mutates data. generateStaticParams is the App Router equivalent of getStaticPaths for pre-rendering dynamic routes.",
    code: `// Server Action
'use server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
  
  // Clear the cache for the posts page to show the new post instantly
  revalidatePath('/posts');
}

// Form component usage
export default function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  );
}`
  },
  {
    slug: "security-edge",
    title: "Middleware & Authentication",
    tags: ["Middleware", "Authentication", "Middleware authentication"],
    description: "Middleware runs at the Edge before a request is completed. It is the ideal place for route protection, redirects, and modifying request/response headers.",
    insights: "Perform session verification and token validation in Middleware to protect routes globally before any rendering occurs. This ensures unauthenticated users never hit your database or Server Components for protected pages.",
    code: `// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const token = request.cookies.get('session-token')?.value
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}
 
export const config = {
  matcher: ['/dashboard/:path*'],
}`
  },
  {
    slug: "seo-metadata",
    title: "SEO & Metadata",
    tags: ["Metadata API", "generateMetadata", "SEO", "Sitemap", "Robots", "Structured data"],
    description: "Next.js provides built-in, type-safe APIs to handle Search Engine Optimization programmatically, replacing the need for external head-management libraries.",
    insights: "Use generateMetadata for dynamic open-graph tags based on fetched data. Leverage the special file conventions (sitemap.ts, robots.ts) to automatically generate and maintain crucial SEO files without manual configuration.",
    code: `// Dynamic metadata based on route params
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  return {
    title: \`\${product.name} | MyStore\`,
    description: product.description,
    openGraph: {
      images: [product.imageUrl],
    },
  };
}

export default function ProductPage({ params }) {
  // Page implementation...
}`
  },
  {
    slug: "assets-optimization",
    title: "Assets & Optimization",
    tags: ["Image optimization", "Font optimization"],
    description: "Next.js components automatically handle layout shift prevention, lazy loading, and modern format delivery for static assets.",
    insights: "Always use the next/image component instead of <img>. It prevents Cumulative Layout Shift (CLS) natively. Use next/font to host Google fonts locally at build time, eliminating external network requests and privacy concerns.",
    code: `import Image from 'next/image'
import { Inter } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  return (
    <div className={inter.className}>
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={800}
        height={600}
        priority // Load instantly instead of lazy loading
        placeholder="blur" // Use blur-up placeholder
      />
    </div>
  );
}`
  }
];
