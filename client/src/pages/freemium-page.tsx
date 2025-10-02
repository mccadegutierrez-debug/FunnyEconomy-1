import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MaintenanceScreen from "@/components/maintenance-screen";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import excitedImage from "/excited.png";

export default function FreemiumPage() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [selectedRewardIndex, setSelectedRewardIndex] = useState<number | null>(
    null,
  );
  const [claimed, setClaimed] = useState(false);
  const { toast } = useToast();

  // Check if freemium feature is enabled
  const {
    data: freemiumFeatureFlag,
    isLoading: featureFlagLoading,
    isError: featureFlagError,
  } = useQuery<{ enabled: boolean; description?: string }>({
    queryKey: ["/api/feature-flags/freemium"],
  });

  // Fetch or generate rewards
  const {
    data: rewardsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/freemium/pending"],
    queryFn: async () => {
      // First check for pending rewards
      const pendingRes = await apiRequest("GET", "/api/freemium/pending");
      const pendingData = await pendingRes.json();

      if (pendingData.rewards) {
        return pendingData.rewards;
      }

      // If no pending rewards, try to generate new ones
      const generateRes = await apiRequest("GET", "/api/freemium/generate");
      if (!generateRes.ok) {
        const errorData = await generateRes.json();
        throw new Error(errorData.error || "Failed to generate rewards");
      }
      const generateData = await generateRes.json();
      return generateData.rewards;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const rewards = rewardsData || [];

  const claimMutation = useMutation({
    mutationFn: async (rewardIndex: number) => {
      const res = await apiRequest("POST", "/api/freemium/claim", {
        rewardIndex,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setClaimed(true);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/freemium/next"] });
      queryClient.invalidateQueries({ queryKey: ["/api/freemium/pending"] });

      createConfetti();

      let title = "Reward Claimed! 🎁";
      let description = "";

      if (data.type === "coins") {
        title = "Coin Reward! 💰";
        description = `You received ${data.amount} coins!`;
      } else if (data.type === "item") {
        title = `${data.rarity.charAt(0).toUpperCase() + data.rarity.slice(1)} Item! ✨`;
        description = `You received ${data.name}!`;
      }

      toast({
        title,
        description,
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setFlippedCards([]);
        setSelectedRewardIndex(null);
        setClaimed(false);
        refetch();
      }, 3000);
    },
    onError: (error: Error) => {
      setSelectedRewardIndex(null);
      toast({
        title: "Claim Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCardClick = (cardIndex: number) => {
    if (flippedCards.includes(cardIndex) || claimed) return;

    setFlippedCards([...flippedCards, cardIndex]);
  };

  const handleSelectReward = (cardIndex: number) => {
    if (claimed || selectedRewardIndex !== null) return;

    // Can only select if all 3 cards are flipped
    if (flippedCards.length < 3) {
      toast({
        title: "Flip all cards first",
        description: "You must flip all 3 cards before selecting a reward",
        variant: "destructive",
      });
      return;
    }

    // Check if rewards exist before claiming
    if (!rewards || rewards.length === 0) {
      toast({
        title: "No rewards available",
        description: "Please wait for the page to load rewards",
        variant: "destructive",
      });
      return;
    }

    setSelectedRewardIndex(cardIndex);
    claimMutation.mutate(cardIndex);
  };

  const createConfetti = () => {
    for (let i = 0; i < 100; i++) {
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

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "glow-legendary";
      case "epic":
        return "glow-epic";
      case "rare":
        return "glow-rare";
      case "uncommon":
        return "glow-uncommon";
      case "common":
        return "glow-common";
      default:
        return "glow-primary";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-500";
      case "epic":
        return "border-purple-500";
      case "rare":
        return "border-blue-500";
      case "uncommon":
        return "border-green-500";
      case "common":
        return "border-gray-400";
      default:
        return "border-accent";
    }
  };

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

  if (featureFlagError || (freemiumFeatureFlag && !freemiumFeatureFlag.enabled)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <MaintenanceScreen
          featureName="Freemium Rewards"
          message={
            freemiumFeatureFlag?.description ||
            "The rewards system is currently under maintenance. Please check back later!"
          }
        />
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl">Loading rewards...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as Error).message || "";
    const hoursMatch = errorMessage.match(/(\d+)\s*hours?\s*remaining/i);
    const hoursRemaining = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8 bg-card/50 border-border/50">
              <div className="text-7xl mb-6">⏰</div>
              <h2 className="text-4xl font-bold mb-4">Come Back Later!</h2>
              <p className="text-xl text-muted-foreground mb-4">
                Your next reward will be ready in about{" "}
                <span className="text-primary font-bold">{hoursRemaining} hours</span>.
              </p>
              <p className="text-base text-muted-foreground mb-6">
                Daily rewards refresh every 12 hours. Check back soon for your next chance to claim awesome prizes!
              </p>
              <Button
                onClick={() => refetch()}
                data-testid="button-retry-rewards"
                variant="outline"
                className="mt-4"
              >
                Check Again
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-impact dm-title mb-4">
              Freemium Rewards
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Flip all 3 cards to see your rewards, then select one to claim!
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              {flippedCards.length < 3 ? (
                <span>Flip all cards to reveal your rewards</span>
              ) : (
                <span className="text-primary font-bold animate-pulse">
                  Now select the reward you want!
                </span>
              )}
            </div>
          </div>

          {/* Cards Section */}
          <div className="relative mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[0, 1, 2].map((cardIndex) => {
                const reward = rewards[cardIndex];
                const isFlipped = flippedCards.includes(cardIndex);
                const isSelected = selectedRewardIndex === cardIndex;

                return (
                  <div key={cardIndex} className="perspective-1000">
                    <div
                      className={`card-flip-container ${isFlipped ? "flipped" : ""}`}
                      data-testid={`card-${cardIndex}`}
                    >
                      {/* Card Front (Back side with image) */}
                      <div
                        className="card-face card-front"
                        onClick={() => !isFlipped && handleCardClick(cardIndex)}
                      >
                        <Card className="h-80 cursor-pointer hover:scale-105 transition-transform border-4 border-primary glow-primary">
                          <CardContent className="h-full flex flex-col items-center justify-center p-6">
                            <img
                              src={excitedImage}
                              alt="Card back"
                              className="w-full h-full object-contain"
                            />
                          </CardContent>
                        </Card>
                      </div>

                      {/* Card Back (Reward side) */}
                      <div
                        className="card-face card-back"
                        onClick={() =>
                          isFlipped && !claimed && handleSelectReward(cardIndex)
                        }
                      >
                        <Card
                          className={`h-80 border-4 ${reward && isFlipped ? getRarityBorder(reward.rarity) : "border-accent"} ${reward && isFlipped ? getRarityGlow(reward.rarity) : "glow-accent"} bg-gradient-to-br from-primary/20 to-accent/20 ${isFlipped && flippedCards.length === 3 && !claimed ? "cursor-pointer hover:scale-105" : ""} transition-all ${isSelected ? "ring-4 ring-yellow-500" : ""}`}
                        >
                          <CardContent className="h-full flex flex-col items-center justify-center p-4">
                            {reward && isFlipped ? (
                              <div
                                className="text-center"
                                data-testid={`reward-${cardIndex}`}
                              >
                                <div className="text-6xl mb-3 animate-bounce">
                                  {reward.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-2">
                                  {reward.name}
                                </h3>
                                <p className="text-sm text-muted-foreground capitalize mb-2">
                                  {reward.rarity}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {reward.description}
                                </p>
                                {flippedCards.length === 3 && !claimed && (
                                  <Button
                                    className="mt-4"
                                    size="sm"
                                    data-testid={`button-select-${cardIndex}`}
                                  >
                                    Select This Reward
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="text-6xl animate-pulse">🎁</div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center">
            <Card className="bg-muted/50 border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">How it works</h3>
                <ul className="space-y-2 text-left max-w-2xl mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>
                      Click each card to flip and reveal all 3 rewards
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>
                      After flipping all cards, select the reward you want
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>You can claim free rewards every 11 seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>
                      Your rewards persist even if you refresh the page!
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Reward Chances Section */}
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Reward Chances</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Each card has these odds of containing different reward types
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div
                    className="bg-background/50 rounded-lg p-3"
                    data-testid="chance-coins"
                  >
                    <div className="text-3xl mb-2">💰</div>
                    <div className="font-bold text-accent">Coins</div>
                    <div className="text-sm text-muted-foreground">
                      40% chance
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      100-500 coins
                    </div>
                  </div>
                  <div
                    className="bg-background/50 rounded-lg p-3"
                    data-testid="chance-common"
                  >
                    <div className="text-3xl mb-2">⚪</div>
                    <div className="font-bold">Common</div>
                    <div className="text-sm text-muted-foreground">
                      25% chance
                    </div>
                  </div>
                  <div
                    className="bg-background/50 rounded-lg p-3"
                    data-testid="chance-uncommon"
                  >
                    <div className="text-3xl mb-2">🟢</div>
                    <div className="font-bold text-green-500">Uncommon</div>
                    <div className="text-sm text-muted-foreground">
                      15% chance
                    </div>
                  </div>
                  <div
                    className="bg-background/50 rounded-lg p-3"
                    data-testid="chance-rare"
                  >
                    <div className="text-3xl mb-2">🔵</div>
                    <div className="font-bold text-blue-500">Rare</div>
                    <div className="text-sm text-muted-foreground">
                      10% chance
                    </div>
                  </div>
                  <div
                    className="bg-background/50 rounded-lg p-3"
                    data-testid="chance-epic"
                  >
                    <div className="text-3xl mb-2">🟣</div>
                    <div className="font-bold text-purple-500">Epic</div>
                    <div className="text-sm text-muted-foreground">
                      5% chance
                    </div>
                  </div>
                  <div
                    className="bg-background/50 rounded-lg p-3"
                    data-testid="chance-legendary"
                  >
                    <div className="text-3xl mb-2">🟡</div>
                    <div className="font-bold text-yellow-500">Legendary</div>
                    <div className="text-sm text-muted-foreground">
                      5% chance
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .card-flip-container {
          position: relative;
          width: 100%;
          height: 320px;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .card-flip-container.flipped {
          transform: rotateY(180deg);
        }
        
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .card-front {
          transform: rotateY(0deg);
        }
        
        .card-back {
          transform: rotateY(180deg);
        }
        
        /* Rarity-based glows */
        .glow-legendary {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4);
        }
        
        .glow-epic {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4);
        }
        
        .glow-rare {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4);
        }
        
        .glow-uncommon {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.4);
        }
        
        .glow-common {
          box-shadow: 0 0 20px rgba(156, 163, 175, 0.6), 0 0 40px rgba(156, 163, 175, 0.4);
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}
