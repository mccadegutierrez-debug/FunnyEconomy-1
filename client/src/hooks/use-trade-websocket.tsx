import { useEffect, useRef, useState } from "react";
import { useAuth } from "./use-auth";

interface TradeMessage {
  type: string;
  tradeId?: string;
  offerId?: string;
  fromUsername?: string;
  targetUsername?: string;
  action?: string;
  userId?: string;
  item?: any;
  result?: any;
  timestamp?: number;
}

export function useTradeWebSocket() {
  const { user } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<TradeMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
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
        ws.current?.send(JSON.stringify({ type: "auth" }));
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "auth_success") {
            setAuthenticated(true);
          } else if (message.type === "auth_error") {
            setAuthenticated(false);
          } else if (
            message.type === "trade_offer" ||
            message.type === "trade_update" ||
            message.type === "trade_accepted"
          ) {
            setMessages((prev) => [...prev.slice(-99), message]);
          }
        } catch (error) {
          console.error("[Trade WebSocket] Parse error:", error);
        }
      };

      ws.current.onclose = () => {
        setConnected(false);
        setAuthenticated(false);
      };

      ws.current.onerror = (error) => {
        console.error("[Trade WebSocket] Connection error:", error);
      };
    };

    connectWebSocket();

    return () => {
      ws.current?.close();
    };
  }, [user]);

  const sendTradeOffer = (targetUsername: string, offerId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN && authenticated) {
      ws.current.send(
        JSON.stringify({
          type: "trade_offer",
          targetUsername,
          offerId,
        })
      );
    }
  };

  const sendTradeUpdate = (
    tradeId: string,
    action: string,
    userId: string,
    item?: any
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN && authenticated) {
      ws.current.send(
        JSON.stringify({
          type: "trade_update",
          tradeId,
          action,
          userId,
          item,
        })
      );
    }
  };

  const sendTradeAccepted = (tradeId: string, result: any) => {
    if (ws.current?.readyState === WebSocket.OPEN && authenticated) {
      ws.current.send(
        JSON.stringify({
          type: "trade_accepted",
          tradeId,
          result,
        })
      );
    }
  };

  return {
    messages,
    connected,
    authenticated,
    sendTradeOffer,
    sendTradeUpdate,
    sendTradeAccepted,
  };
}
