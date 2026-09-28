export const topics = [
  {
    slug: "fundamentals",
    title: "TypeScript Fundamentals",
    tags: ["type", "interface", "union", "intersection"],
    description: "The core building blocks of TypeScript. Understand when to use 'type' vs 'interface', and how to combine types using unions and intersections.",
    insights: "In modern React, prefer 'type' for components and props as it plays nicer with unions and complex types, while 'interface' is slightly better for declaring global object shapes or classes.",
    code: `// Interfaces are great for object shapes
interface User {
  id: string;
  name: string;
}

// Types can do everything interfaces can, plus unions/intersections
type Status = 'pending' | 'success' | 'error';

type Admin = User & {
  role: 'admin';
  permissions: string[];
};

const user: Admin = {
  id: '1',
  name: 'John',
  role: 'admin',
  permissions: ['delete_users']
};`
  },
  {
    slug: "advanced-types",
    title: "Advanced Types",
    tags: ["generics", "utility types", "conditional types", "mapped types", "keyof", "typeof", "infer"],
    description: "Advanced type manipulations that allow you to build highly reusable, dynamic, and strictly typed utilities.",
    insights: "Generics <T> act as variables for types. Master 'keyof typeof' to extract types directly from runtime objects or configurations, keeping your type definitions perfectly synced with your code.",
    code: `// Extracting type from a configuration object
const THEME_COLORS = {
  primary: '#3178c6',
  secondary: '#76b1f2',
  danger: '#ff5252'
} as const;

// type ThemeColor = 'primary' | 'secondary' | 'danger'
type ThemeColor = keyof typeof THEME_COLORS;

// Generic wrapper with Utility Types
type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
};`
  },
  {
    slug: "type-narrowing",
    title: "Type Narrowing",
    tags: ["type guards", "discriminated unions"],
    description: "Techniques for refining types at runtime. Crucial for safely extracting values from unions.",
    insights: "Discriminated unions (using a common literal property like 'status' or 'type' across union members) are the absolute best way to model state machines in React (e.g., loading, error, success states).",
    code: `// The Discriminated Union pattern
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function DataRenderer({ state }: { state: AsyncState<string[]> }) {
  // TypeScript narrows the type based on the 'status' discriminant
  switch (state.status) {
    case 'idle':
      return <div>Ready to fetch</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'error':
      return <div style={{ color: 'red' }}>{state.error.message}</div>;
    case 'success':
      // state.data is safely accessed here!
      return <ul>{state.data.map(item => <li key={item}>{item}</li>)}</ul>;
  }
}`
  },
  {
    slug: "practical-patterns",
    title: "Practical Patterns",
    tags: ["Generic Responses", "Reusability"],
    description: "Building robust type signatures for your data layer.",
    insights: "Use generic wrappers for API responses so you don't duplicate success/error properties.",
    code: `type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
};

// Usage: Fetching an array of products
async function fetchProducts(): Promise<ApiResponse<Product[]>> {
  const res = await fetch('/api/products');
  return await res.json();
}`
  },
  {
    slug: "react-ecosystem",
    title: "React Ecosystem Typing",
    tags: ["Hooks", "Context", "Components", "Events", "Forms", "API responses"],
    description: "Typing native React concepts. You should deeply understand how to strongly type props, state, refs, DOM events, and Context providers.",
    insights: "Always type your 'children' prop using 'React.ReactNode'. For form events, use 'React.FormEvent<HTMLFormElement>' and for inputs use 'React.ChangeEvent<HTMLInputElement>'.",
    code: `import React, { useState, useRef } from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  onSubmit: (data: string) => void;
};

export const CustomForm = ({ title, children, onSubmit }: Props) => {
  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
    // Safe ref access
    inputRef.current?.focus(); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <input 
        ref={inputRef}
        value={value} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} 
      />
      {children}
    </form>
  );
};`
  },
  {
    slug: "external-libraries",
    title: "Typing State & Data Fetching",
    tags: ["React Query", "Redux/Zustand", "Server actions"],
    description: "Applying TypeScript to complex state management and server communication.",
    insights: "With React Query, type the fetcher function's return value, and the hook will automatically infer the data type. For Server Actions, ensure your arguments and return types are strictly defined to guarantee safety across the network boundary.",
    code: `// Zustand Store Typing
import { create } from 'zustand';

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));

// React Query Typing
import { useQuery } from '@tanstack/react-query';

async function fetchUser(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}

function UserProfile({ id }: { id: number }) {
  // 'data' is automatically inferred as 'User | undefined'
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id)
  });
}`
  }
];
