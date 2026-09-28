export const apiTopics = [
  {
    slug: "http-methods",
    title: "HTTP Methods & REST",
    description: "The foundation of web APIs. GET fetches data, POST creates, PUT completely replaces, PATCH partially updates, and DELETE removes.",
    code: `const api = {
  getUsers: () => fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
  
  createUser: (data) => fetch('https://jsonplaceholder.typicode.com/users', { 
    method: 'POST', body: JSON.stringify(data) 
  }),
  
  updateUser: (id, data) => fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`, { 
    method: 'PATCH', body: JSON.stringify(data) 
  }),
  
  deleteUser: (id) => fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`, { 
    method: 'DELETE' 
  })
};`,
    insights: "Understanding idempotency is key for senior engineers. A GET, PUT, or DELETE request can be safely retried if it fails because doing it twice has the same result. A POST request is not idempotent and retrying it might create duplicate records."
  },
  {
    slug: "fetch-vs-axios",
    title: "Fetch vs Axios",
    description: "Fetch is built-in and uses Promises. Axios is a third-party library that automatically transforms JSON, handles timeouts, and supports request interceptors.",
    code: `// Fetch: Requires manual JSON parsing and error handling
const fetchUser = async (id) => {
  const res = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

// Axios: Automatic JSON parsing and error throwing
import axios from 'axios';
const axiosUser = async (id) => {
  const { data } = await axios.get(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
  return data;
};`,
    insights: "Axios interceptors are incredible for large apps. You can attach auth tokens to every request or globally handle 401 Unauthorized responses to silently refresh tokens—all in one place."
  },
  {
    slug: "authentication",
    title: "Authentication (JWT & Cookies)",
    description: "Managing user identity. JWTs (JSON Web Tokens) are stateless tokens. Storing them securely is paramount to prevent XSS (Cross-Site Scripting) attacks.",
    code: `// BAD: Storing JWT in localStorage (Vulnerable to XSS)
localStorage.setItem('token', jwt);

// GOOD: Server sends token as an HTTP-Only, Secure cookie.
// The browser automatically attaches it to subsequent requests.
// React just checks an endpoint to see if the user is authenticated.
const checkAuth = async () => {
  try {
    const { data } = await axios.get('/api/me');
    setUser(data);
  } catch (error) {
    setUser(null);
  }
};`,
    insights: "Never store sensitive tokens in `localStorage` or `sessionStorage` if you can avoid it. Use `httpOnly` cookies sent by your backend. If an attacker injects a malicious script into your app, they cannot read `httpOnly` cookies."
  },
  {
    slug: "security-cors-csrf",
    title: "Security: CORS & CSRF",
    description: "CORS (Cross-Origin Resource Sharing) dictates who can call your API. CSRF (Cross-Site Request Forgery) forces an end user to execute unwanted actions.",
    code: `// Backend configured CORS (e.g. Node/Express)
app.use(cors({
  origin: 'https://my-react-app.com',
  credentials: true // Crucial for sending cookies cross-origin
}));

// Frontend Axios config for CSRF/CORS
axios.defaults.withCredentials = true;
// Automatically attach CSRF token if backend sets a cookie
axios.defaults.xsrfCookieName = 'CSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';`,
    insights: "CORS errors ('No Access-Control-Allow-Origin header is present') are almost always a backend configuration issue. Do not try to hack around it on the frontend by using proxy services in production."
  },
  {
    slug: "network-control",
    title: "Request Cancellation & Retries",
    description: "Preventing race conditions when users click rapidly, and automatically retrying failed requests to handle flaky networks.",
    code: `import { useEffect, useState } from 'react';

const UserProfile = ({ id }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });

    // Cleanup aborts the request if the component unmounts or ID changes
    return () => controller.abort();
  }, [id]);

  return <div>{data?.name}</div>;
};`,
    insights: "If a user clicks 'User A' then immediately 'User B', the request for 'User A' might finish *after* 'User B', overwriting the state with the wrong data. Always abort stale requests in `useEffect` cleanup."
  },
  {
    slug: "pagination-infinite-scroll",
    title: "Pagination & Infinite Scroll",
    description: "Handling massive lists of data by only loading what is visible. Pagination uses page numbers; infinite scroll appends data as the user scrolls.",
    code: `// Infinite Scroll using IntersectionObserver
const { ref, inView } = useInView();

useEffect(() => {
  if (inView && hasNextPage) {
    fetchNextPage();
  }
}, [inView, hasNextPage]);

return (
  <div>
    {items.map(item => <Card key={item.id} item={item} />)}
    
    {/* Invisible trigger element */}
    <div ref={ref}>
      {isFetchingNextPage && <Spinner />}
    </div>
  </div>
);`,
    insights: "For infinitely scrolling feeds with thousands of items, you must combine infinite fetching with DOM virtualization (like `react-window`). Otherwise, the DOM will eventually crash the browser from having too many nodes."
  },
  {
    slug: "client-vs-server-state",
    title: "Client State vs Server State",
    description: "The most important paradigm shift. Server state is data you don't own (it lives in a DB). Client state is ephemeral UI state (modals, drafts).",
    code: `// BAD: Treating Server State like Client State
const [users, setUsers] = useState([]);
useEffect(() => { fetchUsers().then(setUsers) }, []);

// GOOD: Treating Server State with a dedicated library
import { useQuery } from '@tanstack/react-query';
const { data: users, isLoading } = useQuery({ 
  queryKey: ['users'], 
  queryFn: fetchUsers 
});`,
    insights: "Server state is asynchronous, cached, and shared among users. Stop storing it in Redux. Use specialized tools (React Query, SWR, Apollo) that automatically handle background refetching, caching, and race conditions."
  },
  {
    slug: "optimistic-updates",
    title: "Optimistic Updates & UX States",
    description: "Updating the UI immediately assuming the request will succeed, and rolling back if it fails. Makes apps feel instantly responsive.",
    code: `const likePost = async (postId) => {
  // 1. Optimistically update UI
  setLikes(prev => prev + 1);
  
  try {
    // 2. Perform actual request
    await axios.post(\`/api/posts/\${postId}/like\`);
  } catch (error) {
    // 3. Rollback on failure
    setLikes(prev => prev - 1);
    toast.error("Failed to like post");
  }
};`,
    insights: "Never make a user stare at a loading spinner for an action they expect to be instant (like 'liking' a post or checking a to-do item). Optimistic updates are the hallmark of top-tier frontend applications."
  },
  {
    slug: "file-uploads",
    title: "File & Image Uploads",
    description: "Handling binary data. Typically requires FormData and specific multipart headers, often involving progress tracking.",
    code: `const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('document', file);

  await axios.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setProgress(percent);
    }
  });
};`,
    insights: "Don't send large images directly to your Node/Python server; it blocks the main thread. Instead, request a 'Presigned URL' from your backend, and have the React frontend upload the file directly to an S3 bucket."
  },
  {
    slug: "realtime",
    title: "Real-time: WebSockets & SSE",
    description: "WebSockets provide bi-directional live communication. Server-Sent Events (SSE) provide a one-way live stream from server to client.",
    code: `import { useEffect, useState } from 'react';

export const LiveChat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('wss://api.myapp.com/chat');
    
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages(prev => [...prev, msg]);
    };

    return () => ws.close();
  }, []);

  return <div>{messages.map(m => <p key={m.id}>{m.text}</p>)}</div>;
};`,
    insights: "WebSockets can drain mobile batteries and hold open heavy connections on the server. If you only need to receive live updates (like a stock ticker or notification feed) but don't need to push high-frequency data, use Server-Sent Events (SSE) instead."
  }
];
