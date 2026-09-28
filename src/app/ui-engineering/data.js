export const topics = [
  {
    slug: "core-styling",
    title: "Core Styling & Frameworks",
    tags: ["CSS", "SCSS", "CSS Modules", "Tailwind", "Bootstrap", "CSS-in-JS"],
    description: "The foundational technologies used to style modern web applications. From vanilla CSS to utility-first frameworks like Tailwind.",
    insights: "CRITICAL INSIGHT: You don't need to become an expert in every styling framework. Frameworks come and go, but you should understand raw CSS (Flexbox, Grid, specificity, stacking contexts) extremely well.",
    code: `/* Deep understanding of Grid and Flexbox is more valuable than knowing 10 frameworks */
.modern-layout {
  display: grid;
  /* Auto-fit grid that never gets smaller than 300px */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.centered-content {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Modern viewport units */
  min-height: 100dvh; 
}`
  },
  {
    slug: "layouts-responsiveness",
    title: "Layouts & Responsiveness",
    tags: ["Responsive layouts", "Mobile-first interfaces"],
    description: "Building applications that adapt perfectly to any screen size, starting from mobile devices and scaling up to wide desktop monitors.",
    insights: "Always design and code 'Mobile-First'. It's much easier to add complexity for larger screens using 'min-width' media queries than it is to strip away complex desktop layouts for mobile.",
    code: `/* Mobile-first approach */
.card {
  padding: 1rem;
  font-size: 14px;
}

/* Scale up for tablets and larger */
@media (min-width: 768px) {
  .card {
    padding: 2rem;
    font-size: 16px;
  }
}`
  },
  {
    slug: "overlay-components",
    title: "Overlays & Disclosures",
    tags: ["Modals", "Drawers", "Bottom sheets", "Dropdowns", "Tooltips", "Confirmation dialogs"],
    description: "Complex UI elements that break out of the standard document flow to request user action or display contextual information.",
    insights: "Overlays are notoriously difficult for accessibility (a11y). Always manage focus trapping, ensure 'Escape' key closes the overlay, and return focus to the trigger element when closed. Consider using the native <dialog> element.",
    code: `import { useEffect, useRef } from 'react';

export function NativeModal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal(); // Native focus trapping and backdrop!
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog 
      ref={dialogRef} 
      onClose={onClose}
      className="backdrop:bg-black/50 p-6 rounded-lg shadow-xl"
    >
      {children}
      <button onClick={onClose}>Close</button>
    </dialog>
  );
}`
  },
  {
    slug: "data-display",
    title: "Data Display & Navigation",
    tags: ["Data tables", "Pagination", "Infinite scrolling", "Tabs", "Accordions", "Carousels"],
    description: "Organizing and presenting large amounts of information efficiently without overwhelming the user.",
    insights: "When building data tables or infinite scroll for massive datasets, DOM virtualization is mandatory. Never render 10,000 rows in the DOM; only render the 20 rows visible on screen.",
    code: `// Conceptual Infinite Scroll with Intersection Observer
import { useEffect, useRef } from 'react';

export function InfiniteScrollList({ items, loadMore, hasMore }) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      {/* Invisible target at the bottom of the list */}
      <div ref={observerTarget} style={{ height: '20px' }} />
    </div>
  );
}`
  },
  {
    slug: "feedback-states",
    title: "Feedback & UI States",
    tags: ["Skeleton loaders", "Toasts", "Empty states", "Error states"],
    description: "Communicating system status to the user. Good UI handles the 'unhappy paths' just as beautifully as the happy path.",
    insights: "Avoid layout shift (CLS) by using Skeleton loaders that match the exact dimensions of the expected content. Provide actionable next steps in all empty and error states.",
    code: `export function ProfileCard({ isLoading, data, error }) {
  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load profile.</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="skeleton-wrapper" aria-busy="true">
        <div className="skeleton-avatar animate-pulse" />
        <div className="skeleton-text animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return <div className="empty-state">No profile data found.</div>;
  }

  return (
    <div>
      <img src={data.avatar} alt="Avatar" />
      <h2>{data.name}</h2>
    </div>
  );
}`
  }
];
