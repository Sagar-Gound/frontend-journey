export const topics = [
  {
    slug: "rendering-memoization",
    title: "Rendering & Memoization",
    tags: ["React rendering", "Re-render analysis", "Memoization"],
    description: "Master the React rendering lifecycle. Understand exactly when and why components re-render, and how to prevent unnecessary renders.",
    insights: "CRITICAL INSIGHT: This is where senior React developers separate themselves. Don't blindly use useMemo/useCallback everywhere; understand object references and use React DevTools Profiler to measure before optimizing.",
    code: `import { memo, useMemo, useCallback, useState } from 'react';

// Memoized child prevents re-render if props haven't changed
const ExpensiveChild = memo(({ onAction, data }) => {
  console.log("ExpensiveChild rendered");
  return <button onClick={onAction}>Process {data.length} items</button>;
});

export function Parent() {
  const [count, setCount] = useState(0);
  
  // Stable reference for the prop
  const data = useMemo(() => [1, 2, 3, 4, 5], []);
  
  // Stable reference for the callback
  const handleAction = useCallback(() => {
    console.log("Action triggered");
  }, []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveChild onAction={handleAction} data={data} />
    </div>
  );
}`
  },
  {
    slug: "architecture-bundling",
    title: "Architecture & Bundling",
    tags: ["Code splitting", "Dynamic imports", "Lazy loading", "Bundle analysis", "Tree shaking"],
    description: "Optimize the initial load time by sending only the JavaScript the user actually needs right now.",
    insights: "Heavy libraries (like charts, rich text editors, or PDF generators) should ALWAYS be dynamically imported. Use Next.js bundle analyzer to visually inspect your chunk sizes.",
    code: `import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import a heavy component only when needed
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false // Disable Server-Side Rendering if it relies on window/browser APIs
});

export function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>View Analytics</button>
      {showChart && <HeavyChart />}
    </div>
  );
}`
  },
  {
    slug: "data-execution",
    title: "Data & Execution Optimization",
    tags: ["Prefetching", "Caching", "Request deduplication", "Debouncing", "Throttling", "Web Workers"],
    description: "Manage network requests and heavy main-thread execution to keep the application responsive.",
    insights: "Offload heavy computations (like parsing massive CSVs or complex data transformations) to Web Workers so you don't block the main thread and freeze the UI.",
    code: `// Debouncing a search input to prevent API spam
import { useState, useEffect } from 'react';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Only fire the search 500ms AFTER the user stops typing
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        const res = await fetch(\`/api/search?q=\${query}\`);
        const data = await res.json();
        setResults(data);
      }
    }, 500);

    // Cleanup cancels the previous timeout if user types again before 500ms
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search..." 
      />
    </div>
  );
}`
  },
  {
    slug: "ui-media-optimization",
    title: "UI & Media Optimization",
    tags: ["Image optimization", "Font optimization", "Virtualization"],
    description: "Techniques for efficiently rendering large amounts of DOM nodes and heavy media assets without destroying frame rates.",
    insights: "Virtualization is non-negotiable for large lists. If you render 10,000 DOM nodes for a dropdown or a table, the browser will crash. Use libraries like TanStack Virtual to only render the visible nodes.",
    code: `import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function VirtualizedList({ items }) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // Estimated height of each row in px
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: \`\${rowVirtualizer.getTotalSize()}px\`, width: '100%', position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: \`\${virtualItem.size}px\`,
              transform: \`translateY(\${virtualItem.start}px)\`,
            }}
          >
            Row {virtualItem.index} - {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}`
  },
  {
    slug: "web-vitals",
    title: "Core Web Vitals",
    tags: ["LCP", "INP", "CLS", "TTFB", "FCP"],
    description: "Google's standardized metrics for user experience. Understanding these is essential for SEO and user retention.",
    insights: "LCP (Largest Contentful Paint) measures loading performance. INP (Interaction to Next Paint) measures responsiveness. CLS (Cumulative Layout Shift) measures visual stability. Fix CLS by defining exact width/height on images.",
    code: `/* Fixing Cumulative Layout Shift (CLS) */
/* Always reserve space for images before they load! */
.image-wrapper {
  position: relative;
  width: 100%;
  /* Aspect ratio trick (e.g. 16:9) -> (9 / 16 * 100%) */
  padding-top: 56.25%; 
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Or in modern CSS simply use: */
img {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}`
  },
  {
    slug: "profiling-tooling",
    title: "Profiling & Tooling",
    tags: ["Chrome DevTools", "Lighthouse", "PageSpeed Insights", "React DevTools Profiler"],
    description: "The instruments used to diagnose, measure, and verify performance improvements.",
    insights: "Never guess what is slow. Always measure. Use the React DevTools Profiler with 'Record why each component rendered while profiling' enabled to pinpoint exactly which props are breaking memoization.",
    code: `// Tip for debugging re-renders:
// Use this custom hook to detect which prop changed between renders

import { useEffect, useRef } from 'react';

export function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}`
  }
];
