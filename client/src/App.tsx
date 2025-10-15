import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import GamesPage from "@/pages/games-page";
import ShopPage from "@/pages/shop-page";
import InventoryPage from "@/pages/inventory-page";
import LeaderboardPage from "@/pages/leaderboard-page";
import PetsPage from "@/pages/pets-page";
import AdminPage from "@/pages/admin-page";
import ProfilePage from "@/pages/profile-page";
import PublicProfilePage from "@/pages/public-profile-page";
import FreemiumPage from "@/pages/freemium-page";
import ChangelogPage from "@/pages/changelog-page";
import NotFound from "@/pages/not-found";
import BanPage from "@/pages/ban-page";
import { useTradeWebSocket } from "@/hooks/use-trade-websocket";
import { TradeNotification } from "@/components/trade/trade-notification";
import { TradingWindow } from "@/components/trade/trading-window";
import { useState, useEffect } from "react";


function Router() {
  const { isBanned, banInfo, user, isLoading } = useAuth();
  const { messages } = useTradeWebSocket();
  const [tradeOffer, setTradeOffer] = useState<{
    offerId: string;
    fromUsername: string;
  } | null>(null);
  const [activeTrade, setActiveTrade] = useState<{
    tradeId: string;
    otherUsername: string;
  } | null>(null);

  useEffect(() => {
    // Listen for trade offers and trade started messages
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.type === "trade_offer" && user) {
      // Check if this trade offer is for the current user
      if (
        latestMessage.targetUsername === user.username &&
        latestMessage.offerId &&
        latestMessage.fromUsername
      ) {
        setTradeOffer({
          offerId: latestMessage.offerId,
          fromUsername: latestMessage.fromUsername,
        });
      }
    } else if (latestMessage?.type === "trade_started" && user) {
      // Open trade window for both users when trade is started
      if (
        (latestMessage.fromUsername === user.username ||
          latestMessage.toUsername === user.username) &&
        latestMessage.tradeId &&
        latestMessage.fromUsername &&
        latestMessage.toUsername
      ) {
        const otherUsername =
          latestMessage.fromUsername === user.username
            ? latestMessage.toUsername
            : latestMessage.fromUsername;
        
        setActiveTrade({
          tradeId: latestMessage.tradeId,
          otherUsername: otherUsername,
        });
      }
    }
  }, [messages, user]);

  // If user is banned, show ban page instead of normal router
  if (isBanned && banInfo) {
    return (
      <BanPage
        banType={banInfo.type}
        reason={banInfo.reason}
        banUntil={banInfo.banUntil}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }


  return (
    <>
      <Switch>
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/games" component={GamesPage} />
        <ProtectedRoute path="/freemium" component={FreemiumPage} />
        <ProtectedRoute path="/shop" component={ShopPage} />
        <ProtectedRoute path="/inventory" component={InventoryPage} />
        <ProtectedRoute path="/pets" component={PetsPage} />
        <ProtectedRoute path="/leaderboard" component={LeaderboardPage} />
        <Route path="/changelog" component={ChangelogPage} />
        <Route path="/profile/:username" component={PublicProfilePage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/admin" component={AdminPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
      {tradeOffer && (
        <TradeNotification
          offerId={tradeOffer.offerId}
          fromUsername={tradeOffer.fromUsername}
          onAccept={(tradeId) => {
            setTradeOffer(null);
            setActiveTrade({
              tradeId,
              otherUsername: tradeOffer.fromUsername,
            });
          }}
          onDismiss={() => setTradeOffer(null)}
        />
      )}
      {activeTrade && (
        <TradingWindow
          tradeId={activeTrade.tradeId}
          isOpen={true}
          onClose={() => setActiveTrade(null)}
          otherUsername={activeTrade.otherUsername}
        />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="dark min-h-screen bg-background text-foreground">
            <Toaster />
            <Router />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;