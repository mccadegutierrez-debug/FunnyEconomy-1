import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import excitedImage from "/excited.png";

export default function FreemiumPage() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [reward, setReward] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const claimMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/freemium/claim");
      return res.json();
    },
    onSuccess: (data) => {
      setReward(data);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/freemium/next"] });
      
      // Show success with confetti
      createConfetti();
      
      let title = "Reward Claimed! 🎁";
      let description = "";
      
      switch (data.type) {
        case 'coins':
          title = "Coin Reward! 💰";
          description = `You received ${data.amount} coins!`;
          break;
        case 'item':
          title = `${data.rarity.charAt(0).toUpperCase() + data.rarity.slice(1)} Item! ✨`;
          description = `You received a ${data.item.name}!`;
          break;
        case 'lootbox':
          title = "Lootbox Reward! 📦";
          description = `You received a ${data.item.name} with ${data.lootboxContents.length} items inside!`;
          break;
      }
      
      toast({
        title,
        description,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Claim Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCardClick = (cardIndex: number) => {
    if (isAnimating || flippedCards.includes(cardIndex)) return;
    
    setIsAnimating(true);
    setSelectedCard(cardIndex);
    
    // Flip the card
    setTimeout(() => {
      setFlippedCards([...flippedCards, cardIndex]);
      setIsAnimating(false);
      
      // Claim the reward
      claimMutation.mutate();
    }, 600);
  };

  const resetCards = () => {
    setFlippedCards([]);
    setSelectedCard(null);
    setReward(null);
  };

  const createConfetti = () => {
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  };

  const renderReward = () => {
    if (!reward) return null;
    
    switch (reward.type) {
      case 'coins':
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">💰</div>
            <h3 className="text-3xl font-bold text-accent mb-2">
              {reward.amount} Coins!
            </h3>
            <p className="text-muted-foreground">
              Your new balance: {reward.newBalance} coins
            </p>
          </div>
        );
      case 'item':
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">✨</div>
            <h3 className="text-3xl font-bold text-primary mb-2">
              {reward.item.name}
            </h3>
            <p className="text-muted-foreground capitalize">
              Rarity: {reward.rarity}
            </p>
          </div>
        );
      case 'lootbox':
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">📦</div>
            <h3 className="text-3xl font-bold text-secondary mb-2">
              {reward.item.name}
            </h3>
            <p className="text-muted-foreground">
              Contains {reward.lootboxContents.length} items!
            </p>
          </div>
        );
      default:
        return null;
    }
  };

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
              This page helps fund free content. Pick one card to claim your reward!
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              <span>The first <span className="text-primary font-bold">3</span> cards are guaranteed</span>
            </div>
          </div>

          {/* Cards Section */}
          <div className="relative mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[0, 1, 2].map((cardIndex) => (
                <div key={cardIndex} className="perspective-1000">
                  <div
                    className={`card-flip-container ${flippedCards.includes(cardIndex) ? 'flipped' : ''}`}
                    onClick={() => handleCardClick(cardIndex)}
                    data-testid={`card-${cardIndex}`}
                  >
                    {/* Card Front (Back side with image) */}
                    <div className="card-face card-front">
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
                    <div className="card-face card-back">
                      <Card className="h-80 border-4 border-accent glow-accent bg-gradient-to-br from-primary/20 to-accent/20">
                        <CardContent className="h-full flex items-center justify-center">
                          {selectedCard === cardIndex && reward ? (
                            renderReward()
                          ) : (
                            <Gift className="w-24 h-24 text-primary" />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            {flippedCards.length > 0 && (
              <Button
                onClick={resetCards}
                size="lg"
                className="font-bold"
                data-testid="button-claim-another"
              >
                <Gift className="w-5 h-5 mr-2" />
                Claim Another Reward
              </Button>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center">
            <Card className="bg-muted/50 border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">How it works</h3>
                <ul className="space-y-2 text-left max-w-2xl mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>Pick any of the 3 cards to reveal your reward</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>You can claim free rewards every 10 seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>Rewards include coins, items, and special lootboxes!</span>
                  </li>
                </ul>
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
