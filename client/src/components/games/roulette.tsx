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

export default function Roulette() {
  const [bet, setBet] = useState(100);
  const [betType, setBetType] = useState<
    "red" | "black" | "green" | "odd" | "even" | "high" | "low" | null
  >(null);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const playMutation = useMutation({
    mutationFn: async ({
      betAmount,
      selectedBetType,
    }: {
      betAmount: number;
      selectedBetType: string;
    }) => {
      const res = await apiRequest("POST", "/api/games/roulette", {
        bet: betAmount,
        betType: selectedBetType,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setIsSpinning(true);
      setTimeout(() => {
        setIsSpinning(false);
        setGameResult(data);
        toast({
          title: data.win ? "Roulette Win! 🎡" : "Roulette Loss 😔",
          description: `Ball landed on ${data.number} (${data.color})! You ${data.win ? "won" : "lost"} ${Math.abs(data.amount)} coins!`,
          variant: data.win ? "default" : "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      }, 2500);
    },
    onError: (error: Error) => {
      setIsSpinning(false);
      toast({
        title: "Game Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSpin = () => {
    if (!betType) {
      toast({
        title: "Place Your Bet",
        description: "Select a bet type before spinning",
        variant: "destructive",
      });
      return;
    }

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
    playMutation.mutate({ betAmount: bet, selectedBetType: betType });
  };

  const quickBets = [10, 50, 100, 500, 1000];

  return (
    <div className="space-y-6">
      <Card className="glow-secondary border-secondary/20">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">🎡</div>
          <CardTitle className="font-impact text-3xl text-secondary">
            ROULETTE
          </CardTitle>
          <CardDescription>
            Spin the wheel and bet on colors or numbers!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wheel Display */}
          <Card className="bg-muted p-6">
            <div className="flex justify-center mb-6">
              <div
                className={`w-40 h-40 rounded-full border-8 border-secondary flex items-center justify-center text-6xl ${
                  isSpinning ? "animate-spin" : ""
                }`}
                style={{
                  background:
                    gameResult && !isSpinning
                      ? gameResult.color === "red"
                        ? "linear-gradient(45deg, #dc2626, #ef4444)"
                        : gameResult.color === "black"
                          ? "linear-gradient(45deg, #1f2937, #374151)"
                          : "linear-gradient(45deg, #16a34a, #22c55e)"
                      : "linear-gradient(45deg, #6b7280, #9ca3af)",
                }}
                data-testid="roulette-wheel"
              >
                {isSpinning ? "🎡" : gameResult ? gameResult.number : "?"}
              </div>
            </div>

            {gameResult && !isSpinning && (
              <div className="text-center space-y-2">
                <Badge variant="secondary" className="text-xl px-6 py-2">
                  {gameResult.number} - {gameResult.color.toUpperCase()}
                </Badge>
              </div>
            )}
          </Card>

          {/* Bet Selection */}
          <div className="space-y-4">
            <Label className="text-center block text-lg font-semibold">
              Place Your Bet
            </Label>

            {/* Color Bets */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-center">Colors</div>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={betType === "red" ? "default" : "outline"}
                  onClick={() => setBetType("red")}
                  className="h-16 font-comic text-sm bg-red-600 hover:bg-red-700"
                  disabled={isSpinning || playMutation.isPending}
                  data-testid="button-bet-red"
                >
                  <div className="flex-col">
                    <div className="text-xl mb-1">🔴</div>
                    <div>RED (1.9x)</div>
                  </div>
                </Button>
                <Button
                  variant={betType === "black" ? "default" : "outline"}
                  onClick={() => setBetType("black")}
                  className="h-16 font-comic text-sm bg-gray-800 hover:bg-gray-900"
                  disabled={isSpinning || playMutation.isPending}
                  data-testid="button-bet-black"
                >
                  <div className="flex-col">
                    <div className="text-xl mb-1">⚫</div>
                    <div>BLACK (1.9x)</div>
                  </div>
                </Button>
                <Button
                  variant={betType === "green" ? "default" : "outline"}
                  onClick={() => setBetType("green")}
                  className="h-16 font-comic text-sm bg-green-600 hover:bg-green-700"
                  disabled={isSpinning || playMutation.isPending}
                  data-testid="button-bet-green"
                >
                  <div className="flex-col">
                    <div className="text-xl mb-1">🟢</div>
                    <div>GREEN (35x)</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Other Bets */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-center">Other Bets</div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={betType === "odd" ? "default" : "outline"}
                  onClick={() => setBetType("odd")}
                  className="h-14 font-comic"
                  disabled={isSpinning || playMutation.isPending}
                  data-testid="button-bet-odd"
                >
                  ODD (1.9x)
                </Button>
                <Button
                  variant={betType === "even" ? "default" : "outline"}
                  onClick={() => setBetType("even")}
                  className="h-14 font-comic"
                  disabled={isSpinning || playMutation.isPending}
                  data-testid="button-bet-even"
                >
                  EVEN (1.9x)
                </Button>
                <Button
                  variant={betType === "low" ? "default" : "outline"}
                  onClick={() => setBetType("low")}
                  className="h-14 font-comic"
                  disabled={isSpinning || playMutation.isPending}
                  data-testid="button-bet-low"
                >
                  LOW 1-18 (1.9x)
                </Button>
                <Button
                  variant={betType === "high" ? "default" : "outline"}
                  onClick={() => setBetType("high")}
                  className="h-14 font-comic"
                  disabled={isSpinning || playMutation.isPending}
                  data-testid="button-bet-high"
                >
                  HIGH 19-36 (1.9x)
                </Button>
              </div>
            </div>
          </div>

          {/* Betting Interface */}
          <div className="space-y-4">
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
                data-testid="input-roulette-bet"
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
              onClick={handleSpin}
              disabled={
                !betType ||
                isSpinning ||
                playMutation.isPending ||
                !user ||
                user.coins < bet
              }
              className="w-full font-comic text-lg bg-secondary hover:bg-secondary/80 glow-secondary"
              data-testid="button-spin-roulette"
            >
              {isSpinning
                ? "SPINNING..."
                : playMutation.isPending
                  ? "Loading..."
                  : `SPIN! (${bet} coins)`}
            </Button>
          </div>

          {/* Game Result */}
          {gameResult && !isSpinning && (
            <Card
              className={`${gameResult.win ? "border-green-500 glow-accent" : "border-destructive"}`}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">
                  {gameResult.win ? "🎉" : "😔"}
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${gameResult.win ? "text-green-500" : "text-destructive"}`}
                >
                  {gameResult.win ? "YOU WIN!" : "YOU LOSE!"}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="text-lg">
                    Ball landed on:{" "}
                    <span className="font-bold">{gameResult.number}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Color: {gameResult.color.toUpperCase()} | Your bet:{" "}
                    {gameResult.betType.toUpperCase()}
                  </div>
                </div>
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
                  onClick={() => {
                    setGameResult(null);
                    setBetType(null);
                  }}
                  className="mt-4 font-comic"
                  data-testid="button-play-again-roulette"
                >
                  Spin Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Game Rules */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Choose a bet type (color, odd/even, high/low)</p>
              <p>• Red/Black: 1.9x payout (nearly 50/50 odds)</p>
              <p>• Green (0): 35x payout (rare!)</p>
              <p>• Odd/Even, High/Low: 1.9x payout</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
