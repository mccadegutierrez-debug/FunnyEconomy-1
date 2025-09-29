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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AVAILABLE_PETS, getPetById, calculateStatDecay } from '@shared/pets-data';
import { UserPet, PetRoom, PetSitter, PetSkill, PetActivity, PetHunt } from '@shared/schema';
import { Heart, Sparkles, Bath, Bed, ShoppingCart, Search, Home, Users, Trophy, History, Snowflake, Target, Plus, Settings, Star, Clock } from 'lucide-react';

export default function PetsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [adoptDialog, setAdoptDialog] = useState<string | null>(null);
  
  // New Pets 2.0 state
  const [createRoomDialog, setCreateRoomDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedPetForAction, setSelectedPetForAction] = useState<string | null>(null);
  const [hireSitterDialog, setHireSitterDialog] = useState<{ roomId: string; room: PetRoom } | null>(null);
  const [selectedSitter, setSelectedSitter] = useState<string>('');
  const [sitterHours, setSitterHours] = useState(1);
  const [trainSkillDialog, setTrainSkillDialog] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [viewActivitiesDialog, setViewActivitiesDialog] = useState<string | null>(null);
  const [huntDialog, setHuntDialog] = useState<string | null>(null);
  const [huntType, setHuntType] = useState<'basic' | 'advanced' | 'expert'>('basic');

  // Fetch user's pets
  const { data: userPets = [] } = useQuery<UserPet[]>({
    queryKey: ['/api/pets/user'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pets/user');
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch user's pet rooms
  const { data: petRooms = [] } = useQuery<PetRoom[]>({
    queryKey: ['/api/pets/rooms'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pets/rooms');
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch available pet sitters
  const { data: petSitters = [] } = useQuery<PetSitter[]>({
    queryKey: ['/api/pets/sitters'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pets/sitters');
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch available pet skills
  const { data: petSkills = [] } = useQuery<PetSkill[]>({
    queryKey: ['/api/pets/skills'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pets/skills');
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch pet activities for selected pet
  const { data: petActivities = [] } = useQuery<PetActivity[]>({
    queryKey: ['/api/pets/activities', viewActivitiesDialog],
    queryFn: async () => {
      if (!viewActivitiesDialog) return [];
      const res = await apiRequest('GET', `/api/pets/${viewActivitiesDialog}/activities`);
      return res.json();
    },
    enabled: !!viewActivitiesDialog,
  });

  // Fetch pet hunts for user
  const { data: petHunts = [] } = useQuery<PetHunt[]>({
    queryKey: ['/api/pets/hunts'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pets/hunts');
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

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest('POST', '/api/pets/rooms', { name });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/rooms'] });
      setCreateRoomDialog(false);
      setNewRoomName('');
      toast({ title: 'Room Created! 🏠', description: 'Your new pet room is ready!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Room Creation Failed', description: error.message, variant: 'destructive' });
    },
  });

  // Hire sitter mutation
  const hireSitterMutation = useMutation({
    mutationFn: async ({ roomId, sitterId, hours }: { roomId: string; sitterId: string; hours: number }) => {
      const res = await apiRequest('POST', `/api/pets/rooms/${roomId}/sitter`, { sitterId, hours });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/rooms'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setHireSitterDialog(null);
      toast({ title: 'Sitter Hired! 👥', description: 'Your pet sitter will take great care of your pets!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Sitter Hiring Failed', description: error.message, variant: 'destructive' });
    },
  });

  // Train skill mutation
  const trainSkillMutation = useMutation({
    mutationFn: async ({ petId, skillId }: { petId: string; skillId: string }) => {
      const res = await apiRequest('POST', `/api/pets/${petId}/train-skill`, { skillId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setTrainSkillDialog(null);
      toast({ title: 'Skill Learned! 🌟', description: 'Your pet has gained a new ability!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Training Failed', description: error.message, variant: 'destructive' });
    },
  });

  // Put in stasis mutation  
  const putInStasisMutation = useMutation({
    mutationFn: async (petId: string) => {
      const res = await apiRequest('POST', `/api/pets/${petId}/put-in-stasis`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/user'] });
      toast({ title: 'Pet in Stasis ❄️', description: 'Your pet is safely stored in stasis.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Stasis Failed', description: error.message, variant: 'destructive' });
    },
  });

  // Remove from stasis mutation
  const removeFromStasisMutation = useMutation({
    mutationFn: async ({ petId, roomId }: { petId: string; roomId: string }) => {
      const res = await apiRequest('POST', `/api/pets/${petId}/remove-from-stasis`, { roomId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/user'] });
      toast({ title: 'Pet Thawing! 🔥', description: 'Your pet will be ready in 6 hours.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Thawing Failed', description: error.message, variant: 'destructive' });
    },
  });

  // Start hunt mutation
  const startHuntMutation = useMutation({
    mutationFn: async ({ petId, huntType }: { petId: string; huntType: string }) => {
      const res = await apiRequest('POST', `/api/pets/${petId}/hunt`, { huntType });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pets/hunts'] });
      setHuntDialog(null);
      toast({ title: 'Hunt Started! 🎯', description: 'Your pet is out hunting for rewards!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Hunt Failed', description: error.message, variant: 'destructive' });
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="my-pets" data-testid="tab-my-pets">
            <Heart className="w-4 h-4 mr-1" />
            My Pets
          </TabsTrigger>
          <TabsTrigger value="adopt" data-testid="tab-adopt">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Adopt
          </TabsTrigger>
          <TabsTrigger value="rooms" data-testid="tab-rooms">
            <Home className="w-4 h-4 mr-1" />
            Rooms
          </TabsTrigger>
          <TabsTrigger value="skills" data-testid="tab-skills">
            <Trophy className="w-4 h-4 mr-1" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="stasis" data-testid="tab-stasis">
            <Snowflake className="w-4 h-4 mr-1" />
            Stasis
          </TabsTrigger>
          <TabsTrigger value="hunting" data-testid="tab-hunting">
            <Target className="w-4 h-4 mr-1" />
            Hunting
          </TabsTrigger>
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
                      
                      {/* Pet Status */}
                      {pet.inStasis && (
                        <Badge variant="secondary" className="w-full mb-2">
                          <Snowflake className="w-3 h-3 mr-1" />
                          In Stasis
                        </Badge>
                      )}
                      {pet.thawingUntil && new Date() < new Date(pet.thawingUntil) && (
                        <Badge variant="outline" className="w-full mb-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Thawing... {Math.ceil((new Date(pet.thawingUntil).getTime() - Date.now()) / (1000 * 60 * 60)).toString()}h left
                        </Badge>
                      )}
                      {pet.huntingUntil && new Date() < new Date(pet.huntingUntil) && (
                        <Badge variant="outline" className="w-full mb-2">
                          <Target className="w-3 h-3 mr-1" />
                          Hunting... {Math.ceil((new Date(pet.huntingUntil).getTime() - Date.now()) / (1000 * 60 * 60))}h left
                        </Badge>
                      )}

                      {/* Skills Display */}
                      {pet.skills && Array.isArray(pet.skills) && pet.skills.length > 0 && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-muted-foreground">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(pet.skills as string[]).map((skillId: string) => {
                              const skill = petSkills.find(s => s.id === skillId);
                              return skill ? (
                                <Badge key={skillId} variant="outline" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  {skill.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {/* Care Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button
                          size="sm"
                          variant={stats.hunger < 50 ? "default" : "outline"}
                          onClick={() => careForPetMutation.mutate({ petId: pet.id, action: 'feed' })}
                          disabled={careForPetMutation.isPending || pet.inStasis}
                          data-testid={`button-feed-${pet.id}`}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Feed
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={stats.hygiene < 50 ? "default" : "outline"}
                          onClick={() => careForPetMutation.mutate({ petId: pet.id, action: 'clean' })}
                          disabled={careForPetMutation.isPending || pet.inStasis}
                          data-testid={`button-clean-${pet.id}`}
                        >
                          <Bath className="w-4 h-4 mr-1" />
                          Clean
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={stats.fun < 50 ? "default" : "outline"}
                          onClick={() => careForPetMutation.mutate({ petId: pet.id, action: 'play' })}
                          disabled={careForPetMutation.isPending || pet.inStasis}
                          data-testid={`button-play-${pet.id}`}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Play
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={stats.energy < 50 ? "default" : "outline"}
                          onClick={() => careForPetMutation.mutate({ petId: pet.id, action: 'sleep' })}
                          disabled={careForPetMutation.isPending || pet.inStasis}
                          data-testid={`button-sleep-${pet.id}`}
                        >
                          <Bed className="w-4 h-4 mr-1" />
                          Sleep
                        </Button>
                      </div>

                      {/* Advanced Actions */}
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setTrainSkillDialog(pet.id)}
                          disabled={pet.inStasis}
                          data-testid={`button-train-${pet.id}`}
                        >
                          <Trophy className="w-3 h-3 mr-1" />
                          Train
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewActivitiesDialog(pet.id)}
                          data-testid={`button-activities-${pet.id}`}
                        >
                          <History className="w-3 h-3 mr-1" />
                          History
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setHuntDialog(pet.id)}
                          disabled={Boolean(pet.inStasis) || Boolean(pet.huntingUntil && new Date() < new Date(pet.huntingUntil))}
                          data-testid={`button-hunt-${pet.id}`}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Hunt
                        </Button>
                      </div>

                      {/* Stasis Actions */}
                      <div className="pt-2">
                        {pet.inStasis ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPetForAction(pet.id);
                              setSelectedRoom(null);
                            }}
                            className="w-full"
                            data-testid={`button-thaw-${pet.id}`}
                          >
                            <Snowflake className="w-3 h-3 mr-1" />
                            Remove from Stasis
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => putInStasisMutation.mutate(pet.id)}
                            disabled={putInStasisMutation.isPending}
                            className="w-full"
                            data-testid={`button-stasis-${pet.id}`}
                          >
                            <Snowflake className="w-3 h-3 mr-1" />
                            Put in Stasis
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Pet Rooms Tab */}
        <TabsContent value="rooms" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Pet Rooms</h2>
              <p className="text-muted-foreground">Manage your pet rooms (up to 10 rooms, 5 pets per room)</p>
            </div>
            <Dialog open={createRoomDialog} onOpenChange={setCreateRoomDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-room">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Pet Room</DialogTitle>
                  <DialogDescription>
                    Create a new room to house your pets. Each room can hold up to 5 pets.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input
                      id="room-name"
                      placeholder="Enter room name..."
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      data-testid="input-room-name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => createRoomMutation.mutate(newRoomName)}
                    disabled={createRoomMutation.isPending}
                    data-testid="button-confirm-create-room"
                  >
                    {createRoomMutation.isPending ? 'Creating...' : 'Create Room'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {petRooms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-2">No Rooms Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first pet room to house your pets!
                </p>
                <Button onClick={() => setCreateRoomDialog(true)} data-testid="button-create-first-room">
                  Create Room
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {petRooms.map((room) => {
                const roomPets = userPets.filter(pet => pet.roomId === room.id);
                const sitter = room.sitterId ? petSitters.find(s => s.id === room.sitterId) : null;
                const sitterActive = room.sitterUntil && new Date() < new Date(room.sitterUntil);
                
                return (
                  <Card key={room.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <CardDescription>
                            {roomPets.length}/5 pets • {room.floorStyle} floor
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-settings-${room.id}`}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Room Pets */}
                      <div>
                        <h4 className="font-medium mb-2">Pets in Room</h4>
                        {roomPets.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No pets in this room</p>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {roomPets.map((pet) => {
                              const petType = getPetById(pet.petId);
                              return petType ? (
                                <Badge key={pet.id} variant="outline" className="text-xs">
                                  {petType.emoji} {pet.petName}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>

                      {/* Active Sitter */}
                      {sitterActive && sitter && (
                        <div>
                          <h4 className="font-medium mb-2">Active Sitter</h4>
                          <Badge variant="secondary" className="w-full">
                            <Users className="w-3 h-3 mr-1" />
                            {sitter.name} - {Math.ceil((room.sitterUntil!.getTime() - Date.now()) / (1000 * 60 * 60))}h left
                          </Badge>
                        </div>
                      )}
                      
                      {/* Room Actions */}
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setHireSitterDialog({ roomId: room.id, room })}
                          disabled={Boolean(sitterActive)}
                          className="w-full"
                          data-testid={`button-hire-sitter-${room.id}`}
                        >
                          <Users className="w-4 h-4 mr-1" />
                          {sitterActive ? 'Sitter Active' : 'Hire Sitter'}
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

        {/* Pet Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Pet Skills</h2>
            <p className="text-muted-foreground">Train your pets with special abilities and skills</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {petSkills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm">{skill.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        💰 {skill.trainingCost.toLocaleString()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{skill.description}</p>
                    <div className="text-xs">
                      <strong>Category:</strong> {skill.category}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pet Stasis Tab */}
        <TabsContent value="stasis" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Pet Stasis</h2>
            <p className="text-muted-foreground">Manage pets in stasis storage when rooms are full</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pets in Stasis */}
            <Card>
              <CardHeader>
                <CardTitle>Pets in Stasis</CardTitle>
                <CardDescription>Pets safely stored in cryogenic sleep</CardDescription>
              </CardHeader>
              <CardContent>
                {userPets.filter(pet => pet.inStasis).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No pets in stasis</p>
                ) : (
                  <div className="space-y-2">
                    {userPets.filter(pet => pet.inStasis).map((pet) => {
                      const petType = getPetById(pet.petId);
                      if (!petType) return null;
                      
                      return (
                        <div key={pet.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{petType.emoji}</span>
                            <div>
                              <div className="font-medium text-sm">{pet.petName}</div>
                              <div className="text-xs text-muted-foreground">{petType.name}</div>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" data-testid={`button-thaw-dialog-${pet.id}`}>
                                <Snowflake className="w-3 h-3 mr-1" />
                                Thaw
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Remove {pet.petName} from Stasis</DialogTitle>
                                <DialogDescription>
                                  Select a room to place your pet. Thawing takes 6 hours.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Select Room</Label>
                                  <Select onValueChange={setSelectedRoom}>
                                    <SelectTrigger data-testid="select-room-for-thaw">
                                      <SelectValue placeholder="Choose a room..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {petRooms.filter(room => {
                                        const roomPets = userPets.filter(p => p.roomId === room.id);
                                        return roomPets.length < 5;
                                      }).map((room) => (
                                        <SelectItem key={room.id} value={room.id}>
                                          {room.name} ({userPets.filter(p => p.roomId === room.id).length}/5)
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => selectedRoom && removeFromStasisMutation.mutate({ petId: pet.id, roomId: selectedRoom })}
                                  disabled={!selectedRoom || removeFromStasisMutation.isPending}
                                  data-testid={`button-confirm-thaw-${pet.id}`}
                                >
                                  {removeFromStasisMutation.isPending ? 'Thawing...' : 'Start Thawing'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thawing Pets */}
            <Card>
              <CardHeader>
                <CardTitle>Thawing Pets</CardTitle>
                <CardDescription>Pets recovering from stasis</CardDescription>
              </CardHeader>
              <CardContent>
                {userPets.filter(pet => pet.thawingUntil && new Date() < pet.thawingUntil).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No pets thawing</p>
                ) : (
                  <div className="space-y-2">
                    {userPets.filter(pet => pet.thawingUntil && new Date() < pet.thawingUntil).map((pet) => {
                      const petType = getPetById(pet.petId);
                      if (!petType) return null;
                      
                      const timeLeft = Math.ceil((pet.thawingUntil!.getTime() - Date.now()) / (1000 * 60 * 60));
                      
                      return (
                        <div key={pet.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{petType.emoji}</span>
                            <div>
                              <div className="font-medium text-sm">{pet.petName}</div>
                              <div className="text-xs text-muted-foreground">{petType.name}</div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {timeLeft}h left
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pet Hunting Tab */}
        <TabsContent value="hunting" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Pet Hunting</h2>
            <p className="text-muted-foreground">Send your pets on hunting expeditions for rewards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Hunts */}
            <Card>
              <CardHeader>
                <CardTitle>Active Hunts</CardTitle>
                <CardDescription>Pets currently out hunting</CardDescription>
              </CardHeader>
              <CardContent>
                {userPets.filter(pet => pet.huntingUntil && new Date() < pet.huntingUntil).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No active hunts</p>
                ) : (
                  <div className="space-y-2">
                    {userPets.filter(pet => pet.huntingUntil && new Date() < pet.huntingUntil).map((pet) => {
                      const petType = getPetById(pet.petId);
                      if (!petType) return null;
                      
                      const timeLeft = Math.ceil((pet.huntingUntil!.getTime() - Date.now()) / (1000 * 60 * 60));
                      
                      return (
                        <div key={pet.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{petType.emoji}</span>
                            <div>
                              <div className="font-medium text-sm">{pet.petName}</div>
                              <div className="text-xs text-muted-foreground">Hunting expedition</div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            <Target className="w-3 h-3 mr-1" />
                            {timeLeft}h left
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hunt History */}
            <Card>
              <CardHeader>
                <CardTitle>Hunt History</CardTitle>
                <CardDescription>Recent hunting expeditions and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                {petHunts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No hunt history</p>
                ) : (
                  <div className="space-y-2">
                    {petHunts.slice(0, 5).map((hunt) => {
                      const pet = userPets.find(p => p.id === hunt.petId);
                      const petType = pet ? getPetById(pet.petId) : null;
                      
                      return (
                        <div key={hunt.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{petType?.emoji || '🐾'}</span>
                            <div>
                              <div className="font-medium text-sm">{pet?.petName || 'Unknown Pet'}</div>
                              <div className="text-xs text-muted-foreground">
                                {hunt.huntType} hunt • {hunt.isCompleted ? 'Completed' : 'In Progress'}
                              </div>
                            </div>
                          </div>
                          {hunt.isCompleted && (
                            <Badge variant="secondary">
                              ✅ Done
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Interactive Dialogs */}
      
      {/* Hire Sitter Dialog */}
      <Dialog open={!!hireSitterDialog} onOpenChange={() => setHireSitterDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hire Pet Sitter</DialogTitle>
            <DialogDescription>
              Select a sitter for {hireSitterDialog?.room.name}. Sitters automatically care for pets.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Sitter</Label>
              <Select onValueChange={setSelectedSitter}>
                <SelectTrigger data-testid="select-sitter">
                  <SelectValue placeholder="Choose a sitter..." />
                </SelectTrigger>
                <SelectContent>
                  {petSitters.map((sitter) => (
                    <SelectItem key={sitter.id} value={sitter.id}>
                      {sitter.name} - 💰{sitter.hourlyRate}/hour
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hours (1-24)</Label>
              <Input
                type="number"
                min={1}
                max={24}
                value={sitterHours}
                onChange={(e) => setSitterHours(Number(e.target.value))}
                data-testid="input-sitter-hours"
              />
            </div>
            {selectedSitter && (
              <div className="p-3 bg-muted rounded-md">
                <div className="font-medium">Cost Calculation</div>
                <div className="text-sm text-muted-foreground">
                  {petSitters.find(s => s.id === selectedSitter)?.hourlyRate || 0} coins/hour × {sitterHours} hours = 
                  💰{((petSitters.find(s => s.id === selectedSitter)?.hourlyRate || 0) * sitterHours).toLocaleString()} coins
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => hireSitterDialog && selectedSitter && hireSitterMutation.mutate({ 
                roomId: hireSitterDialog.roomId, 
                sitterId: selectedSitter, 
                hours: sitterHours 
              })}
              disabled={!selectedSitter || hireSitterMutation.isPending || (user?.coins || 0) < ((petSitters.find(s => s.id === selectedSitter)?.hourlyRate || 0) * sitterHours)}
              data-testid="button-confirm-hire-sitter"
            >
              {hireSitterMutation.isPending ? 'Hiring...' : 'Hire Sitter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Train Skill Dialog */}
      <Dialog open={!!trainSkillDialog} onOpenChange={() => setTrainSkillDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Train Pet Skill</DialogTitle>
            <DialogDescription>
              Choose a skill to teach your pet. Each skill provides unique benefits.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Skill</Label>
              <Select onValueChange={setSelectedSkill}>
                <SelectTrigger data-testid="select-skill">
                  <SelectValue placeholder="Choose a skill..." />
                </SelectTrigger>
                <SelectContent>
                  {petSkills.filter(skill => {
                    const pet = userPets.find(p => p.id === trainSkillDialog);
                    const petSkills = pet?.skills as string[] || [];
                    return !petSkills.includes(skill.id);
                  }).map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name} - 💰{skill.trainingCost.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedSkill && (
              <div className="p-3 bg-muted rounded-md">
                {(() => {
                  const skill = petSkills.find(s => s.id === selectedSkill);
                  return skill ? (
                    <div>
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-sm text-muted-foreground">{skill.description}</div>
                      <div className="text-sm mt-1"><strong>Category:</strong> {skill.category}</div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => trainSkillDialog && selectedSkill && trainSkillMutation.mutate({ 
                petId: trainSkillDialog, 
                skillId: selectedSkill 
              })}
              disabled={!selectedSkill || trainSkillMutation.isPending || (user?.coins || 0) < (petSkills.find(s => s.id === selectedSkill)?.trainingCost || 0)}
              data-testid="button-confirm-train-skill"
            >
              {trainSkillMutation.isPending ? 'Training...' : 'Train Skill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pet Activities Dialog */}
      <Dialog open={!!viewActivitiesDialog} onOpenChange={() => setViewActivitiesDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pet Activity History</DialogTitle>
            <DialogDescription>
              See what your pet has been up to recently.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {petActivities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No activities yet</p>
            ) : (
              petActivities.map((activity) => (
                <div key={activity.id} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{activity.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.activityType} • {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    {activity.rewards && Array.isArray(activity.rewards) && activity.rewards.length > 0 && (
                      <Badge variant="secondary">
                        +{activity.rewards.length.toString()} reward{activity.rewards.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hunt Dialog */}
      <Dialog open={!!huntDialog} onOpenChange={() => setHuntDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Hunting Expedition</DialogTitle>
            <DialogDescription>
              Send your pet on a hunting expedition to find rewards.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Hunt Type</Label>
              <Select onValueChange={(value: 'basic' | 'advanced' | 'expert') => setHuntType(value)} defaultValue="basic">
                <SelectTrigger data-testid="select-hunt-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Hunt (1 hour)</SelectItem>
                  <SelectItem value="advanced">Advanced Hunt (2 hours)</SelectItem>
                  <SelectItem value="expert">Expert Hunt (4 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <div className="font-medium">Hunt Information</div>
              <div className="text-sm text-muted-foreground">
                {huntType === 'basic' && 'A quick 1-hour hunt with basic rewards.'}
                {huntType === 'advanced' && 'A 2-hour expedition with better rewards.'}
                {huntType === 'expert' && 'A challenging 4-hour hunt with rare rewards.'}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => huntDialog && startHuntMutation.mutate({ petId: huntDialog, huntType })}
              disabled={startHuntMutation.isPending}
              data-testid="button-confirm-start-hunt"
            >
              {startHuntMutation.isPending ? 'Starting Hunt...' : 'Start Hunt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}