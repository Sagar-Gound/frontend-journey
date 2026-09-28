"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';

// 1. Feature-based architecture
const FeatureArchitectureDemo = () => (
  <div style={{ padding: '20px', background: '#111', fontFamily: 'monospace', color: '#8b5cf6' }}>
    <div style={{ marginBottom: '10px' }}>📁 src/</div>
    <div style={{ paddingLeft: '20px' }}>
      <div style={{ color: '#10b981' }}>📁 features/</div>
      <div style={{ paddingLeft: '20px' }}>
        <div>📁 auth/</div>
        <div style={{ paddingLeft: '20px', color: '#a0a0a0' }}>
          <div>📄 index.js (Public API)</div>
          <div>📁 components/</div>
          <div>📁 hooks/</div>
          <div>📁 services/</div>
        </div>
        <div style={{ marginTop: '10px' }}>📁 products/</div>
        <div style={{ paddingLeft: '20px', color: '#a0a0a0' }}>
          <div>📄 index.js</div>
          <div>📁 components/</div>
          <div>📁 hooks/</div>
        </div>
      </div>
    </div>
    <div style={{ marginTop: '15px', color: '#fff', fontSize: '0.85rem', borderTop: '1px solid #333', paddingTop: '10px' }}>
      Notice how everything related to a domain is grouped together.
    </div>
  </div>
);

// 2. Separation of concerns & SRP
const useUserFetchMock = () => {
  const [data, setData] = useState(null);
  useEffect(() => { setTimeout(() => setData({ name: "Jane Doe", role: "Admin" }), 1000); }, []);
  return data;
};
const UserProfileUI = ({ user }) => (
  <div style={{ padding: '15px', border: '1px solid #10b981', borderRadius: '8px' }}>
    <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
    <span style={{ background: '#10b981', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{user.role}</span>
  </div>
);
const SRPDemo = () => {
  const user = useUserFetchMock();
  return (
    <div>
      <p style={{ color: '#aaa', fontSize: '0.85rem' }}>The container fetches data, the UI component just renders it.</p>
      {user ? <UserProfileUI user={user} /> : <div style={{ color: '#8b5cf6' }}>Fetching user data...</div>}
    </div>
  );
};

// 3. DRY Principle
const DryDemo = () => {
  return (
    <div style={{ padding: '15px', background: '#222', borderRadius: '8px' }}>
      <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Instead of rewriting fetch logic for Users and Products, a single <code>useApi(url)</code> hook handles loading states and data resolution for both.</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>Load Users (useApi)</button>
        <button style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>Load Products (useApi)</button>
      </div>
    </div>
  );
};

// 4. Dependency Inversion
const ApiContext = createContext(null);
const ProductList = () => {
  const api = useContext(ApiContext);
  const [msg, setMsg] = useState("");
  return (
    <div>
      <button onClick={() => setMsg(api.fetch())} style={{ padding: '8px 16px', cursor: 'pointer', background: '#8b5cf6', color: '#fff', border: 'none' }}>
        Call API from Context
      </button>
      {msg && <div style={{ marginTop: '10px', color: '#10b981' }}>{msg}</div>}
    </div>
  );
};
const DependencyInversionDemo = () => {
  const mockApi = { fetch: () => "Success! Injected Mock API called instead of real network." };
  return (
    <ApiContext.Provider value={mockApi}>
      <ProductList />
    </ApiContext.Provider>
  );
};

// 5. Compound Components
const TabsContext = createContext();
const Tabs = ({ children }) => {
  const [active, setActive] = useState(0);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
};
const TabList = ({ children }) => <div style={{ display: 'flex', borderBottom: '1px solid #444', marginBottom: '15px' }}>{children}</div>;
const Tab = ({ index, children }) => {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button onClick={() => setActive(index)} style={{ padding: '10px 20px', cursor: 'pointer', background: 'transparent', color: active === index ? '#10b981' : '#888', border: 'none', borderBottom: active === index ? '2px solid #10b981' : 'none' }}>
      {children}
    </button>
  );
};
const CompoundDemo = () => (
  <Tabs>
    <TabList>
      <Tab index={0}>Overview</Tab>
      <Tab index={1}>Settings</Tab>
      <Tab index={2}>Advanced</Tab>
    </TabList>
    <div style={{ padding: '10px', color: '#ccc' }}>Content changes automatically based on context state!</div>
  </Tabs>
);

// 6. Render Props
const MouseTracker = ({ render }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div 
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: Math.floor(e.clientX - rect.left), y: Math.floor(e.clientY - rect.top) });
      }} 
      style={{ height: '150px', background: '#111', border: '1px dashed #555', position: 'relative', cursor: 'crosshair' }}
    >
      {render(pos)}
    </div>
  );
};
const RenderPropsDemo = () => (
  <MouseTracker render={({ x, y }) => (
    <div style={{ position: 'absolute', top: y + 10, left: x + 10, background: '#10b981', color: '#000', padding: '2px 6px', borderRadius: '4px', pointerEvents: 'none' }}>
      {x}, {y}
    </div>
  )} />
);

// 7. Headless Components
const useToggle = () => {
  const [on, setOn] = useState(false);
  return { on, toggle: () => setOn(!on), props: { 'aria-expanded': on, role: 'switch' } };
};
const HeadlessDemo = () => {
  const { on, toggle, props } = useToggle();
  return (
    <div>
      <p style={{ color: '#aaa', fontSize: '0.85rem' }}>The logic (useToggle) has no UI. We can build any UI we want with it.</p>
      <button onClick={toggle} {...props} style={{ padding: '10px', background: on ? '#10b981' : '#333', color: '#fff', border: 'none', borderRadius: '20px', width: '60px', cursor: 'pointer', transition: 'background 0.3s' }}>
        {on ? 'ON' : 'OFF'}
      </button>
    </div>
  );
};

// 8. Container/Presentation
const PresentationCard = ({ title, onAction }) => (
  <div style={{ padding: '15px', border: '1px solid #444', borderRadius: '8px', maxWidth: '200px' }}>
    <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
    <button onClick={onAction} style={{ padding: '5px 10px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Action</button>
  </div>
);
const ContainerDemo = () => {
  const handleAction = () => alert('Action handled by the smart container!');
  return <PresentationCard title="Dumb UI Component" onAction={handleAction} />;
};

// 9. Design Systems
const tokens = { colors: { primary: '#10b981', secondary: '#8b5cf6' }, spacing: { sm: '8px', md: '16px' }, radii: '6px' };
const SystemButton = ({ variant = 'primary', children }) => (
  <button style={{ background: tokens.colors[variant], padding: tokens.spacing.md, borderRadius: tokens.radii, border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
    {children}
  </button>
);
const DesignSystemDemo = () => (
  <div style={{ display: 'flex', gap: '10px' }}>
    <SystemButton variant="primary">Primary Action</SystemButton>
    <SystemButton variant="secondary">Secondary Action</SystemButton>
  </div>
);

const componentMap = {
  "feature-based-architecture": FeatureArchitectureDemo,
  "separation-of-concerns-srp": SRPDemo,
  "dry-principle": DryDemo,
  "dependency-inversion": DependencyInversionDemo,
  "compound-components": CompoundDemo,
  "render-props": RenderPropsDemo,
  "headless-components": HeadlessDemo,
  "container-presentation": ContainerDemo,
  "design-systems": DesignSystemDemo
};

export const LiveRenderer = ({ slug }) => {
  const Component = componentMap[slug];
  if (!Component) return <div style={{ color: '#ff5252' }}>No live demo available for {slug}.</div>;
  return <Component />;
};
