import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AVAILABLE_PETS, getPetById, calculateStatDecay } from '@shared/pets-data';
import { UserPet } from '@shared/schema';
import { Heart, Sparkles, Bath, Bed, ShoppingCart, Search } from 'lucide-react';

export default function PetsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [adoptDialog, setAdoptDialog] = useState<string | null>(null);

  // Fetch user's pets
  const { data: userPets = [] } = useQuery<UserPet[]>({
    queryKey: ['/api/pets/user'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pets/user');
      return res.json();
    },
    enabled: !!user,
  });

  // Adopt pet mutation
  const adoptPetMutation = useMutation({
    mutationFn: async (petId: string) => {
      const res = await apiRequest('POST', `/api/pets/adopt`, { petId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setAdoptDialog(null);
      toast({
        title: 'Pet Adopted! 🎉',
        description: 'Your new pet is ready to be cared for!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Adoption Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Pet care mutations
  const careForPetMutation = useMutation({
    mutationFn: async ({ petId, action }: { petId: string; action: 'feed' | 'clean' | 'play' | 'sleep' }) => {
      const res = await apiRequest('POST', `/api/pets/${petId}/${action}`);
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/user'] });
      const actionNames = {
        feed: 'Fed',
        clean: 'Cleaned',
        play: 'Played with',
        sleep: 'Put to sleep'
      };
      toast({
        title: `${actionNames[variables.action]} your pet! ✨`,
        description: 'Your pet feels much better now!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Care Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Filter pets based on search and rarity
  const filteredPets = AVAILABLE_PETS.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || pet.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const calculateCurrentStats = (pet: UserPet) => {
    const petType = getPetById(pet.petId);
    if (!petType) return { hunger: 0, hygiene: 0, energy: 0, fun: 0 };

    return {
      hunger: calculateStatDecay(pet.lastFed, petType.hungerDecay),
      hygiene: calculateStatDecay(pet.lastCleaned, petType.hygieneDecay),
      energy: calculateStatDecay(pet.lastSlept, petType.energyDecay),
      fun: calculateStatDecay(pet.lastPlayed, petType.funDecay),
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-impact text-primary dm-title mb-4">🐾 Pets</h1>
        <p className="text-muted-foreground">
          All the pets available in Funny Economy, including their details, cosmetics, and values.
        </p>
      </div>

      <Tabs defaultValue="my-pets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-pets" data-testid="tab-my-pets">My Pets</TabsTrigger>
          <TabsTrigger value="adopt" data-testid="tab-adopt">Adopt Pets</TabsTrigger>
        </TabsList>

        {/* My Pets Tab */}
        <TabsContent value="my-pets" className="space-y-6">
          {userPets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">🐕</div>
                <h3 className="text-xl font-bold mb-2">No Pets Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Adopt your first pet from the "Adopt Pets" tab!
                </p>
                <Button onClick={() => (document.querySelector('[data-testid="tab-adopt"]') as HTMLElement)?.click()}>
                  Adopt a Pet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPets.map((pet) => {
                const petType = getPetById(pet.petId);
                if (!petType) return null;
                
                const stats = calculateCurrentStats(pet);
                
                return (
                  <Card key={pet.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{petType.emoji}</span>
                          <div>
                            <CardTitle className="text-lg">{pet.petName}</CardTitle>
                            <CardDescription>{petType.name}</CardDescription>
                          </div>
                        </div>
                        <Badge className={`${getRarityColor(petType.rarity)} text-white`}>
                          {petType.rarity}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Pet Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">🍖 Hunger</span>
                          <span className="text-sm">{stats.hunger}%</span>
                        </div>
                        <Progress value={stats.hunger} className={`h-2 ${getStatColor(stats.hunger)}`} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">🧼 Hygiene</span>
                          <span className="text-sm">{stats.hygiene}%</span>
                        </div>
                        <Progress value={stats.hygiene} className={`h-2 ${getStatColor(stats.hygiene)}`} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">⚡ Energy</span>
                          <span className="text-sm">{stats.energy}%</span>
                        </div>
                        <Progress value={stats.energy} className={`h-2 ${getStatColor(stats.energy)}`} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">🎮 Fun</span>
                          <span className="text-sm">{stats.fun}%</span>
                        </div>
                        <Progress value={stats.fun} className={`h-2 ${getStatColor(stats.fun)}`} />
                      </div>
                      
                      {/* Care Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-4">
                        <Button
                          size="sm"
                          variant={stats.hunger < 50 ? "default" : "outline"}
                          onClick={() => careForPetMutation.mutate({ petId: pet.id, action: 'feed' })}
                          disabled={careForPetMutation.isPending}
                          data-testid={`button-feed-${pet.id}`}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Feed
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={stats.hygiene < 50 ? "default" : "outline"}
                          onClick={() => careForPetMutation.mutate({ petId: pet.id, action: 'clean' })}
                          disabled={careForPetMutation.isPending}
                          data-testid={`button-clean-${pet.id}`}
                        >
                          <Bath className="w-4 h-4 mr-1" />
                          Clean
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={stats.fun < 50 ? "default" : "outline"}
                          onClick={() => careForPetMutation.mutate({ petId: pet.id, action: 'play' })}
                          disabled={careForPetMutation.isPending}
                          data-testid={`button-play-${pet.id}`}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Play
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={stats.energy < 50 ? "default" : "outline"}
                          onClick={() => careForPetMutation.mutate({ petId: pet.id, action: 'sleep' })}
                          disabled={careForPetMutation.isPending}
                          data-testid={`button-sleep-${pet.id}`}
                        >
                          <Bed className="w-4 h-4 mr-1" />
                          Sleep
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Adopt Pets Tab */}
        <TabsContent value="adopt" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Pets</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search pets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-pets"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="rarity">Filter by Rarity</Label>
              <select
                id="rarity"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                data-testid="select-rarity-filter"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredPets.map((pet) => {
              const isOwned = userPets.some(userPet => userPet.petId === pet.id);
              
              return (
                <Card key={pet.id} className="relative">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="text-4xl">{pet.emoji}</div>
                      <h3 className="font-bold text-sm">{pet.name}</h3>
                      <Badge className={`${getRarityColor(pet.rarity)} text-white text-xs`}>
                        {pet.rarity}
                      </Badge>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>🍖 {pet.hungerDecay}h</div>
                        <div>🧼 {pet.hygieneDecay}h</div>
                        <div>⚡ {pet.energyDecay}h</div>
                        <div>🎮 {pet.funDecay}h</div>
                      </div>
                      
                      {isOwned ? (
                        <Badge variant="outline" className="w-full">
                          Owned
                        </Badge>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className="w-full"
                              data-testid={`button-adopt-${pet.id}`}
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              💰 {pet.adoptionCost.toLocaleString()}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adopt {pet.name} {pet.emoji}</DialogTitle>
                              <DialogDescription>
                                {pet.description}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong>Rarity:</strong>
                                  <Badge className={`ml-2 ${getRarityColor(pet.rarity)} text-white`}>
                                    {pet.rarity}
                                  </Badge>
                                </div>
                                <div>
                                  <strong>Cost:</strong> 💰 {pet.adoptionCost.toLocaleString()}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-medium">Care Requirements:</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>🍖 Hunger: Every {pet.hungerDecay}h</div>
                                  <div>🧼 Hygiene: Every {pet.hygieneDecay}h</div>
                                  <div>⚡ Energy: Every {pet.energyDecay}h</div>
                                  <div>🎮 Fun: Every {pet.funDecay}h</div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => adoptPetMutation.mutate(pet.id)}
                                  disabled={adoptPetMutation.isPending || (user?.coins || 0) < pet.adoptionCost}
                                  className="flex-1"
                                  data-testid={`button-confirm-adopt-${pet.id}`}
                                >
                                  {adoptPetMutation.isPending ? 'Adopting...' : 'Adopt Pet'}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}