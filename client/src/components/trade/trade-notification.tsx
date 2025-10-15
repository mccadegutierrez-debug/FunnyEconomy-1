import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, HandshakeIcon } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UsernameLink } from "@/components/ui/username-link";

interface TradeNotificationProps {
  offerId: string;
  fromUsername: string;
  onAccept: (tradeId: string) => void;
  onDismiss: () => void;
}

export function TradeNotification({
  offerId,
  fromUsername,
  onAccept,
  onDismiss,
}: TradeNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 30000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleAccept = async () => {
    try {
      const response = await apiRequest(
        "POST",
        `/api/trades/offers/${offerId}/accept`
      );
      const data = await response.json();

      if (data.trade) {
        onAccept(data.trade.id);
        setIsVisible(false);
        toast({
          title: "Trade Started",
          description: `Now trading with ${fromUsername}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept trade offer",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    try {
      await apiRequest("POST", `/api/trades/offers/${offerId}/reject`);
      setIsVisible(false);
      onDismiss();
      toast({
        title: "Trade Declined",
        description: `Rejected trade offer from ${fromUsername}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject trade offer",
        variant: "destructive",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <Card 
      className="fixed bottom-4 right-4 z-50 p-4 bg-card border-2 border-primary shadow-lg animate-in slide-in-from-bottom-5"
      data-testid="trade-notification"
    >
      <div className="flex items-center gap-4">
        <HandshakeIcon className="w-8 h-8 text-primary" />
        <div className="flex-1">
          <p className="font-bold text-primary">
            Trade Request
          </p>
          <p className="text-sm text-muted-foreground">
            <UsernameLink username={fromUsername} className="font-semibold text-foreground" /> wants to trade with you!
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setIsVisible(false);
            onDismiss();
          }}
          data-testid="button-close-notification"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-2 mt-3">
        <Button
          onClick={handleAccept}
          className="flex-1"
          data-testid="button-accept-trade"
        >
          Accept
        </Button>
        <Button
          onClick={handleReject}
          variant="outline"
          className="flex-1"
          data-testid="button-reject-trade"
        >
          Reject
        </Button>
      </div>
    </Card>
  );
}
