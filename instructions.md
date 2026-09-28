# Next.js Website Development Instructions

These instructions apply to **every change** made to this project.

The project uses **Next.js App Router with JavaScript**, not TypeScript. AI models are expected to follow these standards when generating, modifying, reviewing, or refactoring code.

The primary goals are:

* Excellent Core Web Vitals
* Fast initial page load
* Strong SEO
* WCAG 2.2 AA accessibility
* Secure implementation
* Minimal client-side JavaScript
* Clean and maintainable architecture
* Reusable components
* Simple, predictable code
* Minimal unnecessary dependencies
* Production-ready implementation

---

## 1. Technology Rules

* Use **JavaScript only**.
* Do **not** introduce TypeScript files.
* Use `.js` and `.jsx` files.
* Do not create `.ts` or `.tsx` files.
* Use the **Next.js App Router** with the `app/` directory.
* Prefer React Server Components by default.
* Add `"use client"` only when the component genuinely requires:

  * React state
  * React effects
  * event handlers
  * browser APIs
  * client-only libraries
  * interactive UI
* Do not convert Server Components into Client Components unnecessarily.
* Follow the version of Next.js already installed in the project.
* Do not upgrade Next.js, React, or major dependencies unless explicitly requested.
* Follow existing project conventions before introducing new patterns.

---

# 2. AI Coding Rules

AI models will be used heavily to develop this project. Every AI-generated change must follow these rules.

### Before modifying code

1. Inspect the relevant existing files.
2. Understand the current architecture and data flow.
3. Identify reusable components/utilities before creating new ones.
4. Check existing dependencies before installing anything.
5. Preserve existing behavior unless the requested change requires otherwise.
6. Make the smallest change that completely solves the problem.

### Do not:

* Rewrite unrelated code.
* Refactor large sections unnecessarily.
* Introduce new libraries for simple problems.
* Duplicate existing utilities/components.
* Rename existing APIs, props, routes, or form fields without a clear requirement.
* Change working functionality while fixing an unrelated issue.
* Replace established project patterns without justification.
* Create speculative abstractions.
* Add code "just in case" it may be needed later.

### After making changes

AI-generated changes should be checked for:

* Build errors
* ESLint errors
* Runtime errors
* Accessibility problems
* SEO regressions
* Core Web Vitals impact
* Unused imports
* Unused variables
* Dead code
* Duplicate logic
* Unnecessary client-side JavaScript
* Incorrect loading/error states

---

# 3. Project Architecture

Use a clear and predictable App Router structure.

Prefer:

```text
app/
  layout.js
  page.js
  loading.js
  error.js
  not-found.js

  products/
    page.js
    [slug]/
      page.js
      loading.js
      error.js

components/
  common/
  layout/
  ui/

lib/
  api/
  utils/
  validations/

services/

public/

styles/
```

Use route groups when appropriate:

```text
app/
  (marketing)/
  (shop)/
  (account)/
```

Route groups should be used to organize shared layouts without changing public URLs.

Keep related components, utilities, styles, and tests close to the feature when that improves maintainability.

---

# 4. Server Components First

Server Components are the default.

Prefer:

```jsx
export default async function ProductPage() {
  const product = await getProduct();

  return <ProductDetails product={product} />;
}
```

Instead of unnecessarily fetching the same data from the browser.

Use Client Components only for actual client-side requirements.

For example:

```jsx
"use client";

import { useState } from "react";

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  return (
    // ...
  );
}
```

Do not add `"use client"` to parent components simply because a small child component needs interactivity.

Keep interactive functionality isolated in the smallest possible Client Component.

---

# 5. Data Fetching

Prefer server-side data fetching whenever possible.

Use:

* Server Components
* Server Actions where appropriate
* Route Handlers where appropriate
* ISR/SSG for cacheable content
* React Suspense for progressive rendering

Avoid unnecessary:

```text
Server → Browser → API → Server
```

when the data can be obtained directly on the server.

Avoid fetching the same data multiple times.

Create shared server-side data functions when multiple components need the same resource.

Never expose:

* API secrets
* private API keys
* database credentials
* authentication secrets
* internal tokens

to the browser.

---

# 6. Rendering Strategy

Choose the rendering strategy based on the data requirements.

### Prefer Static Generation / ISR

Use static rendering for:

* Marketing pages
* Product/category content that does not need per-request freshness
* Blog pages
* Documentation
* Public informational pages

Use ISR when content changes periodically.

### Use Dynamic Rendering only when necessary

Use dynamic rendering when content genuinely depends on:

* authenticated user
* request headers
* cookies
* rapidly changing private data
* per-request personalization

Do not make an entire route dynamic when only a small section requires dynamic behavior.

---

# 7. Loading, Streaming and Error Handling

Every important route should have appropriate loading and error states.

Use:

```text
loading.js
error.js
not-found.js
```

where appropriate.

Prefer Suspense boundaries for independently loading sections.

Do not show a completely blank page while waiting for slow content.

Loading UI should:

* Reserve layout space
* Match the final content structure
* Avoid unnecessary animation
* Respect `prefers-reduced-motion`

Error states should:

* Explain what happened clearly
* Provide a useful recovery action
* Avoid exposing internal errors or sensitive information

---

# 8. Performance and Core Web Vitals

Performance is a first-class requirement.

Optimize specifically for:

* LCP
* CLS
* INP
* TTFB

## LCP

The primary above-the-fold content must render as quickly as possible.

For important hero images:

* Use `next/image`
* Provide correct dimensions
* Use an accurate `sizes` attribute
* Use `priority` only for genuinely critical images
* Do not mark every image as priority

Avoid loading large carousels, videos, or third-party scripts before the main content.

## CLS

Prevent layout shifts by reserving space for:

* Images
* Videos
* Iframes
* Banners
* Dynamic components
* Fonts
* Advertisements

Use explicit dimensions or `aspect-ratio`.

Do not insert content above already-rendered content unless space has been reserved.

## INP

Keep client-side JavaScript small.

Avoid:

* unnecessary state
* unnecessary effects
* large client components
* expensive event handlers
* unnecessary re-renders
* large third-party libraries

Use dynamic imports for heavy interactive components that are not required immediately.

---

# 9. JavaScript Bundle Rules

The default goal is to send as little JavaScript to the browser as possible.

Before adding `"use client"` ask:

> Can this functionality remain on the server?

Before adding a dependency ask:

> Can this be implemented using existing project functionality or native browser/Next.js APIs?

Avoid large libraries for simple functionality.

Prefer:

* Native browser APIs
* Next.js APIs
* React APIs
* Existing project utilities

Analyze bundle impact when adding significant dependencies.

---

# 10. Images and Media

Always prefer `next/image` for application images unless there is a specific reason not to.

For every image:

* Define appropriate dimensions or aspect ratio.
* Use meaningful `alt` text for informative images.
* Use `alt=""` for decorative images.
* Use responsive `sizes`.
* Avoid loading unnecessarily large source images.
* Lazy-load below-the-fold images.
* Prioritize only critical above-the-fold images.

Do not use background images when a semantic image is more appropriate.

Optimize:

* image dimensions
* compression
* modern formats
* responsive delivery
* loading priority

---

# 11. Fonts

Use `next/font` whenever possible.

Avoid manually loading fonts through external CSS when Next.js font optimization can be used.

Prevent font-related layout shifts.

Only load the required font families and weights.

Do not load unnecessary font variants.

---

# 12. SEO

Every indexable page must have appropriate metadata.

Use the Next.js Metadata API.

Each page should have a unique:

* title
* meta description
* canonical URL

Also configure appropriate:

* Open Graph metadata
* Twitter/X metadata
* robots metadata where necessary

Use:

```js
export const metadata = {
  title: "Page Title",
  description: "Page description",
};
```

Use `generateMetadata()` when metadata depends on route/data.

---

# 13. SEO Content Structure

Every page should have a clear semantic structure.

Requirements:

* One primary `h1` per page.
* Logical `h2`/`h3` hierarchy.
* Semantic HTML.
* Meaningful link text.
* Important content available in initial HTML.
* Do not hide important SEO content behind unnecessary client-side rendering.

Do not use headings purely for visual styling.

Use CSS for visual appearance instead of incorrect heading levels.

---

# 14. Structured Data

Use JSON-LD when appropriate.

Examples:

* Product
* Article
* BreadcrumbList
* FAQPage
* Organization
* LocalBusiness
* WebSite

Structured data must accurately represent visible page content.

Never generate misleading or fabricated structured data.

Validate structured data before considering the implementation complete.

---

# 15. Sitemap and Robots

The project should provide:

```text
/sitemap.xml
/robots.txt
```

Use Next.js built-in metadata routes where appropriate.

Only expose URLs that should actually be crawled.

Do not allow:

* private account pages
* checkout pages
* internal tools
* sensitive routes

to be indexed.

---

# 16. URL Structure

URLs should be:

* short
* descriptive
* readable
* stable
* lowercase where appropriate

Avoid unnecessary query parameters for primary content.

Use meaningful slugs.

Do not change existing public URLs without a redirect strategy.

---

# 17. Accessibility

Target **WCAG 2.2 Level AA**.

Use semantic HTML before ARIA.

Prefer:

```html
<button>
```

instead of:

```html
<div role="button">
```

Every interactive element must be keyboard accessible.

Requirements include:

* visible focus states
* logical tab order
* keyboard navigation
* sufficient color contrast
* accessible form controls
* meaningful labels
* accessible error messages
* appropriate heading hierarchy
* accessible dialogs/modals
* accessible menus
* reduced-motion support

Every form control must have an accessible label.

Do not use placeholder text as the only label.

Images must have appropriate `alt` attributes.

---

# 18. Forms and Validation

Treat all input as untrusted.

Validate on:

1. Client
2. Server

Client validation is for user experience.

Server validation is required for security.

Handle:

* invalid input
* missing fields
* incorrect formats
* unexpected values
* authorization failures
* API failures

Validation errors should be associated with the relevant fields.

Never trust client-provided:

* prices
* quantities
* user IDs
* roles
* permissions
* discount values
* order totals
* authentication state

---

# 19. Security

Security must be considered in every feature.

Never expose secrets through:

```text
NEXT_PUBLIC_*
```

unless the value is intentionally public.

Keep private configuration server-side.

Protect sensitive routes and mutations on the server.

Never rely exclusively on:

* hidden UI
* disabled buttons
* client-side role checks
* client-side authentication state

for authorization.

Sanitize untrusted input where necessary.

Avoid unsafe HTML rendering.

If `dangerouslySetInnerHTML` is required, sanitize the content before rendering.

---

# 20. Authentication and Authorization

Authentication and authorization are separate concerns.

Authentication determines:

> Who is the user?

Authorization determines:

> What is the user allowed to do?

Authorization must be enforced on the server.

Never assume that hiding a button prevents unauthorized access.

Sensitive API operations must independently verify:

* authentication
* authorization
* ownership/access rights
* input validity

---

# 21. API Design

Keep API logic separate from UI components.

Prefer reusable server-side functions such as:

```text
lib/
  api/
    products.js
    orders.js
    users.js
```

Components should not contain large API implementations.

Handle:

* loading
* success
* empty state
* validation failure
* authentication failure
* authorization failure
* server failure

consistently.

Do not expose internal implementation details in API error responses.

---

# 22. Component Design

Follow the **Single Responsibility Principle**.

A component should have one clear responsibility.

Avoid components that simultaneously handle:

* API calls
* complex business logic
* form validation
* state management
* UI rendering
* analytics
* navigation

Extract reusable logic into appropriate utilities/hooks/services.

Prefer composition over deeply nested conditional components.

---

# 23. DRY — But Do Not Over-Abbreviate

Reuse genuinely shared logic.

Do not duplicate:

* API logic
* validation
* formatting
* common UI
* business rules

However, do not create abstractions simply to eliminate a few repeated lines.

The goal is:

> Reusable where useful, simple where possible.

---

# 24. Styling

Use the project's chosen styling system consistently.

Do not introduce multiple styling approaches without a clear reason.

Avoid unnecessary global CSS.

Prefer component-scoped styles.

Do not use inline styles for large or reusable styling systems.

Ensure responsive behavior across:

* mobile
* tablet
* desktop
* large screens

Do not sacrifice accessibility or performance for visual effects.

---

# 25. Responsive Design

Use a mobile-first approach where practical.

UI should work correctly across common viewport sizes.

Avoid:

* fixed widths that cause overflow
* unnecessary horizontal scrolling
* viewport-dependent content that becomes unusable
* layouts that rely on a specific device size

Test important layouts at mobile and desktop widths.

---

# 26. Third-Party Scripts

Third-party scripts can significantly affect performance.

Load them only when necessary.

Prefer Next.js `Script` strategies appropriately.

Do not load analytics, chat widgets, advertisements, tracking pixels, or other third-party scripts before critical content unless required.

Non-critical scripts should generally load after the main page becomes usable.

Review every third-party dependency for:

* bundle impact
* privacy implications
* performance impact
* accessibility impact

---

# 27. Analytics

Analytics should never block the critical rendering path.

Analytics implementations must:

* avoid duplicate events
* avoid duplicate script initialization
* respect applicable privacy requirements
* use meaningful event names
* avoid sending sensitive information

Do not place analytics logic throughout unrelated components when a centralized approach is more appropriate.

---

# 28. Caching

Use Next.js caching intentionally.

Determine whether data should be:

* static
* revalidated
* dynamically fetched
* user-specific

Do not disable caching globally simply to solve one stale-data problem.

When data changes, use appropriate revalidation/invalidation rather than unnecessarily converting the entire application to dynamic rendering.

---

# 29. Error and Empty States

Every data-driven UI should consider:

### Loading

What does the user see while data is loading?

### Empty

What happens when the API returns no data?

### Error

What happens when the API fails?

### Unauthorized

What happens when the user is not permitted?

### Not Found

What happens when the requested resource does not exist?

Do not leave users with blank screens.

---

# 30. Performance Budgets

Treat performance regressions as bugs.

When adding a feature, consider:

* JavaScript bundle size
* number of client components
* number of network requests
* image payload
* font payload
* third-party scripts
* rendering strategy
* cacheability

Do not optimize prematurely, but do not knowingly introduce unnecessary performance costs.

---

# 31. Dependencies

Before installing a package:

1. Check whether the functionality already exists in Next.js, React, or the project.
2. Check whether an existing dependency can solve the problem.
3. Consider bundle size and maintenance cost.
4. Check compatibility with the installed Next.js/React version.
5. Add the dependency only when its benefits justify the additional complexity.

Avoid dependency proliferation.

---

# 32. Environment Variables

Use environment variables for configuration.

Public variables:

```text
NEXT_PUBLIC_*
```

must contain only values that are safe to expose to browsers.

Private values must remain server-side.

Never commit:

* API secrets
* database passwords
* private keys
* authentication secrets
* production credentials

---

# 33. Code Quality

Keep code:

* readable
* predictable
* concise
* modular
* maintainable

Avoid:

* unnecessary nesting
* overly clever abstractions
* giant components
* duplicated business logic
* magic numbers
* unexplained workarounds
* dead code
* unused imports
* unused dependencies
* console logs in production code

Use clear variable and function names.

Prefer early returns when they improve readability.

---

# 34. Comments

Write comments only when they explain **why** something is necessary.

Avoid comments that simply repeat what the code already says.

Good:

```js
// Keep this request server-side because the API key must never reach the browser.
```

Avoid:

```js
// Call API
const data = await getData();
```

Remove obsolete comments when modifying code.

---

# 35. Testing

Important functionality should be testable.

Prioritize tests for:

* authentication
* authorization
* API behavior
* validation
* business logic
* forms
* important user flows
* critical UI interactions

Do not add tests that provide little value simply to increase coverage numbers.

---

# 36. Browser and Accessibility Testing

For important UI changes, verify:

* keyboard navigation
* focus behavior
* responsive layouts
* screen-reader semantics
* loading states
* error states
* empty states
* mobile behavior

When possible, test with:

* Chrome
* Safari
* mobile viewport
* keyboard-only navigation

---

# 37. SEO + Performance Checklist Before Completion

Before completing a page or feature, verify:

### SEO

* [ ] Unique title
* [ ] Unique meta description
* [ ] Canonical URL where appropriate
* [ ] Correct heading hierarchy
* [ ] One primary H1
* [ ] Semantic HTML
* [ ] Crawlable important content
* [ ] Appropriate structured data
* [ ] Correct Open Graph metadata
* [ ] Correct robots behavior

### Performance

* [ ] Server Component used where possible
* [ ] Minimal Client Components
* [ ] Images optimized
* [ ] Correct image sizes
* [ ] Critical image prioritized only when necessary
* [ ] Fonts optimized
* [ ] Third-party scripts minimized
* [ ] No unnecessary dependencies
* [ ] No obvious CLS sources
* [ ] No unnecessary client-side requests

### Accessibility

* [ ] Keyboard accessible
* [ ] Visible focus states
* [ ] Accessible labels
* [ ] Correct semantic elements
* [ ] Meaningful alt text
* [ ] Sufficient contrast
* [ ] Reduced-motion support
* [ ] Accessible errors and dialogs

---

# 38. Change Management

When implementing a request:

1. Understand the requested behavior.
2. Inspect the relevant code.
3. Identify the smallest correct change.
4. Implement it without unrelated refactoring.
5. Preserve existing APIs and conventions.
6. Check SEO impact.
7. Check accessibility impact.
8. Check Core Web Vitals impact.
9. Check security implications.
10. Remove unused code/imports created during the change.
11. Verify the final implementation.

If a requested implementation conflicts with these standards, prefer the standards unless the requirement explicitly overrides them.

---

# 39. AI Implementation Output

When an AI model implements a task:

* Explain what files need to change before making a large architectural change.
* Prefer complete, production-ready implementations over pseudo-code.
* Reuse existing utilities and components.
* Do not invent APIs, fields, endpoints, or dependencies.
* If required information is missing, clearly identify it rather than guessing.
* Preserve existing naming conventions.
* Keep changes focused on the requested task.
* Mention important trade-offs when they affect performance, SEO, accessibility, or security.
* Do not claim that a change was tested if it was not actually tested.

The AI should behave like a senior Next.js engineer working inside an existing production codebase.

---

# 40. Primary Engineering Principle

For every implementation, prioritize:

**Correctness → Security → Accessibility → Performance → SEO → Maintainability → Developer convenience**

Do not optimize for fewer lines of code at the expense of clarity or reliability.

The final implementation should be:

**Simple, secure, accessible, performant, SEO-friendly, maintainable, and production-ready.**
