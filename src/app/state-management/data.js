export const stateTopics = [
  {
    slug: "component-state",
    title: "Component State (useState)",
    description: "The most basic form of state in React. Used for simple, localized data that only belongs to a single component (like toggling a modal or tracking an input value).",
    code: `import { useState } from 'react';

export const SimpleCounter = () => {
  // Local state that no other component cares about
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Modal</button>
      {isOpen && <div className="modal">I am open!</div>}
    </div>
  );
};`,
    insights: "Keep state as local as possible. Do not lift state to Redux or Context if it's only used by a single component or its immediate children. A major modern skill is knowing when NOT to use Redux/Context."
  },
  {
    slug: "complex-local-state",
    title: "Complex Local State (useReducer)",
    description: "Used when state transitions are complex, involve multiple sub-values, or when the next state depends heavily on the previous state.",
    code: `import { useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return { username: '', email: '' };
    default:
      return state;
  }
};

export const ComplexForm = () => {
  const [state, dispatch] = useReducer(formReducer, { username: '', email: '' });
  
  return (
    <input 
      value={state.username} 
      onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'username', value: e.target.value })} 
    />
  );
};`,
    insights: "If you find yourself calling multiple `useState` setters in a single handler (e.g., setFetching(false); setData(result); setError(null);), it's a strong sign you should refactor to `useReducer` to naturally batch updates and maintain state consistency."
  },
  {
    slug: "shared-ui-state",
    title: "Shared UI State (Context API)",
    description: "Ideal for low-frequency updates that many components across the tree need to read. Think theming, user authentication, or language preferences.",
    code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Any nested component can read it
const ThemedButton = () => {
  const { theme } = useContext(ThemeContext);
  return <button className={\`btn-\${theme}\`}>Click me</button>;
};`,
    insights: "Context is NOT a state management tool; it's a dependency injection tool. Do not use Context for high-frequency updates (like mouse tracking or live sockets) because it forces every consumer to re-render whenever the value changes."
  },
  {
    slug: "server-api-state",
    title: "Server/API State (TanStack Query)",
    description: "Server state is asynchronous, cached, and shared. Libraries like TanStack (React) Query or SWR handle caching, deduplication, background fetching, and optimistic updates.",
    code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const UserProfile = ({ userId }) => {
  const queryClient = useQueryClient();
  
  // Queries handle fetching, caching, and loading states
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(\`/api/users/\${userId}\`).then(res => res.json())
  });

  // Mutations handle updates and cache invalidation
  const updateName = useMutation({
    mutationFn: (newName) => fetch(\`/api/users/\${userId}\`, { method: 'POST', body: newName }),
    onSuccess: () => queryClient.invalidateQueries(['user', userId]) // refetch!
  });

  if (isLoading) return <Spinner />;
  return <div>{data.name}</div>;
};`,
    insights: "Historically, developers stored API data in Redux. Modern React development moves API data out of global client state and into specialized Server State tools (like React Query), drastically reducing Redux boilerplate and solving caching automatically."
  },
  {
    slug: "large-client-state",
    title: "Large Client State (Zustand / Redux)",
    description: "For complex, globally shared state that updates frequently or requires strict architecture. Zustand is the modern lightweight standard, while Redux Toolkit remains heavy-duty.",
    code: `// Zustand example (No providers, incredibly simple)
import { create } from 'zustand';

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export const BearCounter = () => {
  // Only re-renders if 'bears' changes!
  const bears = useBearStore((state) => state.bears);
  const increase = useBearStore((state) => state.increasePopulation);
  
  return <button onClick={increase}>{bears} Bears</button>;
};`,
    insights: "Only use global state when absolutely necessary. By separating Server State (React Query) and URL State (Router), you'll often find your app barely needs global client state at all. When you do need it, prefer modern, unopinionated tools like Zustand over legacy Redux."
  },
  {
    slug: "url-state",
    title: "URL State (Router / Search Params)",
    description: "The most underutilized state manager. Filters, pagination, and active tabs should live in the URL so users can bookmark and share the exact state of the page.",
    code: `import { useSearchParams, useRouter } from 'next/navigation';

export const ProductFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Read state directly from the URL
  const category = searchParams.get('category') || 'all';

  const setCategory = (newCategory) => {
    // Write state back to the URL
    const params = new URLSearchParams(searchParams);
    params.set('category', newCategory);
    router.push(\`?\${params.toString()}\`);
  };

  return <button onClick={() => setCategory('shoes')}>View Shoes</button>;
};`,
    insights: "If a user refreshes the page and loses their applied filters or the currently open tab, you've chosen the wrong state manager. Always lift filter/search/sort state into the URL search parameters."
  },
  {
    slug: "form-state",
    title: "Form State (React Hook Form)",
    description: "Forms have complex requirements: validation, dirty states, touched fields, and high-frequency updates. Dedicated libraries handle this without forcing entire component re-renders.",
    code: `import { useForm } from 'react-hook-form';

export const SignupForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = data => console.log("Saved!", data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Uncontrolled inputs for massive performance gains */}
      <input {...register("firstName", { required: true })} />
      {errors.firstName && <span>First name is required</span>}
      
      <button type="submit">Sign up</button>
    </form>
  );
};`,
    insights: "Never store massive form state in Redux or Context, and avoid standard controlled `useState` inputs for large forms (100+ fields). React Hook Form uses uncontrolled inputs and refs under the hood to bypass React's render cycle during typing."
  },
  {
    slug: "persistent-state",
    title: "Persistent State (Storage APIs)",
    description: "State that must survive a browser close. Typically LocalStorage or IndexedDB, often wrapped with a state management layer for reactivity.",
    code: `import { useState, useEffect } from 'react';

// A custom hook to sync state with localStorage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    setStoredValue(value);
    if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
};`,
    insights: "When hydrating persistent state (like a dark mode toggle from localStorage) in Next.js/SSR, you must handle the mismatch between the server's initial render and the client's persisted data to avoid hydration errors. Usually, this means deferring the render of persistent state until `useEffect` mounts."
  }
];
