import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Coins, CheckCircle, Clock, Package } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useTradeWebSocket } from "@/hooks/use-trade-websocket";

interface TradingWindowProps {
  tradeId: string;
  isOpen: boolean;
  onClose: () => void;
  otherUsername: string;
}

interface TradeData {
  id: string;
  userId1: string;
  userId2: string;
  status: string;
  user1Ready: boolean;
  user2Ready: boolean;
  items: TradeItem[];
}

interface TradeItem {
  id: string;
  tradeId: string;
  userId: string;
  itemType: "item" | "pet" | "collectible" | "coins";
  itemId: string | null;
  quantity: number;
}

const itemCategories = [
  { id: "all", label: "All Items" },
  { id: "tool", label: "Tools" },
  { id: "collectible", label: "Collectibles" },
  { id: "powerup", label: "Powerups" },
  { id: "consumable", label: "Consumables" },
  { id: "lootbox", label: "Lootboxes" },
  { id: "pet", label: "Pets" },
];

export function TradingWindow({ tradeId, isOpen, onClose, otherUsername }: TradingWindowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, sendTradeUpdate } = useTradeWebSocket();
  const [activeCategory, setActiveCategory] = useState("all");
  const [coinsToAdd, setCoinsToAdd] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tradeData, refetch } = useQuery<TradeData>({
    queryKey: ["/api/trades", tradeId],
    enabled: isOpen && !!tradeId,
  });

  const { data: userInventory } = useQuery<any>({
    queryKey: ["/api/user"],
    enabled: isOpen,
  });

  const { data: userPets } = useQuery<any[]>({
    queryKey: ["/api/pets"],
    enabled: isOpen,
  });

  const { data: allItems } = useQuery<any[]>({
    queryKey: ["/api/items"],
    enabled: isOpen,
  });

  useEffect(() => {
    const tradeMessages = messages.filter(
      (msg) => msg.type === "trade_update" && msg.tradeId === tradeId
    );
    
    if (tradeMessages.length > 0) {
      refetch();
    }
  }, [messages, tradeId, refetch]);

  const addItemMutation = useMutation({
    mutationFn: async (params: { itemType: string; itemId: string | null; quantity: number }) => {
      const response = await apiRequest("POST", `/api/trades/${tradeId}/add-item`, { body: params });
      return await response.json();
    },
    onSuccess: (data, variables) => {
      refetch();
      sendTradeUpdate(tradeId, "add_item", user!.id, variables);
      toast({
        title: "Item Added",
        description: "Item added to trade",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (tradeItemId: string) => {
      const response = await apiRequest("POST", `/api/trades/${tradeId}/remove-item`, { body: { tradeItemId } });
      return await response.json();
    },
    onSuccess: (_, tradeItemId) => {
      refetch();
      sendTradeUpdate(tradeId, "remove_item", user!.id, { tradeItemId });
      toast({
        title: "Item Removed",
        description: "Item removed from trade",
      });
    },
  });

  const acceptTradeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/trades/${tradeId}/accept`);
      return await response.json();
    },
    onSuccess: (data: any) => {
      if (data.success && data.message) {
        toast({
          title: "Trade Completed!",
          description: data.message,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        onClose();
      } else {
        refetch();
      }
    },
  });

  const cancelTradeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/trades/${tradeId}/cancel`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Trade Cancelled",
        description: "Trade has been cancelled",
      });
      onClose();
    },
  });

  const handleAddCoins = () => {
    const amount = parseInt(coinsToAdd);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid coin amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > (userInventory?.coins || 0)) {
      toast({
        title: "Insufficient Coins",
        description: "You don't have enough coins",
        variant: "destructive",
      });
      return;
    }

    addItemMutation.mutate({
      itemType: "coins",
      itemId: null,
      quantity: amount,
    });
    setCoinsToAdd("");
  };

  const handleAddItem = (itemId: string, itemType: string) => {
    addItemMutation.mutate({
      itemType,
      itemId,
      quantity: 1,
    });
  };

  const handleAddPet = (petId: string) => {
    addItemMutation.mutate({
      itemType: "pet",
      itemId: petId,
      quantity: 1,
    });
  };

  if (!tradeData || !user) return null;

  const myItems = tradeData.items.filter((item) => item.userId === user.id);
  const theirItems = tradeData.items.filter((item) => item.userId !== user.id);
  const isUser1 = tradeData.userId1 === user.id;
  const myReadyStatus = isUser1 ? tradeData.user1Ready : tradeData.user2Ready;
  const theirReadyStatus = isUser1 ? tradeData.user2Ready : tradeData.user1Ready;

  const availableItems = (userInventory?.inventory || []).filter((item: any) => {
    if (!allItems) return false;
    const itemData = allItems.find((i) => i.id === item.itemId);
    if (!itemData) return false;
    
    if (activeCategory !== "all" && itemData.type !== activeCategory) return false;
    if (searchQuery && !itemData.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  const availablePets = (userPets || []).filter((pet: any) => {
    if (activeCategory !== "all" && activeCategory !== "pet") return false;
    if (searchQuery && !pet.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return !pet.isDead;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-testid="trading-window">
        <DialogHeader>
          <DialogTitle className="font-impact text-2xl text-primary flex items-center gap-2">
            <Package className="w-6 h-6" />
            Trading with {otherUsername}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card className="p-4 border-2 border-primary/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">Your Offer</h3>
              {myReadyStatus ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Ready
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  Preparing
                </Badge>
              )}
            </div>

            <div className="space-y-2 min-h-[200px] max-h-[300px] overflow-y-auto">
              {myItems.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No items added yet
                </p>
              ) : (
                myItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                    data-testid={`my-trade-item-${item.id}`}
                  >
                    <div className="flex items-center gap-2">
                      {item.itemType === "coins" ? (
                        <Coins className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Package className="w-5 h-5" />
                      )}
                      <span className="text-sm">
                        {item.itemType === "coins"
                          ? `${item.quantity} coins`
                          : `${item.itemType} x${item.quantity}`}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItemMutation.mutate(item.id)}
                      data-testid={`button-remove-item-${item.id}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-4 border-2 border-secondary/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{otherUsername}'s Offer</h3>
              {theirReadyStatus ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Ready
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  Preparing
                </Badge>
              )}
            </div>

            <div className="space-y-2 min-h-[200px] max-h-[300px] overflow-y-auto">
              {theirItems.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No items added yet
                </p>
              ) : (
                theirItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-muted rounded"
                    data-testid={`their-trade-item-${item.id}`}
                  >
                    {item.itemType === "coins" ? (
                      <Coins className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Package className="w-5 h-5" />
                    )}
                    <span className="text-sm">
                      {item.itemType === "coins"
                        ? `${item.quantity} coins`
                        : `${item.itemType} x${item.quantity}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter coins amount"
              value={coinsToAdd}
              onChange={(e) => setCoinsToAdd(e.target.value)}
              data-testid="input-coins-amount"
            />
            <Button onClick={handleAddCoins} data-testid="button-add-coins">
              <Coins className="w-4 h-4 mr-2" />
              Add Coins
            </Button>
          </div>

          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-items"
          />

          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-7 w-full">
              {itemCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  data-testid={`tab-${cat.id}`}
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {itemCategories.map((cat) => (
              <TabsContent
                key={cat.id}
                value={cat.id}
                className="max-h-[200px] overflow-y-auto"
              >
                <div className="grid grid-cols-3 gap-2">
                  {cat.id === "pet" || cat.id === "all" ? (
                    availablePets.map((pet: any) => (
                      <Button
                        key={pet.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddPet(pet.id)}
                        data-testid={`button-add-pet-${pet.id}`}
                      >
                        {pet.name}
                      </Button>
                    ))
                  ) : null}
                  
                  {cat.id !== "pet" ? (
                    availableItems.map((item: any) => {
                      const itemData = allItems?.find((i) => i.id === item.itemId);
                      return (
                        <Button
                          key={item.itemId}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddItem(item.itemId, itemData?.type || "item")}
                          data-testid={`button-add-item-${item.itemId}`}
                        >
                          {itemData?.name || "Unknown"} (x{item.quantity})
                        </Button>
                      );
                    })
                  ) : null}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <Separator />

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => cancelTradeMutation.mutate()}
            data-testid="button-cancel-trade"
          >
            Cancel Trade
          </Button>
          <Button
            onClick={() => acceptTradeMutation.mutate()}
            disabled={myReadyStatus}
            data-testid="button-accept-trade"
          >
            {myReadyStatus ? "Waiting for other player..." : "Accept Trade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
