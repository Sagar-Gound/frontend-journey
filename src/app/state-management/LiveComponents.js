"use client";
import React, { useState, useReducer, createContext, useContext, useEffect } from 'react';

// 1. Component State
const ComponentStateDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ padding: '20px', border: '1px solid #333', borderRadius: '8px', background: '#111' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Toggle Local Modal
      </button>
      {isOpen && (
        <div style={{ marginTop: '15px', padding: '15px', background: '#1e3a8a', border: '1px solid #3b82f6', borderRadius: '8px', color: '#bfdbfe' }}>
          This state only exists right here. No Redux needed!
        </div>
      )}
    </div>
  );
};

// 2. Complex Local State (useReducer)
const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE': return { ...state, [action.field]: action.value };
    case 'RESET': return { user: '', role: '' };
    default: return state;
  }
};
const ComplexStateDemo = () => {
  const [state, dispatch] = useReducer(formReducer, { user: 'John', role: 'Admin' });
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input value={state.user} onChange={e => dispatch({ type: 'UPDATE', field: 'user', value: e.target.value })} style={{ padding: '8px', background: '#222', color: '#fff', border: '1px solid #444' }} />
        <input value={state.role} onChange={e => dispatch({ type: 'UPDATE', field: 'role', value: e.target.value })} style={{ padding: '8px', background: '#222', color: '#fff', border: '1px solid #444' }} />
      </div>
      <button onClick={() => dispatch({ type: 'RESET' })} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>Reset Both (Batched)</button>
      <div style={{ marginTop: '10px', color: '#a0a0a0' }}>Current State: {JSON.stringify(state)}</div>
    </div>
  );
};

// 3. Shared UI State (Context)
const ThemeContext = createContext();
const ThemeChild = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div style={{ padding: '20px', background: theme === 'dark' ? '#111' : '#f3f4f6', color: theme === 'dark' ? '#fff' : '#000', transition: 'all 0.3s ease', border: '1px solid #888', borderRadius: '8px' }}>
      <p>I am a deeply nested component reading from Context!</p>
      <button onClick={toggleTheme} style={{ padding: '8px 16px', background: theme === 'dark' ? '#3b82f6' : '#1d4ed8', color: '#fff', border: 'none', cursor: 'pointer' }}>Toggle Theme</button>
    </div>
  );
};
const SharedStateDemo = () => {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      <ThemeChild />
    </ThemeContext.Provider>
  );
};

// 4. Server/API State
const ApiStateDemo = () => {
  const [status, setStatus] = useState('idle');
  
  const simulateFetch = () => {
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>Libraries like React Query automatically handle these transitions, caching, and background refetching.</p>
      <button onClick={simulateFetch} disabled={status === 'loading'} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
        {status === 'loading' ? 'Fetching API...' : 'Trigger Fetch'}
      </button>
      
      {status === 'loading' && <div style={{ marginTop: '15px', color: '#fbbf24' }}>Loading state active... (Spinner)</div>}
      {status === 'success' && <div style={{ marginTop: '15px', color: '#10b981' }}>Data successfully cached and rendered!</div>}
    </div>
  );
};

// 5. Large Client State
// We mock Zustand behavior here without importing it
const ClientStateDemo = () => {
  const [bears, setBears] = useState(0); // Mock global store
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>Zustand allows accessing global state anywhere without Context Providers.</p>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🐻 {bears}</div>
      <button onClick={() => setBears(b => b + 1)} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Add Bear</button>
      <button onClick={() => setBears(0)} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>Clear Forest</button>
    </div>
  );
};

// 6. URL State
const UrlStateDemo = () => {
  const [mockUrl, setMockUrl] = useState("?category=shoes");
  
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <div style={{ padding: '10px', background: '#000', color: '#10b981', fontFamily: 'monospace', marginBottom: '15px', border: '1px solid #333' }}>
        URL: https://mystore.com/products{mockUrl}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setMockUrl("?category=shoes")} style={{ padding: '8px 16px', cursor: 'pointer', background: mockUrl.includes('shoes') ? '#3b82f6' : '#333', color: '#fff', border: 'none' }}>Shoes</button>
        <button onClick={() => setMockUrl("?category=electronics")} style={{ padding: '8px 16px', cursor: 'pointer', background: mockUrl.includes('electronics') ? '#3b82f6' : '#333', color: '#fff', border: 'none' }}>Electronics</button>
        <button onClick={() => setMockUrl("?category=sale&sort=asc")} style={{ padding: '8px 16px', cursor: 'pointer', background: mockUrl.includes('sale') ? '#3b82f6' : '#333', color: '#fff', border: 'none' }}>Sale Items</button>
      </div>
      <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '15px' }}>Refresh the page? State is preserved. Send link to a friend? They see exactly what you see.</p>
    </div>
  );
};

// 7. Form State
const FormStateDemo = () => {
  const [submitted, setSubmitted] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(new FormData(e.target).get('username'));
  };
  
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input name="username" placeholder="Username (Uncontrolled)" required style={{ padding: '10px', background: '#222', color: '#fff', border: '1px solid #444' }} />
        <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>Submit Form</button>
      </form>
      {submitted && <div style={{ marginTop: '15px', color: '#10b981' }}>Form logic handled outside render cycle! Submitted: {submitted}</div>}
    </div>
  );
};

// 8. Persistent State
const PersistentStateDemo = () => {
  const [val, setVal] = useState('');
  useEffect(() => { setVal(localStorage.getItem('mock-persist') || 'Saved Data'); }, []);
  const update = (v) => { setVal(v); localStorage.setItem('mock-persist', v); };

  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>Data saved here survives browser refreshes.</p>
      <input value={val} onChange={(e) => update(e.target.value)} style={{ padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', width: '100%' }} />
    </div>
  );
};

const componentMap = {
  "component-state": ComponentStateDemo,
  "complex-local-state": ComplexStateDemo,
  "shared-ui-state": SharedStateDemo,
  "server-api-state": ApiStateDemo,
  "large-client-state": ClientStateDemo,
  "url-state": UrlStateDemo,
  "form-state": FormStateDemo,
  "persistent-state": PersistentStateDemo
};

export const LiveRenderer = ({ slug }) => {
  const Component = componentMap[slug];
  if (!Component) return <div style={{ color: '#ff5252' }}>No live demo available for {slug}.</div>;
  return <Component />;
};
