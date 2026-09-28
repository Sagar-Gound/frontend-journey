"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer, createContext, useContext, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';

// 1. Components and Composition
const TableWrapper = ({ children, title }) => (
  <div style={{ border: '1px solid #444', padding: '10px', borderRadius: '8px' }}>
    <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
    {children}
  </div>
);
const ComponentsDemo = () => (
  <TableWrapper title="Massive Data">
    <div style={{ height: '100px', overflowY: 'auto', background: '#222', padding: '5px' }}>
      {Array.from({ length: 20 }).map((_, i) => <div key={i}>Row {i + 1}</div>)}
    </div>
  </TableWrapper>
);

// 2. Props State
const PropsStateDemo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      style={{ padding: '10px', border: '1px solid #555', cursor: 'pointer', background: isExpanded ? '#333' : '#222' }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <strong>Row 1</strong>
      {isExpanded && <div style={{ marginTop: '10px', color: '#61dafb' }}>Hidden Payload: Detailed stats loaded...</div>}
    </div>
  );
};

// 3. Controlled vs Uncontrolled
const UncontrolledDemo = () => {
  const inputRef = useRef(null);
  const [savedValue, setSavedValue] = useState("");
  const handleSave = () => setSavedValue(inputRef.current.value);
  return (
    <div>
      <input ref={inputRef} defaultValue="Initial data..." style={{ padding: '8px', background: '#333', color: '#fff', border: 'none' }} />
      <button onClick={handleSave} style={{ marginLeft: '8px', padding: '8px 16px', cursor: 'pointer', background: '#61dafb', color: '#000', border: 'none' }}>Save</button>
      {savedValue && <div style={{ marginTop: '10px', color: '#4caf50' }}>Saved: {savedValue}</div>}
    </div>
  );
};

// 4. Hooks Foundation
const HooksDemo = () => {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);
  useEffect(() => { renderCount.current++; });
  return (
    <div>
      <p>Count (State): {count}</p>
      <button onClick={() => alert(`Component has rendered ${renderCount.current} times.`)} style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer', marginRight: '8px' }}>Check Render Count (Ref)</button>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '8px 16px', background: '#61dafb', color: '#000', border: 'none', cursor: 'pointer' }}>Increment</button>
    </div>
  );
};

// 5. Memoization
const MemoDemo = () => {
  const [filter, setFilter] = useState("");
  const [toggle, setToggle] = useState(false);
  const massiveArray = useMemo(() => Array.from({ length: 100 }, (_, i) => `Item ${i}`), []);
  const filtered = useMemo(() => massiveArray.filter(i => i.includes(filter)), [filter, massiveArray]);

  return (
    <div>
      <input placeholder="Filter items..." value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px', background: '#333', color: '#fff', border: 'none' }} />
      <button onClick={() => setToggle(!toggle)} style={{ marginLeft: '8px', padding: '8px 16px', background: '#555', color: '#fff', border: 'none', cursor: 'pointer' }}>Toggle Re-render</button>
      <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Render toggle state: {toggle.toString()}</p>
      <div style={{ marginTop: '10px', height: '100px', overflowY: 'auto', border: '1px solid #444', padding: '5px' }}>
        {filtered.slice(0, 50).map(item => <div key={item}>{item}</div>)}
      </div>
    </div>
  );
};

// 6. useReducer
const reducerInitial = { page: 1, sortBy: 'name' };
const reducer = (state, action) => {
  switch (action.type) {
    case 'NEXT_PAGE': return { ...state, page: state.page + 1 };
    case 'SORT': return { ...state, sortBy: action.payload };
    default: return state;
  }
};
const ReducerDemo = () => {
  const [state, dispatch] = useReducer(reducer, reducerInitial);
  return (
    <div>
      <p>Page: <strong>{state.page}</strong> | Sort by: <strong>{state.sortBy}</strong></p>
      <button onClick={() => dispatch({ type: 'NEXT_PAGE' })} style={{ padding: '8px 16px', cursor: 'pointer', background: '#61dafb', border: 'none', color: '#000' }}>Next Page</button>
      <button onClick={() => dispatch({ type: 'SORT', payload: 'date' })} style={{ padding: '8px 16px', marginLeft: '8px', cursor: 'pointer' }}>Sort Date</button>
    </div>
  );
};

// 7. Context API
const ThemeContext = createContext();
const ThemedText = () => {
  const theme = useContext(ThemeContext);
  return <div style={{ padding: '10px', background: theme === 'dark' ? '#222' : '#ddd', color: theme === 'dark' ? '#61dafb' : '#333' }}>I react to theme!</div>;
};
const ContextDemo = () => {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{ padding: '8px 16px', marginBottom: '10px', cursor: 'pointer' }}>
        Toggle Theme
      </button>
      <ThemedText />
    </ThemeContext.Provider>
  );
};

// 8. Custom Hooks
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}
const CustomHookDemo = () => {
  const width = useWindowWidth();
  return <div><p>Current Window Width: <strong style={{ color: '#61dafb' }}>{width}px</strong></p><p style={{ fontSize: '0.8rem' }}>Resize your window to see this update dynamically.</p></div>;
};

// 9. Lifecycle
const ChildLifecycleComponent = () => {
  useEffect(() => {
    console.log("Child Mounted");
    return () => console.log("Child Unmounted");
  }, []);
  return <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ffa500', color: '#ffa500' }}>I am alive! Check devtools console.</div>;
};

const LifecycleDemo = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(!show)} style={{ padding: '8px 16px', cursor: 'pointer' }}>Toggle Child Mount</button>
      {show && <ChildLifecycleComponent />}
    </div>
  );
};

// 10. Reconciliation
const HeavyRow = React.memo(function HeavyRow({ item }) {
  return <div style={{ padding: '4px', borderBottom: '1px solid #444' }}>{item}</div>;
});
const ReconciliationDemo = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '8px 16px', marginBottom: '10px', cursor: 'pointer' }}>
        Increment Parent ({count})
      </button>
      <HeavyRow item="I am memoized! React skipped re-rendering me." />
    </div>
  );
};

// 11. Keys
const KeysDemo = () => {
  const [items, setItems] = useState([{ id: 'A' }, { id: 'B' }, { id: 'C' }]);
  return (
    <div>
      <button onClick={() => setItems([...items].reverse())} style={{ padding: '8px 16px', marginBottom: '10px', cursor: 'pointer' }}>Reverse Order</button>
      <div>
        {items.map(item => (
          <div key={item.id} style={{ padding: '5px' }}>
            {item.id} - <input placeholder="Type here..." style={{ padding: '4px', background: '#222', color: '#fff', border: '1px solid #555' }} />
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#aaa' }}>Notice how the typed input values move WITH the item correctly because we used unique keys, not indices!</p>
    </div>
  );
};

// 12. State Preservation
const FormInstance = () => {
  const [draft, setDraft] = useState('');
  return <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type draft..." style={{ padding: '8px', background: '#222', color: '#fff', border: '1px solid #555' }} />;
};
const StateResetDemo = () => {
  const [recordId, setRecordId] = useState(1);
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setRecordId(1)} style={{ padding: '8px 16px', marginRight: '5px', cursor: 'pointer', background: recordId === 1 ? '#61dafb' : '#444' }}>Record 1</button>
        <button onClick={() => setRecordId(2)} style={{ padding: '8px 16px', cursor: 'pointer', background: recordId === 2 ? '#61dafb' : '#444' }}>Record 2</button>
      </div>
      <p>Editing Record: {recordId}</p>
      <FormInstance key={recordId} />
    </div>
  );
};

// 13. Error Boundaries
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{ color: '#ff5252', padding: '10px', border: '1px solid #ff5252' }}>Error caught! App didn&apos;t crash.</div>;
    return this.props.children;
  }
}
const BuggyComponent = ({ crash }) => {
  if (crash) throw new Error("I crashed!");
  return <div style={{ padding: '10px', border: '1px solid #4caf50' }}>I am working perfectly.</div>;
};
const ErrorBoundaryDemo = () => {
  const [crash, setCrash] = useState(false);
  return (
    <ErrorBoundary>
      <button onClick={() => setCrash(true)} style={{ padding: '8px 16px', marginBottom: '10px', cursor: 'pointer', background: '#ff5252', color: '#fff', border: 'none' }}>Trigger Crash</button>
      {!crash && <BuggyComponent crash={crash} />}
    </ErrorBoundary>
  );
};

// 14. Suspense
const AsyncDataComponent = lazy(() => new Promise(resolve => setTimeout(() => resolve({ default: () => <div>Loaded Heavy Server Data!</div> }), 1500)));
const SuspenseDemo = () => {
  const [start, setStart] = useState(false);
  return (
    <div>
      <button onClick={() => setStart(true)} style={{ padding: '8px 16px', marginBottom: '10px', cursor: 'pointer' }}>Fetch Data</button>
      {start && (
        <Suspense fallback={<div style={{ color: '#61dafb' }}>Loading Data (1.5s)...</div>}>
          <AsyncDataComponent />
        </Suspense>
      )}
    </div>
  );
};

// 15. Lazy Loading (Same as suspense for demo purposes)
const LazyLoadDemo = SuspenseDemo;

// 16. Portals
const PortalsDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden', height: '80px', border: '1px solid #ff5252', padding: '10px', position: 'relative' }}>
      <p>Parent with hidden overflow</p>
      <button onClick={() => setOpen(true)} style={{ padding: '8px 16px', cursor: 'pointer' }}>Open Portal</button>
      {open && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#111', padding: '30px', border: '1px solid #61dafb', zIndex: 9999, boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>I am a Portal!</h4>
          <p style={{ marginBottom: '15px' }}>I broke out of the hidden overflow parent!</p>
          <button onClick={() => setOpen(false)} style={{ padding: '8px 16px', cursor: 'pointer' }}>Close</button>
        </div>,
        document.body
      )}
    </div>
  );
};

// 17. Forms Validation
const FormDemo = () => {
  const formRef = useRef(null);
  const [error, setError] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = new FormData(formRef.current).get('email');
    if (!email.includes('@')) setError("Invalid Email! Must contain '@'");
    else { setError(null); alert("Submitted: " + email); }
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" style={{ padding: '8px', marginRight: '5px', background: '#222', color: '#fff', border: '1px solid #555' }} />
      <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', background: '#61dafb', border: 'none', color: '#000' }}>Submit</button>
      {error && <div style={{ color: '#ff5252', marginTop: '5px' }}>{error}</div>}
    </form>
  );
};

// 18. Event Handling
const EventDemo = () => {
  const handleWrapperClick = (e) => {
    if (e.target.tagName === 'BUTTON') alert("Action triggered for row ID: " + e.target.dataset.id);
  };
  return (
    <div onClick={handleWrapperClick} style={{ padding: '15px', background: '#222', border: '1px solid #444' }}>
      <p style={{ margin: '0 0 10px 0', color: '#aaa' }}>Single Click Listener on Parent</p>
      {Array.from({ length: 3 }).map((_, i) => (
        <button key={i} data-id={i} style={{ margin: '4px', padding: '6px 12px', cursor: 'pointer', background: '#444', color: '#fff', border: 'none' }}>Row {i}</button>
      ))}
    </div>
  );
};

// 19. Accessibility
const A11yDemo = () => (
  <div role="table" aria-rowcount={10000} style={{ border: '1px solid #444', padding: '10px' }}>
    <div role="rowgroup">
      {[{ id: 4, val: 'Row 4' }, { id: 5, val: 'Row 5' }].map(row => (
        <div role="row" aria-rowindex={row.id} key={row.id} style={{ padding: '5px', borderBottom: '1px solid #333' }}>
          <span role="cell">{row.val}</span>
        </div>
      ))}
    </div>
    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>Screen readers know there are 10,000 total rows despite only 2 being in the DOM thanks to aria attributes.</p>
  </div>
);

const componentMap = {
  "components-and-composition": ComponentsDemo,
  "props-state": PropsStateDemo,
  "controlled-vs-uncontrolled": UncontrolledDemo,
  "hooks-foundations": HooksDemo,
  "memoization": MemoDemo,
  "usereducer": ReducerDemo,
  "context-api": ContextDemo,
  "custom-hooks": CustomHookDemo,
  "component-lifecycle": LifecycleDemo,
  "reconciliation": ReconciliationDemo,
  "keys": KeysDemo,
  "state-preservation": StateResetDemo,
  "error-boundaries": ErrorBoundaryDemo,
  "suspense": SuspenseDemo,
  "lazy-loading": LazyLoadDemo,
  "portals": PortalsDemo,
  "forms-validation": FormDemo,
  "event-handling": EventDemo,
  "accessibility": A11yDemo
};

export const LiveRenderer = ({ slug }) => {
  const Component = componentMap[slug];
  if (!Component) return <div>No live demo available for {slug}.</div>;
  return <Component />;
};
