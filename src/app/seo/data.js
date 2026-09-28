export const topics = [
  {
    slug: "metadata-social",
    title: "Metadata & Social Graphs",
    tags: ["Metadata", "Canonical URLs", "Open Graph", "Twitter cards", "Dynamic metadata"],
    description: "Control how your pages appear in search engine results and when shared on social media platforms like Twitter, LinkedIn, and Facebook.",
    insights: "CRITICAL INSIGHT: Always set a canonical URL to prevent duplicate content penalties, especially on ecommerce sites with parameterized URLs (like ?sort=price). Use Next.js generateMetadata for dynamic, data-driven tags.",
    code: `// Next.js App Router Dynamic Metadata Example
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  return {
    title: \`\${product.name} - Buy Now | MyStore\`,
    description: product.shortDescription,
    alternates: {
      canonical: \`https://mystore.com/products/\${product.id}\`,
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: \`https://mystore.com/products/\${product.id}\`,
      siteName: 'MyStore',
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [product.imageUrl],
    },
  }
}`
  },
  {
    slug: "crawling-indexing",
    title: "Crawling & Site Architecture",
    tags: ["Sitemap", "Robots.txt", "Internal linking", "Pagination SEO", "Redirects", "404/410"],
    description: "Guide search engine bots through your site efficiently. Ensure they find your important content and ignore the noise.",
    insights: "Don't just rely on sitemaps. A strong internal linking structure is the most powerful SEO lever you have. If a page isn't linked anywhere on your site, Google assumes it's not important. Return a hard 410 (Gone) for deleted products instead of a soft 404.",
    code: `// Next.js dynamic sitemap.ts example
import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all your dynamic routes
  const products = await getProducts();
  
  const productUrls = products.map((product) => ({
    url: \`https://mystore.com/products/\${product.id}\`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://mystore.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://mystore.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productUrls,
  ]
}`
  },
  {
    slug: "structured-data",
    title: "Structured Data (JSON-LD)",
    tags: ["JSON-LD", "Breadcrumb schema", "Product schema", "Organization schema", "FAQ schema"],
    description: "Speak directly to search engines in their native language (Schema.org). This is how you win rich snippets (stars, prices, FAQs) in search results.",
    insights: "Always inject JSON-LD instead of relying on Microdata HTML tags. It's much cleaner and decouples your SEO data from your UI structure. Google heavily favors product and FAQ schemas for e-commerce and content sites.",
    code: `// Injecting JSON-LD in a Next.js Page
export default function ProductPage({ product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brandName,
    },
    offers: {
      '@type': 'Offer',
      url: \`https://mystore.com/products/\${product.id}\`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <section>
      {/* Inject JSON-LD directly into the DOM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Render standard UI below */}
      <h1>{product.name}</h1>
      <p>\${product.price}</p>
    </section>
  )
}`
  },
  {
    slug: "rendering-implications",
    title: "Rendering Strategies & SEO",
    tags: ["SSR vs CSR SEO implications", "Server Components"],
    description: "How your choice between Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG) impacts Googlebot.",
    insights: "While Google *can* execute JavaScript (CSR), it delays indexing significantly because JS rendering goes into a secondary queue. For critical SEO content (e-commerce product pages, blogs), always use SSR or SSG so the HTML is fully formed on the first network request.",
    code: `// GOOD FOR SEO: Server Component (Next.js App Router)
// The HTML is fully generated on the server. 
// Googlebot sees the complete content instantly.
export default async function BlogPage({ params }) {
  // This runs on the server
  const article = await db.query('SELECT * FROM articles WHERE slug = ?', [params.slug]);
  
  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}


/* 
// BAD FOR SEO: Traditional Client Component 
// Googlebot initially sees an empty div or a loading spinner.
'use client'
import { useEffect, useState } from 'react';

export default function BadSeoPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div>Loading...</div>; // Googlebot might index this!
  return <div>{data.content}</div>;
}
*/`
  }
];
