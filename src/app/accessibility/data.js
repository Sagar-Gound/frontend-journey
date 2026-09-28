export const topics = [
  {
    slug: "semantic-html",
    title: "Semantic HTML & WCAG",
    tags: ["Semantic HTML", "WCAG"],
    description: "The absolute foundation of web accessibility. Using the correct HTML elements (like <nav>, <main>, <button>) instead of generic <div> tags.",
    insights: "WHEN TO USE: Always. This is step zero. WHY: Native HTML elements come with built-in keyboard support and screen reader context. A <button> is automatically focusable and triggered by Enter/Space. A <div onClick> gives you nothing.",
    code: `// ❌ BAD: A div acting as a button
<div 
  className="btn" 
  onClick={() => submit()}
>
  Submit
</div>

// ✅ GOOD: Semantic HTML
// (Automatically gets keyboard focus and Enter/Space key support)
<button 
  className="btn" 
  onClick={() => submit()}
>
  Submit
</button>`
  },
  {
    slug: "keyboard-focus",
    title: "Keyboard & Focus Management",
    tags: ["Keyboard navigation", "Focus management"],
    description: "Ensuring users who rely on keyboards (no mouse) can seamlessly navigate and interact with your application.",
    insights: "WHEN TO USE: When building custom interactive components (dropdowns, tabs, menus). WHY: If a user presses 'Tab' and the focus ring disappears or gets stuck, the app becomes unusable. Manage focus manually when opening/closing overlays.",
    code: `import { useEffect, useRef } from 'react';

// Focus Management Example: Auto-focusing an input when a search bar opens
export function SearchBar({ isOpen }) {
  const inputRef = useRef(null);

  useEffect(() => {
    // When the component opens, immediately move focus to the input
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      {/* Provide a clear visual focus indicator in CSS! */}
      <input 
        ref={inputRef} 
        type="text" 
        placeholder="Search..." 
        className="focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}`
  },
  {
    slug: "aria-screen-readers",
    title: "ARIA & Screen Readers",
    tags: ["ARIA", "Screen readers", "aria-live", "aria-expanded"],
    description: "Accessible Rich Internet Applications (ARIA) attributes bridge the gap when semantic HTML isn't enough to describe complex UI states.",
    insights: "WHEN TO USE: Only when native HTML fails you (e.g., announcing a dynamic success toast, or a custom toggle switch). WHY: Screen readers need context. The first rule of ARIA is: No ARIA is better than bad ARIA.",
    code: `export function CustomAccordion({ title, children, isOpen, toggle }) {
  return (
    <div>
      <button 
        onClick={toggle}
        // Tell screen readers if the content is currently visible
        aria-expanded={isOpen}
        // Link the button to the content it controls
        aria-controls="accordion-content"
      >
        {title}
      </button>
      
      <div 
        id="accordion-content"
        // Hide from screen readers when closed
        aria-hidden={!isOpen}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {children}
      </div>
    </div>
  );
}

// For dynamic notifications (Toasts):
// <div aria-live="polite">Item added to cart!</div>`
  },
  {
    slug: "visual-accessibility",
    title: "Color Contrast & Visuals",
    tags: ["Color contrast", "Focus indicators"],
    description: "Designing for users with varying levels of vision impairment, color blindness, or simply users in bright sunlight.",
    insights: "WHEN TO USE: During the CSS/design phase. WHY: Text must have a minimum contrast ratio of 4.5:1 against its background (WCAG AA). Never remove the CSS 'outline' property without providing a custom visual focus state.",
    code: `/* ❌ BAD: Removing focus outlines completely */
button:focus {
  outline: none;
}

/* ✅ GOOD: Custom high-contrast focus rings */
button:focus-visible {
  outline: none;
  /* Use a clear, high-contrast ring for keyboard users */
  box-shadow: 0 0 0 3px #050505, 0 0 0 6px #6366f1;
}

/* Color Contrast Example */
.bad-text {
  background: #ffffff;
  color: #ccc; /* Fails contrast ratio! Unreadable */
}

.good-text {
  background: #ffffff;
  color: #333333; /* Passes 4.5:1 contrast ratio */
}`
  },
  {
    slug: "complex-components",
    title: "Forms & Modals",
    tags: ["Form accessibility", "Modal accessibility"],
    description: "The hardest parts of accessibility: ensuring complex user inputs and breaking-out-of-flow overlays are completely usable.",
    insights: "WHEN TO USE: Every single form and modal. WHY: Forms need explicit <label> associations so screen readers announce what the input is for. Modals MUST trap focus inside them so keyboard users don't accidentally navigate the hidden background page.",
    code: `// Accessible Form Field
export function AccessibleInput({ error }) {
  return (
    <div>
      {/* 1. Explicitly link the label to the input using htmlFor/id */}
      <label htmlFor="email-input">Email Address</label>
      
      <input 
        id="email-input"
        type="email"
        // 2. Link the input to its error message
        aria-describedby={error ? "email-error" : undefined}
        // 3. Mark as invalid for screen readers if there's an error
        aria-invalid={!!error}
      />
      
      {error && (
        <span id="email-error" style={{ color: 'red' }}>
          {error}
        </span>
      )}
    </div>
  );
}`
  }
];
