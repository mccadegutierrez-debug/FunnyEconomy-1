import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export default function Mines() {
  const [bet, setBet] = useState(100);
  const [tilesRevealed, setTilesRevealed] = useState(5);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const playMutation = useMutation({
    mutationFn: async ({
      betAmount,
      tiles,
    }: {
      betAmount: number;
      tiles: number;
    }) => {
      const res = await apiRequest("POST", "/api/games/mines", {
        bet: betAmount,
        tilesRevealed: tiles,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setIsRevealing(true);
      setTimeout(() => {
        setIsRevealing(false);
        setGameResult(data);
        toast({
          title: data.win ? "Mines Win! 💎" : "Mine Hit! 💣",
          description: data.win
            ? `Revealed ${data.tilesRevealed} safe tiles! ${data.multiplier}x multiplier!`
            : `Hit a mine after ${data.tilesRevealed} tiles!`,
          variant: data.win ? "default" : "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });

        if (data.win) {
          createConfetti();
        }
      }, 2000);
    },
    onError: (error: Error) => {
      setIsRevealing(false);
      toast({
        title: "Game Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.animationDelay = Math.random() * 3 + "s";
      confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  };

  const handlePlay = () => {
    if (bet < 10 || bet > 150000) {
      toast({
        title: "Invalid Bet",
        description: "Bet must be between 10 and 150,000 coins",
        variant: "destructive",
      });
      return;
    }

    if (!user || user.coins < bet) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough coins for this bet",
        variant: "destructive",
      });
      return;
    }

    setGameResult(null);
    playMutation.mutate({ betAmount: bet, tiles: tilesRevealed });
  };

  const quickBets = [10, 50, 100, 500, 1000];

  const getTileDisplay = (index: number) => {
    if (!gameResult) return "❓";
    if (gameResult.revealedPositions.includes(index)) {
      if (gameResult.minePositions.includes(index)) {
        return "💣";
      }
      return "💎";
    }
    return "❓";
  };

  const potentialWin = Math.pow(1.2, tilesRevealed);

  return (
    <div className="space-y-6">
      <Card className="glow-secondary border-secondary/20">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">💣</div>
          <CardTitle className="font-impact text-3xl text-secondary">
            MINES
          </CardTitle>
          <CardDescription>
            Reveal tiles without hitting a mine!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted p-6">
            <div className="grid grid-cols-5 gap-2 mb-4">
              {Array.from({ length: 25 }, (_, i) => i).map((index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-3xl transition-all ${
                    gameResult && gameResult.revealedPositions.includes(index)
                      ? gameResult.minePositions.includes(index)
                        ? "bg-destructive border-destructive animate-pulse"
                        : "bg-green-500 border-green-500"
                      : "bg-muted border-primary/20 hover:border-primary"
                  } ${isRevealing ? "animate-pulse" : ""}`}
                  data-testid={`tile-${index}`}
                >
                  {getTileDisplay(index)}
                </div>
              ))}
            </div>

            {isRevealing && (
              <div className="text-center">
                <p className="text-lg font-semibold">Revealing tiles...</p>
              </div>
            )}
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tiles-revealed">
                Tiles to Reveal: {tilesRevealed}
              </Label>
              <Slider
                id="tiles-revealed"
                min={1}
                max={20}
                step={1}
                value={[tilesRevealed]}
                onValueChange={(value) => setTilesRevealed(value[0])}
                disabled={isRevealing || playMutation.isPending}
                data-testid="slider-tiles-revealed"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 tile</span>
                <span>20 tiles</span>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Potential: {potentialWin.toFixed(2)}x
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bet-amount">Bet Amount</Label>
              <Input
                id="bet-amount"
                type="number"
                min="10"
                max="150000"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                className="text-center text-lg font-bold"
                data-testid="input-mines-bet"
              />
              <div className="flex justify-center space-x-2">
                {quickBets.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setBet(amount)}
                    className="font-comic"
                    data-testid={`button-quick-bet-${amount}`}
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handlePlay}
              disabled={
                isRevealing ||
                playMutation.isPending ||
                !user ||
                user.coins < bet
              }
              className="w-full font-comic text-lg bg-secondary hover:bg-secondary/80 glow-secondary"
              data-testid="button-play-mines"
            >
              {isRevealing
                ? "REVEALING..."
                : playMutation.isPending
                  ? "Loading..."
                  : `REVEAL TILES! (${bet} coins)`}
            </Button>
          </div>

          {gameResult && !isRevealing && (
            <Card
              className={`${gameResult.win ? "border-green-500 glow-accent" : "border-destructive"}`}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">
                  {gameResult.win ? "💎" : "💣"}
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${gameResult.win ? "text-green-500" : "text-destructive"}`}
                >
                  {gameResult.win ? "SAFE!" : "MINE HIT!"}
                </h3>
                <div className="mb-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {gameResult.tilesRevealed} tiles revealed
                  </Badge>
                </div>
                {gameResult.win && (
                  <Badge variant="default" className="text-lg px-4 py-2 mb-2">
                    {gameResult.multiplier}x Multiplier!
                  </Badge>
                )}
                <p
                  className={`text-lg font-semibold ${gameResult.win ? "text-green-500" : "text-destructive"}`}
                >
                  {gameResult.win ? "+" : ""}
                  {gameResult.amount} coins
                </p>
                <p className="text-muted-foreground">
                  New Balance: {gameResult.newBalance.toLocaleString()} coins
                </p>
                <Button
                  onClick={() => setGameResult(null)}
                  className="mt-4 font-comic"
                  data-testid="button-play-again-mines"
                >
                  Play Again
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• 25 tiles total, 5 contain mines 💣</p>
              <p>• Choose how many tiles to reveal (1-20)</p>
              <p>• Each safe tile = 1.2x multiplier (compounded)</p>
              <p>• Hit a mine = lose everything</p>
              <p>• More tiles = higher risk, higher reward!</p>
              <p>• Bet between 10 and 150,000 coins</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
