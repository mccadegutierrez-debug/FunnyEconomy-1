import { useEffect, useRef, useState } from "react";
import { useAuth } from "./use-auth";

interface ChatMessage {
  type: string;
  username?: string;
  message?: string;
  timestamp?: number;
  id?: string;
}

export function useWebSocket() {
  const { user } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // Fetch chat history from the server
  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/chat/history?limit=50');
      if (response.ok) {
        const history = await response.json();
        // Convert database messages to chat message format
        const chatMessages = history.map((msg: any) => ({
          type: 'chat',
          id: msg.id,
          username: msg.username,
          message: msg.message,
          timestamp: new Date(msg.timestamp).getTime(),
        }));
        console.log('[WebSocket Client] Loaded chat history:', chatMessages.length, 'messages');
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error('[WebSocket Client] Failed to load chat history:', error);
    }
  };

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      setConnected(false);
      setAuthenticated(false);
      return;
    }

    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      console.log('[WebSocket Client] Connecting to:', wsUrl);

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('[WebSocket Client] Connection opened');
        setConnected(true);
        // Load chat history before clearing messages
        fetchChatHistory();
        // Send auth message to authenticate with session cookies
        ws.current?.send(JSON.stringify({ type: "auth" }));
        console.log('[WebSocket Client] Sent auth message');
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[WebSocket Client] Received message:', message);

          // Handle authentication response
          if (message.type === "auth_success") {
            console.log('[WebSocket Client] Authentication successful!');
            setAuthenticated(true);
          } else if (message.type === "auth_error") {
            console.log('[WebSocket Client] Authentication failed:', message.message);
            setAuthenticated(false);
            // Only try to reconnect once after a delay
            if (ws.current) {
              ws.current.close();
            }
          } else if (message.type === "chat") {
            // Only add chat messages to the messages array, avoid duplicates
            setMessages((prev) => {
              // Check if message already exists (by id or timestamp+username)
              const exists = prev.some(
                (m) => 
                  (message.id && m.id === message.id) ||
                  (m.username === message.username && 
                   m.timestamp === message.timestamp &&
                   m.message === message.message)
              );
              
              if (exists) {
                return prev;
              }
              
              const newMessages = [...prev.slice(-99), message];
              console.log('[WebSocket Client] Chat messages array updated:', newMessages.length);
              return newMessages;
            });
          } else if (message.type === "system") {
            // Add system messages too
            setMessages((prev) => [...prev.slice(-99), message]);
          } else if (message.type === "error") {
            console.log('[WebSocket Client] Error message:', message.message);
          }
        } catch (error) {
          console.error('[WebSocket Client] Parse error:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('[WebSocket Client] Connection closed');
        setConnected(false);
        setAuthenticated(false);
      };

      ws.current.onerror = (error) => {
        console.error('[WebSocket Client] Connection error:', error);
      };
    };

    connectWebSocket();

    return () => {
      ws.current?.close();
    };
  }, [user]); // Depend on user to reconnect when authentication changes

  const sendMessage = (message: string, username: string) => {
    if (ws.current?.readyState === WebSocket.OPEN && authenticated) {
      ws.current.send(
        JSON.stringify({
          type: "chat",
          username,
          message,
        }),
      );
    }
  };

  return { messages, connected, authenticated, sendMessage };
}
