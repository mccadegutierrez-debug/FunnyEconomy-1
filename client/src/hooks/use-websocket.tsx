import { useEffect, useRef, useState } from "react";
import { useAuth } from "./use-auth";

interface ChatMessage {
  type: string;
  username?: string;
  message?: string;
  timestamp?: number;
}

export function useWebSocket() {
  const { user } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

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

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setConnected(true);
        // Send auth message to authenticate with session cookies
        ws.current?.send(JSON.stringify({ type: "auth" }));
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          // Handle authentication response
          if (message.type === "auth_success") {
            setAuthenticated(true);
            console.log("WebSocket authenticated successfully");
          } else if (message.type === "auth_error") {
            setAuthenticated(false);
            console.warn("WebSocket authentication failed:", message.message);
            // Try to reconnect after a short delay in case session was just loading
            setTimeout(() => {
              if (ws.current?.readyState === WebSocket.CLOSED) {
                connectWebSocket();
              }
            }, 2000);
          } else if (message.type === "chat") {
            // Only add chat messages to the messages array
            setMessages((prev) => [...prev.slice(-99), message]); // Keep last 100 messages
          } else if (message.type === "error") {
            console.error("WebSocket error:", message.message);
          }
        } catch (error) {
          console.error("WebSocket message parse error:", error);
        }
      };

      ws.current.onclose = () => {
        setConnected(false);
        setAuthenticated(false);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket connection error:", error);
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
