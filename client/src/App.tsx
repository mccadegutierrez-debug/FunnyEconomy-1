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
import NotFound from "@/pages/not-found";
import BanPage from "@/pages/ban-page";

function Router() {
  const { isBanned, banInfo } = useAuth();

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

  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/games" component={GamesPage} />
      <ProtectedRoute path="/freemium" component={FreemiumPage} />
      <ProtectedRoute path="/shop" component={ShopPage} />
      <ProtectedRoute path="/inventory" component={InventoryPage} />
      <ProtectedRoute path="/pets" component={PetsPage} />
      <ProtectedRoute path="/leaderboard" component={LeaderboardPage} />
      <Route path="/profile/:username" component={PublicProfilePage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
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
