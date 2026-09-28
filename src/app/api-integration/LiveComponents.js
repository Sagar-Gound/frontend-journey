"use client";
import React, { useState, useEffect, useRef } from 'react';

// 1. HTTP Methods
const HttpDemo = () => {
  const [log, setLog] = useState([]);
  const api = (method) => setLog(prev => [...prev, \`[\${new Date().toLocaleTimeString()}] Executed \${method} /api/users\`]);
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => api('GET')} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>GET</button>
        <button onClick={() => api('POST')} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer' }}>POST</button>
        <button onClick={() => api('DELETE')} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>DELETE</button>
      </div>
      <div style={{ height: '100px', overflowY: 'auto', background: '#000', padding: '10px', color: '#a0a0a0', fontFamily: 'monospace' }}>
        {log.map((l, i) => <div key={i}>{l}</div>)}
        {!log.length && "Awaiting requests..."}
      </div>
    </div>
  );
};

// 2. Fetch vs Axios
const AxiosDemo = () => {
  const [code, setCode] = useState("");
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <button onClick={() => setCode("fetch('/api').then(res => { if(!res.ok) throw new Error('Err'); return res.json(); }).then(setData);")} style={{ padding: '8px 16px', background: '#444', color: '#fff', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Show Fetch</button>
      <button onClick={() => setCode("axios.get('/api').then(({ data }) => setData(data));")} style={{ padding: '8px 16px', background: '#8b5cf6', color: '#fff', border: 'none', cursor: 'pointer' }}>Show Axios</button>
      <div style={{ marginTop: '15px', background: '#000', padding: '15px', color: '#61dafb', fontFamily: 'monospace', minHeight: '60px' }}>
        {code || "Select an approach..."}
      </div>
    </div>
  );
};

// 3. Auth
const AuthDemo = () => {
  const [auth, setAuth] = useState(false);
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <div style={{ padding: '15px', background: auth ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: \`1px solid \${auth ? '#10b981' : '#ef4444'}\`, color: auth ? '#10b981' : '#ef4444', marginBottom: '15px' }}>
        Status: {auth ? "Authenticated (HTTP-Only Cookie active)" : "Unauthorized (No valid cookie found)"}
      </div>
      <button onClick={() => setAuth(!auth)} style={{ padding: '8px 16px', background: '#f59e0b', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
        {auth ? "Logout (Destroy Cookie)" : "Simulate Login (Set Cookie)"}
      </button>
    </div>
  );
};

// 4. Security
const SecurityDemo = () => (
  <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
    <h4 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>Access to fetch at &apos;api.server.com&apos; from origin &apos;localhost&apos; has been blocked by CORS policy</h4>
    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>You cannot fix this in React! The backend server MUST respond with the <code>Access-Control-Allow-Origin</code> header.</p>
  </div>
);

// 5. Network Control
const AbortDemo = () => {
  const [reqId, setReqId] = useState(0);
  const [log, setLog] = useState([]);
  
  useEffect(() => {
    if (reqId === 0) return;
    setLog(prev => [...prev, \`Request \${reqId} started...\`]);
    const timer = setTimeout(() => {
      setLog(prev => [...prev, \`Request \${reqId} COMPLETED.\`]);
    }, 2000);

    return () => {
      clearTimeout(timer);
      setLog(prev => [...prev, \`Request \${reqId} ABORTED (Cleanup)!\`]);
    };
  }, [reqId]);

  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <button onClick={() => setReqId(r => r + 1)} style={{ padding: '8px 16px', background: '#ec4899', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '15px' }}>
        Fetch User {reqId + 1}
      </button>
      <p style={{ fontSize: '0.8rem', color: '#888' }}>Click rapidly! See how previous requests are aborted to prevent race conditions.</p>
      <div style={{ height: '120px', overflowY: 'auto', background: '#000', padding: '10px', color: '#a0a0a0', fontFamily: 'monospace' }}>
        {log.map((l, i) => <div key={i} style={{ color: l.includes('ABORTED') ? '#ef4444' : l.includes('COMPLETED') ? '#10b981' : '#fff' }}>{l}</div>)}
      </div>
    </div>
  );
};

// 6. Pagination
const InfiniteScrollDemo = () => {
  const [items, setItems] = useState([1, 2, 3]);
  const [loading, setLoading] = useState(false);
  const loadMore = () => {
    setLoading(true);
    setTimeout(() => { setItems(prev => [...prev, prev.length + 1, prev.length + 2, prev.length + 3]); setLoading(false); }, 1000);
  };
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <div style={{ height: '150px', overflowY: 'auto', background: '#222', padding: '10px', border: '1px solid #444' }}>
        {items.map(i => <div key={i} style={{ padding: '10px', borderBottom: '1px solid #333' }}>Item {i}</div>)}
        <div style={{ textAlign: 'center', padding: '10px' }}>
          {loading ? <span style={{ color: '#3b82f6' }}>Loading...</span> : <button onClick={loadMore} style={{ background: 'transparent', color: '#8b5cf6', border: '1px solid #8b5cf6', padding: '5px 10px', cursor: 'pointer' }}>Load More</button>}
        </div>
      </div>
    </div>
  );
};

// 7. Client vs Server State
const StateParadigmDemo = () => (
  <div style={{ padding: '20px', background: '#111', borderRadius: '8px', display: 'flex', gap: '20px' }}>
    <div style={{ flex: 1, padding: '15px', border: '1px solid #3b82f6', borderRadius: '8px' }}>
      <h4 style={{ color: '#3b82f6', marginTop: 0 }}>Client State (Zustand)</h4>
      <ul style={{ color: '#aaa', fontSize: '0.85rem', paddingLeft: '15px' }}>
        <li>Is modal open?</li>
        <li>Current theme</li>
        <li>Form drafts</li>
      </ul>
    </div>
    <div style={{ flex: 1, padding: '15px', border: '1px solid #10b981', borderRadius: '8px' }}>
      <h4 style={{ color: '#10b981', marginTop: 0 }}>Server State (React Query)</h4>
      <ul style={{ color: '#aaa', fontSize: '0.85rem', paddingLeft: '15px' }}>
        <li>User profile data</li>
        <li>Product list</li>
        <li>Cached metrics</li>
      </ul>
    </div>
  </div>
);

// 8. Optimistic Updates
const OptimisticDemo = () => {
  const [likes, setLikes] = useState(10);
  const handleLike = () => {
    setLikes(prev => prev + 1); // 1. Instant UI update
    // 2. Simulate API failure
    setTimeout(() => {
      setLikes(prev => prev - 1); // 3. Rollback
      alert("Network Error: Failed to like post. Rolling back UI.");
    }, 1500);
  };
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <button onClick={handleLike} style={{ padding: '8px 16px', background: 'transparent', color: '#ec4899', border: '1px solid #ec4899', borderRadius: '20px', cursor: 'pointer' }}>
        ❤️ {likes} Likes
      </button>
      <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '10px' }}>Click to like. It updates instantly, but a simulated network failure rolls it back after 1.5s.</p>
    </div>
  );
};

// 9. File Uploads
const UploadDemo = () => {
  const [progress, setProgress] = useState(0);
  const upload = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); return 100; } return p + 20; });
    }, 400);
  };
  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <button onClick={upload} style={{ padding: '8px 16px', background: '#f59e0b', color: '#000', border: 'none', cursor: 'pointer', marginBottom: '15px' }}>Upload File</button>
      <div style={{ width: '100%', background: '#333', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
        <div style={{ width: \`\${progress}%\`, height: '100%', background: '#10b981', transition: 'width 0.3s' }}></div>
      </div>
      <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Uploaded: {progress}% (Tracked via Axios onUploadProgress)</p>
    </div>
  );
};

// 10. Realtime
const RealtimeDemo = () => {
  const [msgs, setMsgs] = useState([]);
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setMsgs(prev => [{ id: Date.now(), text: "Live tick: " + (Math.random() * 100).toFixed(2) }, ...prev].slice(0, 5));
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div style={{ padding: '20px', background: '#111', borderRadius: '8px' }}>
      <button onClick={() => setActive(!active)} style={{ padding: '8px 16px', background: active ? '#ef4444' : '#10b981', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '15px' }}>
        {active ? "Close WebSocket" : "Open WebSocket"}
      </button>
      <div style={{ height: '120px', background: '#000', padding: '10px', color: '#61dafb', fontFamily: 'monospace' }}>
        {msgs.map(m => <div key={m.id}>{m.text}</div>)}
        {!msgs.length && "Socket disconnected."}
      </div>
    </div>
  );
};


const componentMap = {
  "http-methods": HttpDemo,
  "fetch-vs-axios": AxiosDemo,
  "authentication": AuthDemo,
  "security-cors-csrf": SecurityDemo,
  "network-control": AbortDemo,
  "pagination-infinite-scroll": InfiniteScrollDemo,
  "client-vs-server-state": StateParadigmDemo,
  "optimistic-updates": OptimisticDemo,
  "file-uploads": UploadDemo,
  "realtime": RealtimeDemo
};

export const LiveRenderer = ({ slug }) => {
  const Component = componentMap[slug];
  if (!Component) return <div style={{ color: '#ff5252' }}>No live demo available for {slug}.</div>;
  return <Component />;
};
