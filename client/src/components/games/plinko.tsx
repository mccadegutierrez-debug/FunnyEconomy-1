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

export default function Plinko() {
  const [bet, setBet] = useState(100);
  const [risk, setRisk] = useState<"low" | "medium" | "high">("medium");
  const [gameResult, setGameResult] = useState<any>(null);
  const [isDropping, setIsDropping] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const playMutation = useMutation({
    mutationFn: async ({
      betAmount,
      riskLevel,
    }: {
      betAmount: number;
      riskLevel: "low" | "medium" | "high";
    }) => {
      const res = await apiRequest("POST", "/api/games/plinko", {
        bet: betAmount,
        risk: riskLevel,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setIsDropping(true);
      setTimeout(() => {
        setIsDropping(false);
        setGameResult(data);
        toast({
          title: data.win ? "Plinko Win! 🎯" : "Plinko Loss 😔",
          description: `Ball landed in slot ${data.slotIndex}! ${data.multiplier}x multiplier!`,
          variant: data.win ? "default" : "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });

        if (data.win && data.multiplier >= 2) {
          createConfetti();
        }
      }, 3000);
    },
    onError: (error: Error) => {
      setIsDropping(false);
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
    if (bet < 10 || bet > 75000) {
      toast({
        title: "Invalid Bet",
        description: "Bet must be between 10 and 75,000 coins",
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
    playMutation.mutate({ betAmount: bet, riskLevel: risk });
  };

  const quickBets = [10, 50, 100, 500, 1000];

  const multipliers = {
    low: [1.5, 1.3, 1.1, 1.0, 0.9, 1.0, 1.1, 1.3, 1.5],
    medium: [3.0, 2.0, 1.5, 1.0, 0.5, 1.0, 1.5, 2.0, 3.0],
    high: [10.0, 5.0, 2.0, 1.0, 0.5, 1.0, 2.0, 5.0, 10.0],
  };

  const getSlotColor = (mult: number) => {
    if (mult >= 5) return "bg-yellow-500 text-black";
    if (mult >= 2) return "bg-green-500";
    if (mult >= 1) return "bg-blue-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Card className="glow-accent border-accent/20">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <CardTitle className="font-impact text-3xl text-accent">
            PLINKO
          </CardTitle>
          <CardDescription>Drop the ball and watch it bounce!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted p-6">
            <div className="space-y-4">
              {isDropping && (
                <div className="text-center mb-4">
                  <div className="text-6xl animate-bounce">🎱</div>
                  <p className="text-lg font-semibold mt-2">
                    Ball is dropping...
                  </p>
                </div>
              )}

              <div className="relative">
                <div className="flex justify-center mb-4">
                  <div className="text-4xl">🎱</div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {Array.from({ length: 21 }, (_, i) => (
                    <div key={i} className="text-center text-2xl">
                      🔵
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-9 gap-1 mt-4">
                  {multipliers[risk].map((mult, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-center font-bold text-sm ${getSlotColor(
                        mult,
                      )} ${gameResult && gameResult.slotIndex === index ? "ring-4 ring-white animate-pulse" : ""}`}
                      data-testid={`slot-${index}`}
                    >
                      {mult}x
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Risk Level</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={risk === "low" ? "default" : "outline"}
                  onClick={() => setRisk("low")}
                  disabled={isDropping || playMutation.isPending}
                  className="font-comic"
                  data-testid="button-risk-low"
                >
                  <div className="text-center">
                    <div className="text-xl">🟢</div>
                    <div>LOW</div>
                    <div className="text-xs">0.9x - 1.5x</div>
                  </div>
                </Button>
                <Button
                  variant={risk === "medium" ? "default" : "outline"}
                  onClick={() => setRisk("medium")}
                  disabled={isDropping || playMutation.isPending}
                  className="font-comic"
                  data-testid="button-risk-medium"
                >
                  <div className="text-center">
                    <div className="text-xl">🟡</div>
                    <div>MEDIUM</div>
                    <div className="text-xs">0.5x - 3x</div>
                  </div>
                </Button>
                <Button
                  variant={risk === "high" ? "default" : "outline"}
                  onClick={() => setRisk("high")}
                  disabled={isDropping || playMutation.isPending}
                  className="font-comic"
                  data-testid="button-risk-high"
                >
                  <div className="text-center">
                    <div className="text-xl">🔴</div>
                    <div>HIGH</div>
                    <div className="text-xs">0.5x - 10x</div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bet-amount">Bet Amount</Label>
              <Input
                id="bet-amount"
                type="number"
                min="10"
                max="75000"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                className="text-center text-lg font-bold"
                data-testid="input-plinko-bet"
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
                isDropping ||
                playMutation.isPending ||
                !user ||
                user.coins < bet
              }
              className="w-full font-comic text-lg bg-accent hover:bg-accent/80 glow-accent"
              data-testid="button-drop-ball"
            >
              {isDropping
                ? "DROPPING..."
                : playMutation.isPending
                  ? "Loading..."
                  : `DROP BALL! (${bet} coins)`}
            </Button>
          </div>

          {gameResult && !isDropping && (
            <Card
              className={`${gameResult.win ? "border-green-500 glow-accent" : "border-destructive"}`}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">
                  {gameResult.multiplier >= 5
                    ? "🎉"
                    : gameResult.win
                      ? "✅"
                      : "😔"}
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${gameResult.win ? "text-green-500" : "text-destructive"}`}
                >
                  {gameResult.multiplier >= 5
                    ? "BIG WIN!"
                    : gameResult.win
                      ? "YOU WIN!"
                      : "YOU LOSE!"}
                </h3>
                <div className="mb-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Slot {gameResult.slotIndex}
                  </Badge>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2 mb-2">
                  {gameResult.multiplier}x Multiplier!
                </Badge>
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
                  data-testid="button-play-again-plinko"
                >
                  Drop Again
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Choose your risk level (Low/Medium/High)</p>
              <p>• Low risk: Safer, smaller multipliers (0.9x-1.5x)</p>
              <p>• Medium risk: Balanced (0.5x-3x)</p>
              <p>• High risk: Big wins or losses (0.5x-10x)</p>
              <p>• Ball bounces through pegs to land in a slot</p>
              <p>• Bet between 10 and 75,000 coins</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
