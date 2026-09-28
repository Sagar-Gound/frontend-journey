export const architectureTopics = [
  {
    slug: "feature-based-architecture",
    title: "Feature-based Architecture",
    description: "Organizing code by feature domain (e.g., auth, products) instead of technical type (e.g., components, hooks). This keeps related code collocated and scales well for large teams.",
    code: `// src/features/auth/index.js
// A feature module acts as a public API boundary.
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
export { loginService } from './services/loginService';

// DO NOT export internals like utils or sub-components.
`,
    insights: "In enterprise apps, a flat 'components' or 'hooks' folder becomes an unmaintainable dumping ground. Feature folders isolate domains. When you delete a feature, you just delete its folder without hunting down loose files."
  },
  {
    slug: "separation-of-concerns-srp",
    title: "Separation of Concerns & SRP",
    description: "The Single Responsibility Principle (SRP) dictates that a component or function should do exactly one thing. Separation of Concerns means splitting logic, markup, and styles.",
    code: `// BAD: UI, state, and fetching all mixed
const UserProfile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('/api/user').then(...) }, []);
  return <div>{user.name}</div>;
}

// GOOD: Separated concerns
const useUser = () => { /* custom hook for fetching */ }
const UserProfileUI = ({ user }) => <div>{user.name}</div>

const UserProfile = () => {
  const { user } = useUser();
  return <UserProfileUI user={user} />;
}`,
    insights: "Massive components are hard to test and reuse. Extracting data fetching into hooks and keeping UI components 'dumb' (presentation only) drastically improves testability and reusability across the application."
  },
  {
    slug: "dry-principle",
    title: "Don't Repeat Yourself (DRY)",
    description: "Avoid duplicating logic or UI code. Abstract repeated patterns into reusable hooks, utility functions, or generic components.",
    code: `// Abstracting a repeated API fetch pattern
export const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [url]);

  return { data, loading };
};`,
    insights: "While DRY is crucial, beware of 'premature abstraction'. Sometimes slightly duplicating code is better than creating a highly complex, generic abstraction that is difficult to read and maintain. DRY should reduce maintenance cost, not increase cognitive load."
  },
  {
    slug: "dependency-inversion",
    title: "Dependency Inversion",
    description: "High-level modules should not depend on low-level modules; both should depend on abstractions. In React, this often means passing dependencies (like API services) via Context or props rather than hardcoding imports.",
    code: `import { createContext, useContext } from 'react';

// The abstraction
const ApiContext = createContext(null);

// High-level component depends on the abstraction
const ProductList = () => {
  const api = useContext(ApiContext);
  // use api.fetchProducts()...
};

// Injection at the top level
<ApiContext.Provider value={mockApiForTesting}>
  <ProductList />
</ApiContext.Provider>`,
    insights: "This pattern is a lifesaver for testing. Instead of mocking fetch globally, you can simply inject a mock API service via context when testing the `ProductList` component, ensuring isolated, predictable tests."
  },
  {
    slug: "compound-components",
    title: "Compound Components",
    description: "A pattern where multiple components work together to form a cohesive UI, sharing implicit state behind the scenes (often via Context). Think <select> and <option>.",
    code: `import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export const Tabs = ({ children }) => {
  const [active, setActive] = useState(0);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
};

export const TabList = ({ children }) => <div className="tab-list">{children}</div>;

export const Tab = ({ index, children }) => {
  const { active, setActive } = useContext(TabsContext);
  return <button onClick={() => setActive(index)} className={active === index ? 'active' : ''}>{children}</button>;
};`,
    insights: "Compound components provide massive flexibility for consumers. Instead of passing a gigantic 'configuration object' prop to a single <Tabs /> component, the consumer can arrange the Tab, TabList, and Panels in whatever HTML structure they want."
  },
  {
    slug: "render-props",
    title: "Render Props",
    description: "A technique for sharing code by passing a function as a prop to a component, which the component calls to render its content.",
    code: `const MouseTracker = ({ render }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })} style={{ height: '100vh' }}>
      {render(pos)}
    </div>
  );
};

// Usage:
<MouseTracker render={({ x, y }) => <h1>Mouse is at {x}, {y}</h1>} />`,
    insights: "While Custom Hooks have largely replaced Render Props for logic sharing, Render Props are still exceptionally powerful for UI inversion of control, like providing a custom renderer for a list item in a generic VirtualizedList component."
  },
  {
    slug: "headless-components",
    title: "Headless Components",
    description: "Components or hooks that provide complex state management and behavior but zero UI, leaving all rendering decisions to the consumer.",
    code: `// A headless hook for a dropdown
export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getToggleProps = () => ({
    onClick: () => setIsOpen(!isOpen),
    'aria-expanded': isOpen
  });

  const getMenuProps = () => ({
    role: 'menu',
    hidden: !isOpen
  });

  return { isOpen, getToggleProps, getMenuProps };
};`,
    insights: "Headless architecture (like React Table or Downshift) is the ultimate form of reusability. By separating behavior completely from presentation, your complex logic can be reused across vastly different UI designs and CSS frameworks."
  },
  {
    slug: "container-presentation",
    title: "Container & Presentation Separation",
    description: "Separating 'Smart' components (Containers: fetch data, manage state) from 'Dumb' components (Presentation: pure UI, driven by props).",
    code: `// 1. Presentation Component (Pure UI)
export const ProductCard = ({ title, price, onBuy }) => (
  <div className="card">
    <h3>{title}</h3>
    <p>\${price}</p>
    <button onClick={onBuy}>Buy</button>
  </div>
);

// 2. Container Component (Logic)
export const ProductContainer = ({ productId }) => {
  const { data, loading } = useFetch(\`/api/products/\${productId}\`);
  const handleBuy = () => checkout(data);
  
  if (loading) return <Spinner />;
  return <ProductCard title={data.title} price={data.price} onBuy={handleBuy} />;
};`,
    insights: "This pattern forces you to build UI components that don't depend on the network or app state. You can easily dump Presentation components into Storybook for designers, while unit testing the logic in Containers separately."
  },
  {
    slug: "design-systems",
    title: "Design Systems",
    description: "A centralized set of design tokens (colors, spacing, typography) and highly reusable, strictly governed core UI components.",
    code: `// Design System Button
import { tokens } from '@theme/tokens';

export const Button = ({ variant = 'primary', size = 'md', children }) => {
  const styles = {
    backgroundColor: variant === 'primary' ? tokens.colors.blue500 : tokens.colors.gray200,
    padding: size === 'md' ? tokens.spacing.md : tokens.spacing.sm,
    borderRadius: tokens.radii.base
  };
  return <button style={styles}>{children}</button>;
};`,
    insights: "A strong design system enforces consistency and accelerates development. By restricting arbitrary CSS values (magic numbers) and using standardized tokens, teams can redesign or theme entire applications without changing component logic."
  }
];
