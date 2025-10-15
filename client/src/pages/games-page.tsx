import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MaintenanceScreen from "@/components/maintenance-screen";
import Blackjack from "@/components/games/blackjack";
import Slots from "@/components/games/slots";
import Coinflip from "@/components/games/coinflip";
import Trivia from "@/components/games/trivia";
import Dice from "@/components/games/dice";
import Roulette from "@/components/games/roulette";
import Crash from "@/components/games/crash";
import Lottery from "@/components/games/lottery";
import Mines from "@/components/games/mines";
import Plinko from "@/components/games/plinko";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GamesPage() {
  const { user } = useAuth();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Check if games feature is enabled
  const {
    data: gamesFeatureFlag,
    isLoading: featureFlagLoading,
    isError: featureFlagError,
  } = useQuery<{ enabled: boolean; description?: string }>({
    queryKey: ["/api/feature-flags/games"],
  });

  const games = [
    {
      id: "blackjack",
      name: "BLACKJACK",
      icon: "🃏",
      description: "Beat the dealer!",
      minBet: 10,
      maxBet: 150000,
      component: Blackjack,
      color: "primary",
    },
    {
      id: "slots",
      name: "MEME SLOTS",
      icon: "🎰",
      description: "Spin to win!",
      minBet: 10,
      maxBet: 150000,
      component: Slots,
      color: "secondary",
    },
    {
      id: "coinflip",
      name: "COINFLIP",
      icon: "🪙",
      description: "Heads or tails?",
      minBet: 10,
      maxBet: 150000,
      component: Coinflip,
      color: "accent",
    },
    {
      id: "dice",
      name: "DICE",
      icon: "🎲",
      description: "Roll and predict!",
      minBet: 10,
      maxBet: 150000,
      component: Dice,
      color: "primary",
    },
    {
      id: "roulette",
      name: "ROULETTE",
      icon: "🎡",
      description: "Spin the wheel!",
      minBet: 10,
      maxBet: 150000,
      component: Roulette,
      color: "secondary",
    },
    {
      id: "crash",
      name: "CRASH",
      icon: "🚀",
      description: "Cash out before crash!",
      minBet: 10,
      maxBet: 150000,
      component: Crash,
      color: "accent",
    },
    {
      id: "trivia",
      name: "MEME TRIVIA",
      icon: "🧠",
      description: "Test your meme knowledge!",
      minBet: 0,
      maxBet: 0,
      component: Trivia,
      color: "primary",
    },
    {
      id: "lottery",
      name: "LOTTERY",
      icon: "🎟️",
      description: "Pick your lucky numbers!",
      minBet: 10,
      maxBet: 150000,
      component: Lottery,
      color: "primary",
    },
    {
      id: "mines",
      name: "MINES",
      icon: "💣",
      description: "Avoid the mines!",
      minBet: 10,
      maxBet: 150000,
      component: Mines,
      color: "secondary",
    },
    {
      id: "plinko",
      name: "PLINKO",
      icon: "🎯",
      description: "Drop the ball!",
      minBet: 10,
      maxBet: 75000,
      component: Plinko,
      color: "accent",
    },
  ];

  const selectedGame = games.find((game) => game.id === activeGame);

  // Show maintenance screen if feature is disabled
  if (featureFlagLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]" data-testid="status-loading-feature-flag">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (featureFlagError || (gamesFeatureFlag && !gamesFeatureFlag.enabled)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <MaintenanceScreen
          featureName="Game System"
          message={
            gamesFeatureFlag?.description ||
            "The games are currently under maintenance. Please check back later!"
          }
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-8">
        <div className="text-center">
          <h1
            className="font-impact text-4xl text-secondary mb-2"
            data-testid="games-title"
          >
            🎮 MEME CASINO 🎮
          </h1>
          <p className="text-muted-foreground text-lg">
            Test your luck and skill in our collection of meme-themed games!
          </p>
        </div>

        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card
                key={game.id}
                className={`halloween-hover hover:scale-105 transition-transform cursor-pointer border-${game.color}/20 hover:border-${game.color} ${game.color === "primary" ? "glow-primary" : game.color === "secondary" ? "glow-secondary" : "glow-accent"}`}
                onClick={() => setActiveGame(game.id)}
                data-testid={`game-card-${game.id}`}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2 animate-bounce-slow">
                    {game.icon}
                  </div>
                  <CardTitle
                    className={`font-impact text-xl text-${game.color}`}
                  >
                    {game.name}
                  </CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {game.minBet > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Min Bet:</span>
                        <span className="text-accent">💰 {game.minBet}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Bet:</span>
                        <span className="text-accent">💰 {game.maxBet}</span>
                      </div>
                    </>
                  )}
                  {game.id === "trivia" && (
                    <div className="text-sm text-center">
                      <div className="text-accent">Questions: 100+</div>
                      <div className="text-muted-foreground">
                        Various difficulties
                      </div>
                    </div>
                  )}
                  <Button
                    className={`w-full font-comic bg-${game.color} text-${game.color}-foreground hover:bg-${game.color}/80`}
                    data-testid={`button-play-${game.id}`}
                  >
                    PLAY NOW!
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{selectedGame?.icon}</div>
                <div>
                  <h2 className="font-impact text-2xl text-primary">
                    {selectedGame?.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedGame?.description}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveGame(null)}
                data-testid="button-back-to-games"
              >
                ← Back to Games
              </Button>
            </div>

            {selectedGame && <selectedGame.component />}
          </div>
        )}

        {/* User Game Stats */}
        {user && (
          <Card data-testid="game-stats">
            <CardHeader>
              <CardTitle className="font-impact text-2xl text-primary">
                🏆 Your Game Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🃏</div>
                  <div className="font-bold text-primary">Blackjack</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.blackjackWins || 0} / L:{" "}
                    {(user.gameStats as any)?.blackjackLosses || 0}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🎰</div>
                  <div className="font-bold text-secondary">Slots</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.slotsWins || 0} / L:{" "}
                    {(user.gameStats as any)?.slotsLosses || 0}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🪙</div>
                  <div className="font-bold text-accent">Coinflip</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.coinflipWins || 0} / L:{" "}
                    {(user.gameStats as any)?.coinflipLosses || 0}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🎲</div>
                  <div className="font-bold text-primary">Dice</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.diceWins || 0} / L:{" "}
                    {(user.gameStats as any)?.diceLosses || 0}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🎡</div>
                  <div className="font-bold text-secondary">Roulette</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.rouletteWins || 0} / L:{" "}
                    {(user.gameStats as any)?.rouletteLosses || 0}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="font-bold text-accent">Crash</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.crashWins || 0} / L:{" "}
                    {(user.gameStats as any)?.crashLosses || 0}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="font-bold text-primary">Trivia</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.triviaWins || 0} / L:{" "}
                    {(user.gameStats as any)?.triviaLosses || 0}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🎟️</div>
                  <div className="font-bold text-primary">Lottery</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.lotteryWins || 0} / L:{" "}
                    {(user.gameStats as any)?.lotteryLosses || 0}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">💣</div>
                  <div className="font-bold text-secondary">Mines</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.minesWins || 0} / L:{" "}
                    {(user.gameStats as any)?.minesLosses || 0}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-bold text-accent">Plinko</div>
                  <div className="text-sm text-muted-foreground">
                    W: {(user.gameStats as any)?.plinkoWins || 0} / L:{" "}
                    {(user.gameStats as any)?.plinkoLosses || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}