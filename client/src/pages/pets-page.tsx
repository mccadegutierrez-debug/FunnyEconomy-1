import { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Heart, Sparkles, Zap, Droplets, Smile, Star, Plus, Home, Baby, Scissors, CheckCircle, Lock, Trophy, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Pet, PetType, PetRoom, PetSkill, PetSitter, PetBreeding, PetHunt } from '@shared/schema';
import { STATIC_PET_TYPES } from '@shared/pet-types-data';
import { AVAILABLE_SKILLS } from '@shared/pet-skills-data';
import { AVAILABLE_SITTERS } from '@shared/pet-sitters-data';
import { FLOOR_DECORATIONS, WALL_DECORATIONS, FLOOR_STYLES, WALL_STYLES } from '@shared/pet-decorations-data';

type PetWithType = Pet & { petType?: PetType };

export default function PetsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('my-pets');
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [selectedPet, setSelectedPet] = useState<PetWithType | null>(null);
  const [trainingDialogOpen, setTrainingDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);
  const [adoptDialogOpen, setAdoptDialogOpen] = useState(false);
  const [selectedPetType, setSelectedPetType] = useState<any>(null);
  const [customPetName, setCustomPetName] = useState('');
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<PetRoom | null>(null);
  const [newRoomName, setNewRoomName] = useState('');

  // Training state
  const [trainingPoints, setTrainingPoints] = useState({
    attack: 0,
    defense: 0,
    sustainability: 0,
    hunting: 0,
  });

  // Fetch user profile for coin balance
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user/profile'],
  });

  // Fetch user's pets
  const { data: pets = [], isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ['/api/pets'],
  });

  // Fetch pet types
  const { data: petTypes = [] } = useQuery<PetType[]>({
    queryKey: ['/api/pets/types'],
  });

  // Fetch pet skills
  const { data: petSkills = [] } = useQuery<PetSkill[]>({
    queryKey: ['/api/pets/skills'],
  });

  // Fetch pet rooms
  const { data: rooms = [] } = useQuery<PetRoom[]>({
    queryKey: ['/api/pets/rooms'],
  });

  // Fetch breeding attempts
  const { data: breedings = [] } = useQuery<PetBreeding[]>({
    queryKey: ['/api/pets/breeding'],
  });

  // Fetch active hunts
  const { data: hunts = [] } = useQuery<PetHunt[]>({
    queryKey: ['/api/pets/hunts'],
  });

  // Combine pets with their types
  const petsWithTypes: PetWithType[] = useMemo(() => {
    return pets.map(pet => {
      const petType = petTypes.find(pt => pt.id === pet.petTypeId) || 
                     STATIC_PET_TYPES.find(pt => pt.petId === pet.petTypeId);
      return { ...pet, petType };
    });
  }, [pets, petTypes]);

  // Adopt pet mutation
  const adoptMutation = useMutation({
    mutationFn: async ({ petTypeId, customName }: { petTypeId: string; customName?: string }) => {
      return await apiRequest('POST', '/api/pets/adopt', { petTypeId, customName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      toast({ title: '🎉 Pet Adopted!', description: 'Your new pet is ready to play!' });
      setAdoptDialogOpen(false);
      setCustomPetName('');
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Pet care mutations
  const feedMutation = useMutation({
    mutationFn: (petId: string) => apiRequest('POST', `/api/pets/${petId}/feed`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      toast({ title: '🍖 Fed!', description: 'Your pet is happy and full!' });
    },
  });

  const cleanMutation = useMutation({
    mutationFn: (petId: string) => apiRequest('POST', `/api/pets/${petId}/clean`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      toast({ title: '🛁 Cleaned!', description: 'Your pet is squeaky clean!' });
    },
  });

  const playMutation = useMutation({
    mutationFn: (petId: string) => apiRequest('POST', `/api/pets/${petId}/play`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      toast({ title: '🎾 Played!', description: 'Your pet had so much fun!' });
    },
  });

  const restMutation = useMutation({
    mutationFn: (petId: string) => apiRequest('POST', `/api/pets/${petId}/rest`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      toast({ title: '😴 Rested!', description: 'Your pet is well rested!' });
    },
  });

  // Training mutation
  const trainMutation = useMutation({
    mutationFn: ({ petId, stat, points }: { petId: string; stat: string; points: number }) => 
      apiRequest('POST', `/api/pets/${petId}/train`, { stat, points }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      toast({ title: '💪 Trained!', description: 'Your pet grew stronger!' });
      setTrainingDialogOpen(false);
      setTrainingPoints({ attack: 0, defense: 0, sustainability: 0, hunting: 0 });
    },
  });

  // Learn skill mutation
  const learnSkillMutation = useMutation({
    mutationFn: ({ petId, skillId }: { petId: string; skillId: string }) => 
      apiRequest('POST', `/api/pets/${petId}/learn-skill`, { skillId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      toast({ title: '✨ Skill Learned!', description: 'Your pet learned a new skill!' });
    },
  });

  // Prestige mutation
  const prestigeMutation = useMutation({
    mutationFn: (petId: string) => apiRequest('POST', `/api/pets/${petId}/prestige`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      toast({ title: '⭐ Prestiged!', description: 'Your pet has reached a new prestige level!' });
    },
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: (name: string) => apiRequest('POST', '/api/pets/rooms', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/rooms'] });
      toast({ title: '🏠 Room Created!', description: 'Your new pet room is ready!' });
      setNewRoomName('');
    },
  });

  // Update room mutation
  const updateRoomMutation = useMutation({
    mutationFn: ({ roomId, updates }: { roomId: string; updates: any }) => 
      apiRequest('PATCH', `/api/pets/rooms/${roomId}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/rooms'] });
      toast({ title: '✨ Room Updated!', description: 'Your room has been customized!' });
    },
  });

  // Assign pet to room mutation
  const assignPetMutation = useMutation({
    mutationFn: ({ roomId, petId }: { roomId: string; petId: string }) => 
      apiRequest('POST', `/api/pets/rooms/${roomId}/assign-pet`, { petId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pets/rooms'] });
      toast({ title: '🐾 Pet Assigned!', description: 'Your pet has moved to the room!' });
    },
  });

  // Start breeding mutation
  const startBreedingMutation = useMutation({
    mutationFn: ({ petId1, petId2 }: { petId1: string; petId2: string }) => 
      apiRequest('POST', '/api/pets/breeding', { petId1, petId2 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/breeding'] });
      toast({ title: '💕 Breeding Started!', description: 'Your pets are breeding! Check back in 24 hours.' });
    },
  });

  // Start hunt mutation
  const startHuntMutation = useMutation({
    mutationFn: ({ petId, huntType }: { petId: string; huntType: string }) => 
      apiRequest('POST', `/api/pets/${petId}/hunt`, { huntType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/hunts'] });
      toast({ title: '🏹 Hunt Started!', description: 'Your pet is on the hunt!' });
    },
  });

  // Filter pet types for adoption
  const filteredPetTypes = useMemo(() => {
    return STATIC_PET_TYPES.filter(pt => {
      const matchesSearch = pt.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = rarityFilter === 'all' || pt.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    });
  }, [searchQuery, rarityFilter]);

  // Calculate total training points allocated
  const totalTrainingPoints = trainingPoints.attack + trainingPoints.defense + 
                               trainingPoints.sustainability + trainingPoints.hunting;

  // Rarity colors
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

  // Calculate XP needed for next level
  const getXPForNextLevel = (level: number) => level * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-impact text-primary dm-title">🐾 Pet System</h1>
          <Button variant="outline" asChild data-testid="button-home">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground">
          Adopt, care for, train, and breed your pets! 💕
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5" data-testid="tabs-pet-system">
          <TabsTrigger value="my-pets" data-testid="tab-my-pets">My Pets</TabsTrigger>
          <TabsTrigger value="adopt" data-testid="tab-adopt">Adopt Pet</TabsTrigger>
          <TabsTrigger value="rooms" data-testid="tab-rooms">Pet Rooms</TabsTrigger>
          <TabsTrigger value="breeding" data-testid="tab-breeding">Breeding</TabsTrigger>
          <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
        </TabsList>

        {/* My Pets Tab */}
        <TabsContent value="my-pets" className="mt-6">
          {petsLoading ? (
            <div className="text-center py-12">Loading your pets...</div>
          ) : pets.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No Pets Yet</CardTitle>
                <CardDescription>Visit the Adopt Pet tab to get your first companion!</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {petsWithTypes.map((pet) => {
                const petTypeData = STATIC_PET_TYPES.find(pt => pt.petId === pet.petType?.petId);
                const xpProgress = (pet.xp / getXPForNextLevel(pet.level)) * 100;
                const learnedSkills = pet.skills as string[] || [];
                
                return (
                  <Card key={pet.id} className="relative overflow-hidden" data-testid={`card-pet-${pet.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={`/PetIcons/${petTypeData?.iconPath || 'futureupdate.png'}`} 
                            alt={petTypeData?.name || 'Pet'} 
                            className="w-16 h-16 object-contain"
                            data-testid={`img-pet-icon-${pet.id}`}
                          />
                          <div>
                            <CardTitle className="text-lg" data-testid={`text-pet-name-${pet.id}`}>{pet.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getRarityColor(petTypeData?.rarity || 'common')} data-testid={`badge-rarity-${pet.id}`}>
                                {petTypeData?.rarity || 'common'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">Lv. {pet.level}</span>
                              {pet.prestigeLevel > 0 && (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: pet.prestigeLevel }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* XP Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>XP</span>
                          <span>{pet.xp}/{getXPForNextLevel(pet.level)}</span>
                        </div>
                        <Progress value={xpProgress} className="h-2" data-testid={`progress-xp-${pet.id}`} />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Care Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span>Hunger</span>
                          </div>
                          <span className="text-xs">{pet.hunger}%</span>
                        </div>
                        <Progress value={pet.hunger} className="h-1.5 bg-red-100" data-testid={`progress-hunger-${pet.id}`} />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span>Hygiene</span>
                          </div>
                          <span className="text-xs">{pet.hygiene}%</span>
                        </div>
                        <Progress value={pet.hygiene} className="h-1.5 bg-blue-100" data-testid={`progress-hygiene-${pet.id}`} />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span>Energy</span>
                          </div>
                          <span className="text-xs">{pet.energy}%</span>
                        </div>
                        <Progress value={pet.energy} className="h-1.5 bg-yellow-100" data-testid={`progress-energy-${pet.id}`} />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Smile className="w-4 h-4 text-green-500" />
                            <span>Fun</span>
                          </div>
                          <span className="text-xs">{pet.fun}%</span>
                        </div>
                        <Progress value={pet.fun} className="h-1.5 bg-green-100" data-testid={`progress-fun-${pet.id}`} />
                      </div>

                      {/* Care Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => feedMutation.mutate(pet.id)}
                          disabled={feedMutation.isPending}
                          data-testid={`button-feed-${pet.id}`}
                        >
                          <Heart className="w-3 h-3 mr-1" /> Feed
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => cleanMutation.mutate(pet.id)}
                          disabled={cleanMutation.isPending}
                          data-testid={`button-clean-${pet.id}`}
                        >
                          <Droplets className="w-3 h-3 mr-1" /> Clean
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => playMutation.mutate(pet.id)}
                          disabled={playMutation.isPending}
                          data-testid={`button-play-${pet.id}`}
                        >
                          <Smile className="w-3 h-3 mr-1" /> Play
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => restMutation.mutate(pet.id)}
                          disabled={restMutation.isPending}
                          data-testid={`button-rest-${pet.id}`}
                        >
                          <Zap className="w-3 h-3 mr-1" /> Rest
                        </Button>
                      </div>

                      {/* Pet Stats */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Attack:</span> {pet.attack}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Defense:</span> {pet.defense}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Sustain:</span> {pet.sustainability}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Hunting:</span> {pet.hunting}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedPet(pet);
                            setTrainingDialogOpen(true);
                          }}
                          data-testid={`button-train-${pet.id}`}
                        >
                          <Trophy className="w-3 h-3 mr-1" /> Train
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => {
                            setSelectedPet(pet);
                            setSkillsDialogOpen(true);
                          }}
                          data-testid={`button-skills-${pet.id}`}
                        >
                          <Sparkles className="w-3 h-3 mr-1" /> Skills
                        </Button>
                      </div>

                      {/* Hunt Button */}
                      <Button 
                        size="sm" 
                        className="w-full" 
                        variant="outline"
                        onClick={() => startHuntMutation.mutate({ petId: pet.id, huntType: 'short' })}
                        disabled={startHuntMutation.isPending}
                        data-testid={`button-hunt-${pet.id}`}
                      >
                        🏹 Send Hunting
                      </Button>

                      {/* Prestige Button (only if max level) */}
                      {pet.level >= 50 && (
                        <Button 
                          size="sm" 
                          className="w-full" 
                          onClick={() => prestigeMutation.mutate(pet.id)}
                          disabled={prestigeMutation.isPending}
                          data-testid={`button-prestige-${pet.id}`}
                        >
                          <Star className="w-3 h-3 mr-1" /> Prestige
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Active Hunts */}
          {hunts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">🏹 Active Hunts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hunts.map((hunt) => {
                  const pet = pets.find(p => p.id === hunt.petId);
                  const timeLeft = new Date(hunt.completesAt).getTime() - Date.now();
                  const isComplete = timeLeft <= 0;
                  
                  return (
                    <Card key={hunt.id} data-testid={`card-hunt-${hunt.id}`}>
                      <CardHeader>
                        <CardTitle className="text-sm">{pet?.name} - {hunt.huntType} Hunt</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isComplete ? (
                          <Button size="sm" onClick={() => {
                            apiRequest('POST', `/api/pets/hunts/${hunt.id}/complete`)
                              .then(() => {
                                queryClient.invalidateQueries({ queryKey: ['/api/pets/hunts'] });
                                toast({ title: '🎉 Hunt Complete!', description: 'Your pet returned with rewards!' });
                              });
                          }} data-testid={`button-complete-hunt-${hunt.id}`}>
                            Collect Rewards
                          </Button>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Time remaining: {Math.floor(timeLeft / 60000)} minutes
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Adopt Pet Tab */}
        <TabsContent value="adopt" className="mt-6">
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search pets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-pets"
                />
              </div>
            </div>
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-40" data-testid="select-rarity-filter">
                <SelectValue placeholder="Filter by rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Your Balance:</span>
              <span className="text-lg" data-testid="text-coin-balance">{userProfile?.coins?.toLocaleString() || 0} 🪙</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPetTypes.map((petType) => (
              <Card key={petType.petId} className="cursor-pointer hover:shadow-lg transition-shadow" data-testid={`card-adopt-${petType.petId}`}>
                <CardHeader className="text-center pb-3">
                  <img 
                    src={`/PetIcons/${petType.iconPath}`} 
                    alt={petType.name} 
                    className="w-20 h-20 mx-auto mb-2 object-contain"
                    data-testid={`img-adopt-icon-${petType.petId}`}
                  />
                  <CardTitle className="text-lg">{petType.name}</CardTitle>
                  <Badge className={getRarityColor(petType.rarity)}>{petType.rarity}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{petType.description}</p>
                  <div className="text-xs space-y-1">
                    <div>Hunger Decay: {petType.hungerDecay}/hr</div>
                    <div>Hygiene Decay: {petType.hygieneDecay}/hr</div>
                    <div>Energy Decay: {petType.energyDecay}/hr</div>
                    <div>Fun Decay: {petType.funDecay}/hr</div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="font-bold text-center mb-2">{petType.adoptionCost.toLocaleString()} 🪙</div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => {
                        setSelectedPetType(petType);
                        setAdoptDialogOpen(true);
                      }}
                      disabled={!userProfile || userProfile.coins < petType.adoptionCost}
                      data-testid={`button-adopt-${petType.petId}`}
                    >
                      {!userProfile || userProfile.coins < petType.adoptionCost ? <Lock className="w-4 h-4 mr-1" /> : null}
                      Adopt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pet Rooms Tab */}
        <TabsContent value="rooms" className="mt-6">
          <div className="mb-6">
            <div className="flex gap-4">
              <Input
                placeholder="New room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                data-testid="input-room-name"
              />
              <Button 
                onClick={() => {
                  if (newRoomName.trim()) {
                    createRoomMutation.mutate(newRoomName);
                  }
                }}
                disabled={!newRoomName.trim() || rooms.length >= 10}
                data-testid="button-create-room"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Room {rooms.length >= 10 && '(Max 10)'}
              </Button>
            </div>
          </div>

          {rooms.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No Rooms Yet</CardTitle>
                <CardDescription>Create your first pet room above!</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const roomPets = pets.filter(p => p.roomId === room.id);
                return (
                  <Card 
                    key={room.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedRoom(room);
                      setRoomDialogOpen(true);
                    }}
                    data-testid={`card-room-${room.id}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        {room.name}
                      </CardTitle>
                      <CardDescription>
                        Pets: {roomPets.length}/5
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Floor:</span> {FLOOR_STYLES.find(s => s.id === room.floorStyle)?.name || 'Wooden'}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Walls:</span> {WALL_STYLES.find(s => s.id === room.wallStyle)?.name || 'Plain'}
                        </div>
                        {room.sitterId && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Sitter:</span> {AVAILABLE_SITTERS.find(s => s.sitterId === room.sitterId)?.name}
                          </div>
                        )}
                        <div className="pt-2 flex gap-2">
                          {roomPets.slice(0, 5).map(pet => {
                            const petTypeData = STATIC_PET_TYPES.find(pt => pt.petId === pet.petTypeId);
                            return (
                              <img 
                                key={pet.id} 
                                src={`/PetIcons/${petTypeData?.iconPath || 'futureupdate.png'}`} 
                                alt={petTypeData?.name || 'Pet'} 
                                className="w-8 h-8 object-contain"
                                data-testid={`img-room-pet-${pet.id}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Breeding Tab */}
        <TabsContent value="breeding" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Start Breeding</CardTitle>
              <CardDescription>Select two compatible pets to breed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select data-testid="select-pet1-breeding">
                  <SelectTrigger>
                    <SelectValue placeholder="Select first pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} (Lv. {pet.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select data-testid="select-pet2-breeding">
                  <SelectTrigger>
                    <SelectValue placeholder="Select second pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} (Lv. {pet.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4" data-testid="button-start-breeding">
                <Baby className="w-4 h-4 mr-2" />
                Start Breeding (24 hours)
              </Button>
            </CardContent>
          </Card>

          {/* Active Breeding */}
          {breedings.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">💕 Active Breeding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {breedings.map((breeding) => {
                  const pet1 = pets.find(p => p.id === breeding.petId1);
                  const pet2 = pets.find(p => p.id === breeding.petId2);
                  const timeLeft = new Date(breeding.completesAt).getTime() - Date.now();
                  const isComplete = timeLeft <= 0;
                  
                  return (
                    <Card key={breeding.id} data-testid={`card-breeding-${breeding.id}`}>
                      <CardHeader>
                        <CardTitle className="text-sm">{pet1?.name} × {pet2?.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isComplete ? (
                          <Button size="sm" onClick={() => {
                            apiRequest('POST', `/api/pets/breeding/${breeding.id}/complete`)
                              .then(() => {
                                queryClient.invalidateQueries({ queryKey: ['/api/pets/breeding'] });
                                queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
                                toast({ title: '🎉 Breeding Complete!', description: 'A new pet has been born!' });
                              });
                          }} data-testid={`button-complete-breeding-${breeding.id}`}>
                            Get Offspring
                          </Button>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Time remaining: {Math.floor(timeLeft / 3600000)}h {Math.floor((timeLeft % 3600000) / 60000)}m
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="mt-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold">Available Skills</h3>
            <p className="text-sm text-muted-foreground">Learn new skills to enhance your pet's abilities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_SKILLS.map((skill) => (
              <Card key={skill.skillId} data-testid={`card-skill-${skill.skillId}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{skill.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">{skill.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{skill.description}</p>
                  <div className="text-xs text-muted-foreground mb-3">
                    Cost: {skill.trainingCost} training points
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full" 
                    variant="outline"
                    disabled
                    data-testid={`button-learn-skill-${skill.skillId}`}
                  >
                    Select Pet to Learn
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Adopt Dialog */}
      <Dialog open={adoptDialogOpen} onOpenChange={setAdoptDialogOpen}>
        <DialogContent data-testid="dialog-adopt-pet">
          <DialogHeader>
            <DialogTitle>Adopt {selectedPetType?.name}</DialogTitle>
            <DialogDescription>
              Give your new pet a custom name (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={`/PetIcons/${selectedPetType?.iconPath || 'futureupdate.png'}`} 
              alt={selectedPetType?.name || 'Pet'} 
              className="w-24 h-24 mx-auto object-contain"
              data-testid="img-adopt-dialog-icon"
            />
            <Input
              placeholder={`Enter custom name or leave blank for "${selectedPetType?.name}"`}
              value={customPetName}
              onChange={(e) => setCustomPetName(e.target.value)}
              data-testid="input-custom-pet-name"
            />
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span>Adoption Cost:</span>
              <span className="font-bold">{selectedPetType?.adoptionCost?.toLocaleString()} 🪙</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdoptDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                if (selectedPetType) {
                  adoptMutation.mutate({ 
                    petTypeId: selectedPetType.petId,
                    customName: customPetName || undefined 
                  });
                }
              }}
              disabled={adoptMutation.isPending}
              data-testid="button-confirm-adopt"
            >
              Adopt Pet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Training Dialog */}
      <Dialog open={trainingDialogOpen} onOpenChange={setTrainingDialogOpen}>
        <DialogContent data-testid="dialog-training">
          <DialogHeader>
            <DialogTitle>Train {selectedPet?.name}</DialogTitle>
            <DialogDescription>
              Allocate training points to improve stats (Max 35 points per session)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span>Training Points Available:</span>
              <span className="font-bold">{selectedPet?.trainingPoints || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span>Points Allocated:</span>
              <span className="font-bold">{totalTrainingPoints}/35</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Attack (+{trainingPoints.attack})</Label>
                <Slider
                  value={[trainingPoints.attack]}
                  onValueChange={(v) => setTrainingPoints(prev => ({ ...prev, attack: v[0] }))}
                  max={Math.min(35 - (totalTrainingPoints - trainingPoints.attack), selectedPet?.trainingPoints || 0)}
                  step={1}
                  data-testid="slider-attack"
                />
              </div>
              <div>
                <Label>Defense (+{trainingPoints.defense})</Label>
                <Slider
                  value={[trainingPoints.defense]}
                  onValueChange={(v) => setTrainingPoints(prev => ({ ...prev, defense: v[0] }))}
                  max={Math.min(35 - (totalTrainingPoints - trainingPoints.defense), selectedPet?.trainingPoints || 0)}
                  step={1}
                  data-testid="slider-defense"
                />
              </div>
              <div>
                <Label>Sustainability (+{trainingPoints.sustainability})</Label>
                <Slider
                  value={[trainingPoints.sustainability]}
                  onValueChange={(v) => setTrainingPoints(prev => ({ ...prev, sustainability: v[0] }))}
                  max={Math.min(35 - (totalTrainingPoints - trainingPoints.sustainability), selectedPet?.trainingPoints || 0)}
                  step={1}
                  data-testid="slider-sustainability"
                />
              </div>
              <div>
                <Label>Hunting (+{trainingPoints.hunting})</Label>
                <Slider
                  value={[trainingPoints.hunting]}
                  onValueChange={(v) => setTrainingPoints(prev => ({ ...prev, hunting: v[0] }))}
                  max={Math.min(35 - (totalTrainingPoints - trainingPoints.hunting), selectedPet?.trainingPoints || 0)}
                  step={1}
                  data-testid="slider-hunting"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrainingDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                if (selectedPet && totalTrainingPoints > 0) {
                  Object.entries(trainingPoints).forEach(([stat, points]) => {
                    if (points > 0) {
                      trainMutation.mutate({ 
                        petId: selectedPet.id, 
                        stat: stat as any, 
                        points 
                      });
                    }
                  });
                }
              }}
              disabled={totalTrainingPoints === 0 || trainMutation.isPending}
              data-testid="button-confirm-training"
            >
              Train Pet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skills Dialog */}
      <Dialog open={skillsDialogOpen} onOpenChange={setSkillsDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-skills">
          <DialogHeader>
            <DialogTitle>Learn Skills - {selectedPet?.name}</DialogTitle>
            <DialogDescription>
              Available Training Points: {selectedPet?.trainingPoints || 0}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {AVAILABLE_SKILLS.map((skill) => {
              const hasSkill = (selectedPet?.skills as string[] || []).includes(skill.skillId);
              const canAfford = (selectedPet?.trainingPoints || 0) >= skill.trainingCost;
              
              return (
                <Card key={skill.skillId} className={hasSkill ? 'bg-green-50 dark:bg-green-950' : ''} data-testid={`card-pet-skill-${skill.skillId}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm">{skill.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">{skill.category}</Badge>
                      </div>
                      {hasSkill && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">{skill.description}</p>
                    <div className="text-xs mb-2">Cost: {skill.trainingCost} TP</div>
                    {!hasSkill && (
                      <Button 
                        size="sm" 
                        className="w-full" 
                        onClick={() => {
                          if (selectedPet) {
                            learnSkillMutation.mutate({ 
                              petId: selectedPet.id, 
                              skillId: skill.skillId 
                            });
                          }
                        }}
                        disabled={!canAfford || learnSkillMutation.isPending}
                        data-testid={`button-learn-${skill.skillId}`}
                      >
                        {canAfford ? 'Learn' : <Lock className="w-3 h-3 mr-1" />}
                        {canAfford ? 'Learn' : 'Insufficient TP'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Dialog */}
      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent className="max-w-3xl" data-testid="dialog-room">
          <DialogHeader>
            <DialogTitle>Manage Room - {selectedRoom?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Floor Style</Label>
              <Select 
                value={selectedRoom?.floorStyle} 
                onValueChange={(value) => {
                  if (selectedRoom) {
                    updateRoomMutation.mutate({ 
                      roomId: selectedRoom.id, 
                      updates: { floorStyle: value } 
                    });
                  }
                }}
              >
                <SelectTrigger data-testid="select-floor-style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FLOOR_STYLES.map(style => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.emoji} {style.name} - {style.cost} 🪙
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Wall Style</Label>
              <Select 
                value={selectedRoom?.wallStyle}
                onValueChange={(value) => {
                  if (selectedRoom) {
                    updateRoomMutation.mutate({ 
                      roomId: selectedRoom.id, 
                      updates: { wallStyle: value } 
                    });
                  }
                }}
              >
                <SelectTrigger data-testid="select-wall-style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WALL_STYLES.map(style => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.emoji} {style.name} - {style.cost} 🪙
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Assign Pets</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {pets.filter(p => !p.roomId || p.roomId === selectedRoom?.id).map(pet => (
                  <Button
                    key={pet.id}
                    size="sm"
                    variant={pet.roomId === selectedRoom?.id ? 'default' : 'outline'}
                    onClick={() => {
                      if (selectedRoom) {
                        assignPetMutation.mutate({ 
                          roomId: selectedRoom.id, 
                          petId: pet.id 
                        });
                      }
                    }}
                    data-testid={`button-assign-pet-${pet.id}`}
                  >
                    {pet.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
