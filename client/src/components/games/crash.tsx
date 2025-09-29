import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export default function Crash() {
  const [bet, setBet] = useState(100);
  const [cashoutAt, setCashoutAt] = useState(2.0);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const playMutation = useMutation({
    mutationFn: async ({ betAmount, cashout }: { betAmount: number; cashout: number }) => {
      const res = await apiRequest("POST", "/api/games/crash", { bet: betAmount, cashoutAt: cashout });
      return res.json();
    },
    onSuccess: (data) => {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
        setGameResult(data);
        toast({
          title: data.win ? "Crash Win! 🚀" : "Crash Loss 💥",
          description: `Crashed at ${data.crashPoint}x! You ${data.win ? 'won' : 'lost'} ${Math.abs(data.amount)} coins!`,
          variant: data.win ? "default" : "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      }, 2000);
    },
    onError: (error: Error) => {
      setIsPlaying(false);
      toast({
        title: "Game Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlay = () => {
    if (bet < 10 || bet > 10000) {
      toast({
        title: "Invalid Bet",
        description: "Bet must be between 10 and 10,000 coins",
        variant: "destructive",
      });
      return;
    }

    if (cashoutAt < 1.1 || cashoutAt > 100) {
      toast({
        title: "Invalid Cashout",
        description: "Cashout must be between 1.1x and 100x",
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
    playMutation.mutate({ betAmount: bet, cashout: cashoutAt });
  };

  const quickBets = [10, 50, 100, 500, 1000];
  const quickMultipliers = [1.5, 2, 3, 5, 10];

  return (
    <div className="space-y-6">
      <Card className="glow-accent border-accent/20">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">🚀</div>
          <CardTitle className="font-impact text-3xl text-accent">CRASH GAME</CardTitle>
          <CardDescription>Set your cashout multiplier - will it crash before you cash out?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Multiplier Display */}
          <Card className="bg-muted p-6">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold mb-4" data-testid="multiplier-display">
                {isPlaying ? (
                  <span className="text-green-500 animate-pulse">🚀 Rising...</span>
                ) : gameResult ? (
                  <span className={gameResult.win ? 'text-green-500' : 'text-red-500'}>
                    {gameResult.crashPoint}x
                  </span>
                ) : (
                  <span className="text-muted-foreground">Ready</span>
                )}
              </div>
              {gameResult && !isPlaying && (
                <Badge 
                  variant="secondary" 
                  className={`text-xl px-6 py-2 ${gameResult.win ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  Crashed at {gameResult.crashPoint}x
                </Badge>
              )}
            </div>
          </Card>

          {/* Cashout Multiplier Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cashout-multiplier">Auto Cashout at {cashoutAt.toFixed(1)}x</Label>
              <Slider
                id="cashout-multiplier"
                min={11}
                max={1000}
                step={1}
                value={[cashoutAt * 10]}
                onValueChange={(value) => setCashoutAt(value[0] / 10)}
                className="w-full"
                disabled={isPlaying || playMutation.isPending}
              />
              <div className="flex justify-center space-x-2">
                {quickMultipliers.map((mult) => (
                  <Button
                    key={mult}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setCashoutAt(mult)}
                    className="font-comic"
                    data-testid={`button-quick-mult-${mult}`}
                  >
                    {mult}x
                  </Button>
                ))}
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
                max="10000"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                className="text-center text-lg font-bold"
                data-testid="input-crash-bet"
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

            <div className="text-center text-sm text-muted-foreground mb-4">
              <p>Potential Win: {Math.floor(bet * cashoutAt)} coins ({cashoutAt}x)</p>
            </div>

            <Button
              onClick={handlePlay}
              disabled={isPlaying || playMutation.isPending || !user || user.coins < bet}
              className="w-full font-comic text-lg bg-accent hover:bg-accent/80 glow-accent"
              data-testid="button-play-crash"
            >
              {isPlaying ? "WATCHING..." : playMutation.isPending ? "Loading..." : `PLAY! (${bet} coins)`}
            </Button>
          </div>

          {/* Game Result */}
          {gameResult && !isPlaying && (
            <Card className={`${gameResult.win ? 'border-green-500 glow-accent' : 'border-destructive'}`}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">
                  {gameResult.win ? "🎉" : "💥"}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${gameResult.win ? 'text-green-500' : 'text-destructive'}`}>
                  {gameResult.win ? "CASHED OUT!" : "CRASHED!"}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="text-lg">
                    Crashed at: <span className="font-bold">{gameResult.crashPoint}x</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Your cashout: {gameResult.cashoutAt}x
                  </div>
                  {gameResult.win ? (
                    <div className="text-sm text-green-500">
                      ✅ You cashed out in time!
                    </div>
                  ) : (
                    <div className="text-sm text-red-500">
                      ❌ Crashed before cashout
                    </div>
                  )}
                </div>
                <p className={`text-lg font-semibold ${gameResult.win ? 'text-green-500' : 'text-destructive'}`}>
                  {gameResult.win ? '+' : ''}{gameResult.amount} coins
                </p>
                <p className="text-muted-foreground">
                  New Balance: {gameResult.newBalance.toLocaleString()} coins
                </p>
                <Button
                  onClick={() => setGameResult(null)}
                  className="mt-4 font-comic"
                  data-testid="button-play-again-crash"
                >
                  Play Again
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
              <p>• Set your auto-cashout multiplier (1.1x - 100x)</p>
              <p>• The multiplier increases until it crashes</p>
              <p>• If you cash out before crash: WIN!</p>
              <p>• If it crashes before your cashout: LOSE!</p>
              <p>• Higher multipliers = riskier but bigger rewards!</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
