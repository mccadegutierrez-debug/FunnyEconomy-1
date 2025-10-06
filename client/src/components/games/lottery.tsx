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

export default function Lottery() {
  const [bet, setBet] = useState(100);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const playMutation = useMutation({
    mutationFn: async ({
      betAmount,
      numbers,
    }: {
      betAmount: number;
      numbers: number[];
    }) => {
      const res = await apiRequest("POST", "/api/games/lottery", {
        bet: betAmount,
        numbers,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setIsDrawing(true);
      setTimeout(() => {
        setIsDrawing(false);
        setGameResult(data);
        toast({
          title: data.win ? "Lottery Win! 🎟️" : "Lottery Loss 😔",
          description: `${data.matches} matches! ${data.win ? `${data.multiplier}x multiplier!` : "Better luck next time!"}`,
          variant: data.win ? "default" : "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });

        if (data.win) {
          createConfetti();
        }
      }, 3000);
    },
    onError: (error: Error) => {
      setIsDrawing(false);
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

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const handlePlay = () => {
    if (selectedNumbers.length !== 5) {
      toast({
        title: "Invalid Selection",
        description: "You must pick exactly 5 numbers",
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
    playMutation.mutate({ betAmount: bet, numbers: selectedNumbers });
  };

  const quickBets = [10, 50, 100, 500, 1000];
  const quickPick = () => {
    const numbers: number[] = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 50) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  return (
    <div className="space-y-6">
      <Card className="glow-primary border-primary/20">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🎟️</div>
          <CardTitle className="font-impact text-3xl text-primary">
            LOTTERY
          </CardTitle>
          <CardDescription>Pick 5 lucky numbers and win big!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">
                  Pick 5 Numbers (1-50)
                </Label>
                <Button
                  onClick={quickPick}
                  size="sm"
                  variant="outline"
                  disabled={isDrawing || playMutation.isPending}
                  data-testid="button-quick-pick"
                >
                  Quick Pick
                </Button>
              </div>

              <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    variant={
                      selectedNumbers.includes(num) ? "default" : "outline"
                    }
                    className={`w-full h-10 text-sm ${selectedNumbers.includes(num) ? "bg-primary" : ""}`}
                    onClick={() => toggleNumber(num)}
                    disabled={
                      isDrawing ||
                      playMutation.isPending ||
                      (selectedNumbers.length >= 5 &&
                        !selectedNumbers.includes(num))
                    }
                    data-testid={`button-number-${num}`}
                  >
                    {num}
                  </Button>
                ))}
              </div>

              <div className="flex justify-center space-x-2 mt-4">
                {selectedNumbers.length > 0 ? (
                  selectedNumbers.map((num, index) => (
                    <Badge
                      key={index}
                      variant="default"
                      className="text-lg px-4 py-2"
                    >
                      {num}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">Select 5 numbers</p>
                )}
              </div>

              {isDrawing && (
                <div className="text-center">
                  <div className="text-4xl animate-bounce">🎱</div>
                  <p className="text-lg font-semibold mt-2">
                    Drawing numbers...
                  </p>
                </div>
              )}

              {gameResult && !isDrawing && (
                <div className="mt-4">
                  <p className="text-center text-lg font-semibold mb-2">
                    Winning Numbers:
                  </p>
                  <div className="flex justify-center space-x-2">
                    {gameResult.winningNumbers.map(
                      (num: number, index: number) => (
                        <Badge
                          key={index}
                          variant={
                            gameResult.playerNumbers.includes(num)
                              ? "default"
                              : "secondary"
                          }
                          className="text-lg px-4 py-2"
                        >
                          {num}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

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
                data-testid="input-lottery-bet"
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
                selectedNumbers.length !== 5 ||
                isDrawing ||
                playMutation.isPending ||
                !user ||
                user.coins < bet
              }
              className="w-full font-comic text-lg bg-primary hover:bg-primary/80 glow-primary"
              data-testid="button-play-lottery"
            >
              {isDrawing
                ? "DRAWING..."
                : playMutation.isPending
                  ? "Loading..."
                  : `PLAY LOTTERY! (${bet} coins)`}
            </Button>
          </div>

          {gameResult && !isDrawing && (
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
                  {gameResult.win ? "YOU WIN!" : "NO MATCH!"}
                </h3>
                <div className="mb-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {gameResult.matches} matches
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
                  onClick={() => {
                    setGameResult(null);
                    setSelectedNumbers([]);
                  }}
                  className="mt-4 font-comic"
                  data-testid="button-play-again-lottery"
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
              <p>• Pick 5 numbers from 1 to 50</p>
              <p>• Use Quick Pick for random selection</p>
              <p>• Match 3 numbers = 2x payout</p>
              <p>• Match 4 numbers = 10x payout</p>
              <p>• Match 5 numbers = 100x JACKPOT!</p>
              <p>• Bet between 10 and 150,000 coins</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
