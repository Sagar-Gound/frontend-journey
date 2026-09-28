export const topics = [
  {
    slug: "websockets",
    title: "WebSockets & Socket.IO",
    tags: ["WebSockets", "Socket.IO", "Pub/Sub Pattern"],
    description: "Persistent, bi-directional communication channels between the client and the server. This enables true real-time, low-latency experiences.",
    insights: "WHEN/WHERE TO USE: Chat applications, live multiplayer games, collaborative editing (Google Docs). WHY: Standard HTTP is request-response. WebSockets keep the connection open, allowing the server to push data instantly without the client asking for it. Socket.IO is a wrapper that adds automatic reconnects and fallback polling.",
    code: `// The core Real-time Pub/Sub Pattern:
// 1. Client A sends message -> WebSocket
// 2. Server receives -> Broadcasts Event
// 3. All subscribed Clients receive update

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. Connect to server
    const newSocket = io('https://api.myapp.com');
    setSocket(newSocket);

    // 3. Listen for broadcasted events from the server
    newSocket.on('chat_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = (text) => {
    // 2. Send event to the server
    socket.emit('chat_message', { text, user: 'Me' });
  };

  return (
    <div>
      {messages.map((m, i) => <p key={i}>{m.user}: {m.text}</p>)}
      <button onClick={() => sendMessage('Hello World!')}>Send</button>
    </div>
  );
}`
  },
  {
    slug: "server-sent-events",
    title: "Server-Sent Events (SSE)",
    tags: ["Server-Sent Events", "One-way communication"],
    description: "A standard HTTP connection that stays open, allowing the server to push a stream of updates to the client.",
    insights: "WHEN/WHERE TO USE: Live sports scores, real-time stock tickers, or streaming AI responses (like ChatGPT). WHY: Unlike WebSockets (which are two-way), SSE is one-way (Server -> Client). It runs over standard HTTP, making it vastly simpler to deploy, scale, and route through corporate firewalls.",
    code: `import { useEffect, useState } from 'react';

export function LiveTicker() {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Connect to the SSE endpoint
    const eventSource = new EventSource('/api/stock-ticker');

    // Listen for messages pushed from the server
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(data.currentPrice);
    };

    // Clean up the connection on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return <div>Current Price: \${price.toFixed(2)}</div>;
}`
  },
  {
    slug: "webhooks-background-jobs",
    title: "Webhooks & Background Jobs",
    tags: ["Webhooks", "Background jobs", "Asynchronous processing"],
    description: "Techniques for handling long-running tasks and receiving real-time events from external 3rd-party services.",
    insights: "WHEN/WHERE TO USE: Stripe payment successes, GitHub PR merges, or generating heavy PDF reports. WHY: You cannot make a user wait 30 seconds for an HTTP request to finish rendering a video. Offload the task to a Background Job queue (like Redis/BullMQ). Use Webhooks so external services can notify your server the exact moment an event happens.",
    code: `// Next.js Route Handler receiving a Stripe Webhook
import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    // Verify the webhook is actually from Stripe
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the real-time event asynchronously
  if (event.type === 'payment_intent.succeeded') {
    const payment = event.data.object;
    // Trigger background job to fulfill order
    await queueFulfillmentJob(payment.id); 
  }

  // Acknowledge receipt immediately
  return NextResponse.json({ received: true });
}`
  },
  {
    slug: "push-notifications",
    title: "Web Push Notifications",
    tags: ["Push notifications", "Service Workers"],
    description: "Engaging users with native-feeling notifications even when they do not have your web application open.",
    insights: "WHEN/WHERE TO USE: Important alerts (e.g., 'Your flight is boarding', or 'New direct message'). WHY: To re-engage users who have closed the browser tab. It requires registering a Service Worker and getting explicit permission from the user. Don't spam them, or they will revoke permissions permanently.",
    code: `// Registering for Push Notifications in the Browser
export async function subscribeToNotifications() {
  // 1. Request permission
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    // 2. Get the Service Worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // 3. Subscribe to the Push Service
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY)
    });
    
    // 4. Send subscription object to your backend to save it
    await fetch('/api/save-subscription', {
      method: 'POST',
      body: JSON.stringify(subscription)
    });
  }
}`
  }
];
