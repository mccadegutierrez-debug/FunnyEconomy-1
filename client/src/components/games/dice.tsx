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

export default function Dice() {
  const [bet, setBet] = useState(100);
  const [prediction, setPrediction] = useState<
    "over" | "under" | "seven" | null
  >(null);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isRolling, setIsRolling] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const playMutation = useMutation({
    mutationFn: async ({
      betAmount,
      selectedPrediction,
    }: {
      betAmount: number;
      selectedPrediction: "over" | "under" | "seven";
    }) => {
      const res = await apiRequest("POST", "/api/games/dice", {
        bet: betAmount,
        prediction: selectedPrediction,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setIsRolling(true);
      setTimeout(() => {
        setIsRolling(false);
        setGameResult(data);
        toast({
          title: data.win ? "Dice Win! 🎲" : "Dice Loss 😔",
          description: `Rolled ${data.dice1} + ${data.dice2} = ${data.total}! You ${data.win ? "won" : "lost"} ${Math.abs(data.amount)} coins!`,
          variant: data.win ? "default" : "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      }, 1500);
    },
    onError: (error: Error) => {
      setIsRolling(false);
      toast({
        title: "Game Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRoll = () => {
    if (!prediction) {
      toast({
        title: "Make Your Prediction",
        description: "Select over, under, or seven before rolling",
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
    playMutation.mutate({ betAmount: bet, selectedPrediction: prediction });
  };

  const quickBets = [10, 50, 100, 500, 1000];

  return (
    <div className="space-y-6">
      <Card className="glow-primary border-primary/20">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">🎲</div>
          <CardTitle className="font-impact text-3xl text-primary">
            DICE GAME
          </CardTitle>
          <CardDescription>
            Roll two dice - predict over 7, under 7, or exactly 7!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dice Display */}
          <Card className="bg-muted p-6">
            <div className="flex justify-center gap-6 mb-6">
              <div
                className={`w-24 h-24 rounded-lg border-4 border-primary flex items-center justify-center text-5xl bg-white ${
                  isRolling ? "animate-spin" : ""
                }`}
                data-testid="dice1-display"
              >
                {isRolling ? "🎲" : gameResult ? gameResult.dice1 : "?"}
              </div>
              <div
                className={`w-24 h-24 rounded-lg border-4 border-primary flex items-center justify-center text-5xl bg-white ${
                  isRolling ? "animate-spin" : ""
                }`}
                data-testid="dice2-display"
              >
                {isRolling ? "🎲" : gameResult ? gameResult.dice2 : "?"}
              </div>
            </div>

            {gameResult && !isRolling && (
              <div className="text-center">
                <Badge variant="secondary" className="text-xl px-6 py-2">
                  Total: {gameResult.total}
                </Badge>
              </div>
            )}
          </Card>

          {/* Prediction Selection */}
          <div className="space-y-4">
            <Label className="text-center block text-lg font-semibold">
              Make Your Prediction
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={prediction === "under" ? "default" : "outline"}
                onClick={() => setPrediction("under")}
                className="h-20 font-comic text-sm flex-col bg-blue-600 hover:bg-blue-700"
                disabled={isRolling || playMutation.isPending}
                data-testid="button-predict-under"
              >
                <div className="text-2xl mb-1">⬇️</div>
                <div>UNDER 7</div>
                <div className="text-xs opacity-75">1.9x</div>
              </Button>
              <Button
                variant={prediction === "seven" ? "default" : "outline"}
                onClick={() => setPrediction("seven")}
                className="h-20 font-comic text-sm flex-col bg-green-600 hover:bg-green-700"
                disabled={isRolling || playMutation.isPending}
                data-testid="button-predict-seven"
              >
                <div className="text-2xl mb-1">🎯</div>
                <div>EXACTLY 7</div>
                <div className="text-xs opacity-75">5x</div>
              </Button>
              <Button
                variant={prediction === "over" ? "default" : "outline"}
                onClick={() => setPrediction("over")}
                className="h-20 font-comic text-sm flex-col bg-orange-600 hover:bg-orange-700"
                disabled={isRolling || playMutation.isPending}
                data-testid="button-predict-over"
              >
                <div className="text-2xl mb-1">⬆️</div>
                <div>OVER 7</div>
                <div className="text-xs opacity-75">1.9x</div>
              </Button>
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
                data-testid="input-dice-bet"
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

            {prediction && (
              <div className="text-center text-sm text-muted-foreground mb-4">
                <p>
                  Payout: {prediction === "seven" ? "5x" : "1.9x"}
                  (Win{" "}
                  {prediction === "seven"
                    ? bet * 5
                    : Math.floor(bet * 1.9)}{" "}
                  coins)
                </p>
              </div>
            )}

            <Button
              onClick={handleRoll}
              disabled={
                !prediction ||
                isRolling ||
                playMutation.isPending ||
                !user ||
                user.coins < bet
              }
              className="w-full font-comic text-lg bg-primary hover:bg-primary/80 glow-primary"
              data-testid="button-roll-dice"
            >
              {isRolling
                ? "ROLLING..."
                : playMutation.isPending
                  ? "Loading..."
                  : `ROLL DICE! (${bet} coins)`}
            </Button>
          </div>

          {/* Game Result */}
          {gameResult && !isRolling && (
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
                    Rolled:{" "}
                    <span className="font-bold">
                      {gameResult.dice1} + {gameResult.dice2} ={" "}
                      {gameResult.total}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Your prediction: {gameResult.prediction.toUpperCase()}
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
                    setPrediction(null);
                  }}
                  className="mt-4 font-comic"
                  data-testid="button-play-again-dice"
                >
                  Roll Again
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
              <p>• Roll two dice (1-6 each)</p>
              <p>• Predict: UNDER 7 (2-6), EXACTLY 7, or OVER 7 (8-12)</p>
              <p>• Under/Over: 1.9x payout</p>
              <p>• Exactly 7: 5x payout (harder to hit!)</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
