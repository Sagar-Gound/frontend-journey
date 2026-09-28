export const topics = [
  {
    slug: "components-and-composition",
    title: "Components and Composition",
    description: "The core building blocks of React. Composition allows building complex UIs from simple, isolated pieces by passing components as children.",
    code: `// Composition prevents unnecessary re-renders of the heavy list
const TableWrapper = ({ children, title }) => (
  <div className="wrapper">
    <h2>{title}</h2>
    {children}
  </div>
);

export const App = () => (
  <TableWrapper title="Massive Data">
    <div className="virtualized-list-mock">
       {/* List of 10,000 items rendered efficiently */}
       <div>Row 1</div>
       <div>Row 2</div>
       <div>Row 3</div>
    </div>
  </TableWrapper>
);`,
    insights: "With large data sets, use composition (the `children` prop) to wrap heavy components. If the parent `TableWrapper` state changes, it won't force the children to re-render because `children` is treated as a stable reference."
  },
  {
    slug: "props-state",
    title: "Props / State",
    description: "Props pass data downwards. State is local to a component and mutable.",
    code: `import { useState } from 'react';

export const DataRow = ({ rowData = { id: 'Row 1', data: 'Hidden Payload' } }) => {
  // Local state for UI interactions (good)
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      style={{ padding: 10, border: '1px solid #333', cursor: 'pointer' }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <strong>{rowData.id}</strong>
      {isExpanded && <div>Data: {rowData.data}</div>}
    </div>
  );
};`,
    insights: "For massive lists, never duplicate props into state unless editing is required and needs an isolated draft. Passing large objects as props is cheap, but duplicating them into state multiplies memory usage and causes synchronization bugs."
  },
  {
    slug: "controlled-vs-uncontrolled",
    title: "Controlled vs Uncontrolled",
    description: "Controlled components sync their value with React state. Uncontrolled components keep their own internal state, accessible via refs.",
    code: `import { useRef, useState } from 'react';

export const UncontrolledForm = () => {
  const inputRef = useRef(null);
  const [savedValue, setSavedValue] = useState("");

  const handleSave = () => {
    setSavedValue(inputRef.current.value);
  };

  return (
    <div>
      <input ref={inputRef} defaultValue="Initial data..." style={{ padding: '8px' }} />
      <button onClick={handleSave} style={{ marginLeft: '8px', padding: '8px' }}>Save</button>
      {savedValue && <div style={{ marginTop: '10px' }}>Saved: {savedValue}</div>}
    </div>
  );
};`,
    insights: "In a data grid with thousands of editable cells, controlled components trigger a re-render of the cell (and often the row or grid) on every keystroke. Use uncontrolled components (refs) to bypass the render cycle until the data is actually saved."
  },
  {
    slug: "hooks-foundations",
    title: "useState, useEffect, useRef",
    description: "The foundational hooks. State triggers renders, Effect handles side-effects, Ref holds mutable references without rendering.",
    code: `import { useState, useEffect, useRef } from 'react';

export const HooksDemo = () => {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
  }); // Runs every render

  return (
    <div>
      <p>Count (State): {count}</p>
      <p>Component Rendered (Ref): {renderCount.current} times</p>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '8px' }}>Increment</button>
    </div>
  );
};`,
    insights: "Avoid using `useEffect` to transform large datasets (derive it during render instead). Use `useRef` to store large datasets or DOM measurements (like scroll position) that update frequently but shouldn't trigger visual updates."
  },
  {
    slug: "memoization",
    title: "useMemo, useCallback",
    description: "Hooks for memoization. `useMemo` caches a calculated value. `useCallback` caches a function reference.",
    code: `import { useState, useMemo, useCallback } from 'react';

export const MemoDemo = () => {
  const [filter, setFilter] = useState("");
  const [toggle, setToggle] = useState(false);
  
  const massiveArray = useMemo(() => Array.from({length: 1000}, (_, i) => \`Item \${i}\`), []);

  const filtered = useMemo(() => {
    console.log("Filtering array..."); // Only runs when filter changes
    return massiveArray.filter(i => i.includes(filter));
  }, [filter, massiveArray]);

  const handleItemClick = useCallback((item) => {
    alert('Clicked ' + item);
  }, []);

  return (
    <div>
      <input placeholder="Filter..." value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px' }} />
      <button onClick={() => setToggle(!toggle)} style={{ marginLeft: '8px', padding: '8px' }}>Toggle Re-render</button>
      <div style={{ marginTop: '10px', height: '100px', overflowY: 'auto', border: '1px solid #333' }}>
        {filtered.slice(0, 10).map(item => <div key={item} onClick={() => handleItemClick(item)}>{item}</div>)}
      </div>
    </div>
  );
};`,
    insights: "Crucial for large datasets. Without `useMemo`, filtering a 100k array happens on every render. Without `useCallback`, passing an inline function to a `React.memo` wrapped row component breaks the memoization, causing all rows to re-render."
  },
  {
    slug: "usereducer",
    title: "useReducer",
    description: "An alternative to useState for complex state logic, similar to Redux.",
    code: `import { useReducer } from 'react';

const initialState = { page: 1, sortBy: 'name' };
const reducer = (state, action) => {
  switch (action.type) {
    case 'NEXT_PAGE': return { ...state, page: state.page + 1 };
    case 'SORT': return { ...state, sortBy: action.payload };
    default: return state;
  }
};

export const ReducerDemo = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <p>Page: {state.page} | Sort by: {state.sortBy}</p>
      <button onClick={() => dispatch({ type: 'NEXT_PAGE' })} style={{ padding: '8px' }}>Next Page</button>
      <button onClick={() => dispatch({ type: 'SORT', payload: 'date' })} style={{ padding: '8px', marginLeft: '8px' }}>Sort Date</button>
    </div>
  );
};`,
    insights: "For complex data tables (sorting, filtering, pagination), `useReducer` centralizes state transitions and naturally batches updates. Don't store the raw massive dataset in the reducer state if it's static; only store the UI configuration state."
  },
  {
    slug: "context-api",
    title: "Context API",
    description: "Provides a way to pass data through the component tree without prop drilling.",
    code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const ThemedText = () => {
  const theme = useContext(ThemeContext);
  return <div style={{ color: theme === 'dark' ? '#61dafb' : '#fff' }}>I react to theme!</div>;
};

export const ContextDemo = () => {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{ padding: '8px', marginBottom: '10px' }}>
        Toggle Theme
      </button>
      <ThemedText />
    </ThemeContext.Provider>
  );
};`,
    insights: "DO NOT put high-frequency changing large data in Context. Every component consuming the context re-renders when the value changes. Split contexts (e.g., `DataContext` vs `DispatchContext`) or use state libraries like Zustand for large data grids."
  },
  {
    slug: "custom-hooks",
    title: "Custom Hooks",
    description: "Extract component logic into reusable functions.",
    code: `import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

export const CustomHookDemo = () => {
  const width = useWindowWidth();
  return <div>Current Window Width: {width}px</div>;
};`,
    insights: "Extract complex logic (like virtualization, infinite scrolling, or web worker communication for massive datasets) into custom hooks. This keeps the component clean and makes the heavy logic highly testable and reusable."
  },
  {
    slug: "component-lifecycle",
    title: "Component Lifecycle",
    description: "Mounting, updating, and unmounting, managed via `useEffect` in functional components.",
    code: `import { useState, useEffect } from 'react';

export const LifecycleDemo = () => {
  const [show, setShow] = useState(false);

  const Child = () => {
    useEffect(() => {
      console.log("Child Mounted");
      return () => console.log("Child Unmounted"); // Cleanup
    }, []);
    return <div style={{ marginTop: '10px', color: '#ffa500' }}>I am alive!</div>;
  };

  return (
    <div>
      <button onClick={() => setShow(!show)} style={{ padding: '8px' }}>Toggle Child Mount</button>
      {show && <Child />}
    </div>
  );
};`,
    insights: "When dealing with heavy data fetching or web workers, cleanup functions are mandatory. Failing to abort fetch requests or terminate workers when a heavy component unmounts will cause severe memory leaks and UI freezing."
  },
  {
    slug: "reconciliation",
    title: "Reconciliation and Rendering",
    description: "React's algorithm to diff the Virtual DOM and update the real DOM.",
    code: `import React, { useState } from 'react';

const HeavyRow = React.memo(({ item }) => {
  console.log("Rendering Row", item);
  return <div style={{ padding: '4px', borderBottom: '1px solid #333' }}>{item}</div>;
});

export const ReconciliationDemo = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '8px', marginBottom: '10px' }}>
        Increment Parent ({count})
      </button>
      {/* HeavyRow won't re-render when Parent count changes! */}
      <HeavyRow item="I am memoized, check console!" />
    </div>
  );
};`,
    insights: "React's diffing is fast, but diffing a 10,000-node tree is still slow. If state changes at the top level, React visits every child. Use `React.memo` and keep your Virtual DOM shallow (e.g., via virtualization) to skip unnecessary reconciliation."
  },
  {
    slug: "keys",
    title: "Keys",
    description: "Special string attributes to identify elements in lists during reconciliation.",
    code: `import { useState } from 'react';

export const KeysDemo = () => {
  const [items, setItems] = useState([{ id: 'A' }, { id: 'B' }, { id: 'C' }]);
  
  const reverseList = () => {
    setItems([...items].reverse());
  };

  return (
    <div>
      <button onClick={reverseList} style={{ padding: '8px', marginBottom: '10px' }}>Reverse Order</button>
      <div>
        {items.map(item => (
          <div key={item.id} style={{ padding: '5px' }}>
            {item.id} - <input placeholder="Type here..." style={{ padding: '4px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};`,
    insights: "If you use array indices as keys in a sorted/filtered large dataset, React misidentifies elements. This destroys and recreates DOM nodes (extremely slow) and mixes up component state. Always use unique identifiers."
  },
  {
    slug: "state-preservation",
    title: "State Preservation/Resetting",
    description: "React associates state with a component's position in the tree. Changing the key resets the state.",
    code: `import { useState } from 'react';

const FormInstance = () => {
  const [draft, setDraft] = useState('');
  return <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type draft..." style={{ padding: '8px' }}/>;
};

export const StateResetDemo = () => {
  const [recordId, setRecordId] = useState(1);
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setRecordId(1)} style={{ padding: '8px', marginRight: '5px' }}>Record 1</button>
        <button onClick={() => setRecordId(2)} style={{ padding: '8px' }}>Record 2</button>
      </div>
      <p>Editing Record: {recordId}</p>
      {/* Changing the key unmounts and remounts the component, fully resetting state */}
      <FormInstance key={recordId} />
    </div>
  );
};`,
    insights: "Instead of manually resetting 20 different `useState` variables when a user switches to edit a different record in a massive form, just change the `key` prop on the form component. React instantly unmounts the old instance and mounts a fresh one."
  },
  {
    slug: "error-boundaries",
    title: "Error Boundaries",
    description: "Catch JS errors anywhere in their child component tree, log them, and display a fallback UI.",
    code: `import React, { useState } from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{ color: 'red' }}>Error caught!</div>;
    return this.props.children;
  }
}

const BuggyComponent = ({ crash }) => {
  if (crash) throw new Error("I crashed!");
  return <div>I am working perfectly.</div>;
};

export const ErrorBoundaryDemo = () => {
  const [crash, setCrash] = useState(false);
  return (
    <ErrorBoundary>
      <button onClick={() => setCrash(true)} style={{ padding: '8px', marginBottom: '10px' }}>Trigger Crash</button>
      <BuggyComponent crash={crash} />
    </ErrorBoundary>
  );
};`,
    insights: "If one item in a 1,000-item dataset is malformed and throws an error during render, it will crash the entire app. Wrap individual rows or sections in Error Boundaries so the rest of the massive dataset remains usable."
  },
  {
    slug: "suspense",
    title: "Suspense",
    description: "Lets your components 'wait' for something before they can render, showing a fallback.",
    code: `import { Suspense, use } from 'react';

// Simulated promise
const fetchResource = new Promise((resolve) => setTimeout(() => resolve("Loaded Heavy Data!"), 2000));

const AsyncData = () => {
  // \`use\` is a React 19+ hook to unwrap promises
  const data = use(fetchResource);
  return <div>{data}</div>;
};

export const SuspenseDemo = () => (
  <Suspense fallback={<div style={{ color: '#61dafb' }}>Loading Data (2s)...</div>}>
    <AsyncData />
  </Suspense>
);`,
    insights: "Essential for perceived performance. When fetching gigabytes of data or executing heavy server components, `Suspense` allows the rest of the UI to remain interactive while displaying a skeleton layout for the pending data."
  },
  {
    slug: "lazy-loading",
    title: "Lazy Loading",
    description: "Defers loading component code until it is rendered for the first time.",
    code: `import { useState, lazy, Suspense } from 'react';

// Simulated lazy component
const HeavyChartMock = lazy(() => new Promise(resolve => {
  setTimeout(() => resolve({ default: () => <div style={{ padding: '20px', background: '#333' }}>Heavy Chart Rendered</div> }), 1000);
}));

export const LazyLoadDemo = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(true)} style={{ padding: '8px', marginBottom: '10px' }}>Load Heavy Chart</button>
      <Suspense fallback={<div>Downloading module...</div>}>
        {show && <HeavyChartMock />}
      </Suspense>
    </div>
  );
};`,
    insights: "Don't send massive visualization libraries (like D3 or complex charting tools) in the initial bundle. Lazy load them only when the user clicks 'View Chart' for the dataset, significantly improving initial load time."
  },
  {
    slug: "portals",
    title: "Portals",
    description: "Renders children into a DOM node that exists outside the DOM hierarchy of the parent.",
    code: `import { useState } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ onClose }) => {
  return createPortal(
    <div style={{ position: 'fixed', top: 50, left: '50%', transform: 'translateX(-50%)', background: '#222', padding: 20, border: '1px solid #fff', zIndex: 9999 }}>
      <h4>I am a Portal!</h4>
      <button onClick={onClose} style={{ padding: '8px' }}>Close</button>
    </div>,
    document.body
  );
};

export const PortalsDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden', height: '100px', border: '1px solid red', padding: '10px' }}>
      <p>Parent with hidden overflow</p>
      <button onClick={() => setOpen(true)} style={{ padding: '8px' }}>Open Portal</button>
      {open && <Modal onClose={() => setOpen(false)} />}
    </div>
  );
};`,
    insights: "In a heavily virtualized data grid with `overflow: hidden` and `position: absolute` rows, nested tooltips or dropdowns get clipped. Portals render them at the `document.body` level, avoiding layout constraints while maintaining React state context."
  },
  {
    slug: "forms-validation",
    title: "Forms and Validation",
    description: "Managing inputs, validation, and submission efficiently.",
    code: `import { useRef, useState } from 'react';

export const FormDemo = () => {
  const formRef = useRef(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const email = formData.get('email');
    if (!email.includes('@')) {
      setError("Invalid Email!");
    } else {
      setError(null);
      alert("Submitted: " + email);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" style={{ padding: '8px', marginRight: '5px' }} />
      <button type="submit" style={{ padding: '8px' }}>Submit</button>
      {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
    </form>
  );
};`,
    insights: "For forms with hundreds of inputs (e.g., inline grid editing), standard controlled components are unusable due to re-render lag. Use uncontrolled approaches (like `react-hook-form`) to register refs and validate without blocking the main thread."
  },
  {
    slug: "event-handling",
    title: "Event Handling",
    description: "Handling user interactions via synthetic events and delegation.",
    code: `export const EventDemo = () => {
  // Delegated event handler
  const handleWrapperClick = (e) => {
    // Only process if a button was clicked
    if (e.target.tagName === 'BUTTON') {
      alert("Action triggered for ID: " + e.target.dataset.id);
    }
  };

  return (
    <div onClick={handleWrapperClick} style={{ padding: '10px', background: '#222' }}>
      <p>Single Click Listener on Parent</p>
      {Array.from({ length: 5 }).map((_, i) => (
        <button key={i} data-id={i} style={{ margin: '4px', padding: '6px' }}>Row {i}</button>
      ))}
    </div>
  );
};`,
    insights: "Although React 18 uses event delegation internally at the root, attaching 10,000 unique `onClick` handlers to 10,000 rows can still be memory-intensive. For custom complex interactions, a single delegated listener on the parent container is highly efficient."
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    description: "Ensuring web applications are usable by everyone, including those using assistive technologies.",
    code: `export const A11yDemo = () => {
  const virtualizedSubset = [{ id: 4, val: 'Row 4' }, { id: 5, val: 'Row 5' }];
  
  return (
    <div role="table" aria-rowcount={10000} style={{ border: '1px solid #444', padding: '10px' }}>
      <div role="rowgroup">
        {virtualizedSubset.map(row => (
          <div role="row" aria-rowindex={row.id} key={row.id} style={{ padding: '5px' }}>
            <span role="cell">{row.val}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.8rem', color: '#888' }}>Screen readers know there are 10,000 total rows despite only 2 being in the DOM.</p>
    </div>
  );
};`,
    insights: "Virtualizing a large dataset removes DOM nodes, which destroys context for screen readers (e.g., 'Row 1 of 10' instead of 10,000). You MUST use `aria-rowcount` and `aria-rowindex` so assistive tech understands the full size of the unrendered data."
  }
];
