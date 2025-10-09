import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Zap,
  Droplets,
  Smile,
  Star,
  Plus,
  Home,
  Baby,
  Scissors,
  CheckCircle,
  Lock,
  Trophy,
  Search,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type {
  Pet,
  PetType,
  PetRoom,
  PetSkill,
  PetSitter,
  PetBreeding,
  PetHunt,
} from "@shared/schema";
import { STATIC_PET_TYPES } from "@shared/pet-types-data";
import { AVAILABLE_SKILLS } from "@shared/pet-skills-data";
import { AVAILABLE_SITTERS } from "@shared/pet-sitters-data";
import {
  FLOOR_DECORATIONS,
  WALL_DECORATIONS,
  FLOOR_STYLES,
  WALL_STYLES,
  calculateRoomBonuses,
  getDecorationById,
} from "@shared/pet-decorations-data";
import MaintenanceScreen from "@/components/maintenance-screen";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

type PetWithType = Pet & { petType?: PetType };

export default function PetsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("my-pets");
  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [selectedPet, setSelectedPet] = useState<PetWithType | null>(null);
  const [trainingDialogOpen, setTrainingDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);
  const [adoptDialogOpen, setAdoptDialogOpen] = useState(false);
  const [selectedPetType, setSelectedPetType] = useState<any>(null);
  const [customPetName, setCustomPetName] = useState("");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<PetRoom | null>(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomTab, setRoomTab] = useState("overview");

  // Breeding state
  const [breedingPet1, setBreedingPet1] = useState<string>("");
  const [breedingPet2, setBreedingPet2] = useState<string>("");

  // Training state
  const [trainingPoints, setTrainingPoints] = useState({
    attack: 0,
    defense: 0,
    sustainability: 0,
    hunting: 0,
  });

  // Check if pets feature is enabled
  const {
    data: petsFeatureFlag,
    isLoading: featureFlagLoading,
    isError: featureFlagError,
  } = useQuery<{ enabled: boolean; description?: string }>({
    queryKey: ["/api/feature-flags/pets"],
  });

  const isPetsEnabled = petsFeatureFlag?.enabled ?? false;

  // Fetch user profile for coin balance
  const { data: userProfile } = useQuery({
    queryKey: ["/api/user/profile"],
    enabled: isPetsEnabled,
  });

  // Fetch user's pets
  const { data: pets = [], isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    enabled: isPetsEnabled,
  });

  // Fetch pet types
  const { data: petTypes = [] } = useQuery<PetType[]>({
    queryKey: ["/api/pets/types"],
    enabled: isPetsEnabled,
  });

  // Fetch pet skills
  const { data: petSkills = [] } = useQuery<PetSkill[]>({
    queryKey: ["/api/pets/skills"],
    enabled: isPetsEnabled,
  });

  // Fetch pet rooms
  const { data: rooms = [] } = useQuery<PetRoom[]>({
    queryKey: ["/api/pets/rooms"],
    enabled: isPetsEnabled,
  });

  // Fetch breeding attempts
  const { data: breedings = [] } = useQuery<PetBreeding[]>({
    queryKey: ["/api/pets/breeding"],
    enabled: isPetsEnabled,
  });

  // Fetch active hunts
  const { data: hunts = [] } = useQuery<PetHunt[]>({
    queryKey: ["/api/pets/hunts"],
    enabled: isPetsEnabled,
  });

  // Create a map of pet types by ID for efficient lookup
  const petTypesMap = useMemo(() => {
    const map = new Map<string, PetType>();
    petTypes.forEach((pt) => map.set(pt.id, pt));
    return map;
  }, [petTypes]);

  // Combine pets with their types
  const petsWithTypes: PetWithType[] = useMemo(() => {
    return pets.map((pet) => {
      const petType = petTypesMap.get(pet.petTypeId);
      return { ...pet, petType };
    });
  }, [pets, petTypesMap]);

  // Adopt pet mutation
  const adoptMutation = useMutation({
    mutationFn: async ({
      petTypeId,
      customName,
    }: {
      petTypeId: string;
      customName?: string;
    }) => {
      return await apiRequest("POST", "/api/pets/adopt", {
        petTypeId,
        customName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "🎉 Pet Adopted!",
        description: "Your new pet is ready to play!",
      });
      setAdoptDialogOpen(false);
      setCustomPetName("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Pet care mutations
  const feedMutation = useMutation({
    mutationFn: (petId: string) =>
      apiRequest("POST", `/api/pets/${petId}/feed`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({ title: "🍖 Fed!", description: "Your pet is happy and full!" });
    },
  });

  const cleanMutation = useMutation({
    mutationFn: (petId: string) =>
      apiRequest("POST", `/api/pets/${petId}/clean`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "🛁 Cleaned!",
        description: "Your pet is squeaky clean!",
      });
    },
  });

  const playMutation = useMutation({
    mutationFn: (petId: string) =>
      apiRequest("POST", `/api/pets/${petId}/play`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({ title: "🎾 Played!", description: "Your pet had so much fun!" });
    },
  });

  const restMutation = useMutation({
    mutationFn: (petId: string) =>
      apiRequest("POST", `/api/pets/${petId}/rest`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({ title: "😴 Rested!", description: "Your pet is well rested!" });
    },
  });

  // Training mutation
  const trainMutation = useMutation({
    mutationFn: ({
      petId,
      stat,
      points,
    }: {
      petId: string;
      stat: string;
      points: number;
    }) => apiRequest("POST", `/api/pets/${petId}/train`, { stat, points }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({ title: "💪 Trained!", description: "Your pet grew stronger!" });
      setTrainingDialogOpen(false);
      setTrainingPoints({
        attack: 0,
        defense: 0,
        sustainability: 0,
        hunting: 0,
      });
    },
  });

  // Learn skill mutation
  const learnSkillMutation = useMutation({
    mutationFn: ({ petId, skillId }: { petId: string; skillId: string }) =>
      apiRequest("POST", `/api/pets/${petId}/learn-skill`, { skillId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "✨ Skill Learned!",
        description: "Your pet learned a new skill!",
      });
    },
  });

  // Prestige mutation
  const prestigeMutation = useMutation({
    mutationFn: (petId: string) =>
      apiRequest("POST", `/api/pets/${petId}/prestige`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "⭐ Prestiged!",
        description: "Your pet has reached a new prestige level!",
      });
    },
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: (name: string) =>
      apiRequest("POST", "/api/pets/rooms", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets/rooms"] });
      toast({
        title: "🏠 Room Created!",
        description: "Your new pet room is ready!",
      });
      setNewRoomName("");
    },
  });

  // Update room mutation
  const updateRoomMutation = useMutation({
    mutationFn: ({ roomId, updates }: { roomId: string; updates: any }) =>
      apiRequest("PATCH", `/api/pets/rooms/${roomId}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets/rooms"] });
      toast({
        title: "✨ Room Updated!",
        description: "Your room has been customized!",
      });
    },
  });

  // Assign pet to room mutation
  const assignPetMutation = useMutation({
    mutationFn: ({ roomId, petId }: { roomId: string; petId: string }) =>
      apiRequest("POST", `/api/pets/rooms/${roomId}/assign-pet`, { petId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets/rooms"] });
      toast({
        title: "🐾 Pet Assigned!",
        description: "Your pet has moved to the room!",
      });
    },
  });

  // Hire sitter mutation
  const hireSitterMutation = useMutation({
    mutationFn: ({ roomId, sitterId, hours }: { roomId: string; sitterId: string; hours: number }) =>
      apiRequest("POST", `/api/pets/rooms/${roomId}/hire-sitter`, { sitterId, hours }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets/rooms"] });
      toast({
        title: "👤 Sitter Hired!",
        description: "Your pet sitter will now care for pets in this room!",
      });
    },
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: string) =>
      apiRequest("DELETE", `/api/pets/rooms/${roomId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets/rooms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setRoomDialogOpen(false);
      toast({
        title: "🗑️ Room Deleted",
        description: "The room has been deleted. Pets have been moved out.",
      });
    },
  });

  // Start breeding mutation
  const startBreedingMutation = useMutation({
    mutationFn: ({ petId1, petId2 }: { petId1: string; petId2: string }) =>
      apiRequest("POST", "/api/pets/breeding", { petId1, petId2 }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets/breeding"] });
      const pet1 = pets.find(p => p.id === breedingPet1);
      const pet2 = pets.find(p => p.id === breedingPet2);
      toast({
        title: "💕 Breeding Started Successfully!",
        description: (
          <div className="space-y-2">
            <p className="font-semibold text-pink-500">
              {pet1?.name} × {pet2?.name}
            </p>
            <p className="text-sm">
              Your pets are now breeding! An offspring will be ready in <span className="font-bold text-primary">24 hours</span>.
            </p>
            <p className="text-xs text-muted-foreground">
              Check back later to see if the breeding was successful! 🐾
            </p>
          </div>
        ),
        duration: 6000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Breeding Failed",
        description: error.message || "Could not start breeding. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Start hunt mutation
  const startHuntMutation = useMutation({
    mutationFn: ({ petId, huntType }: { petId: string; huntType: string }) =>
      apiRequest("POST", `/api/pets/${petId}/hunt`, { huntType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets/hunts"] });
      toast({
        title: "🏹 Hunt Started!",
        description: "Your pet is on the hunt!",
      });
    },
  });

  // Filter pet types for adoption
  const filteredPetTypes = useMemo(() => {
    return STATIC_PET_TYPES.filter((pt) => {
      const matchesSearch = pt.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRarity =
        rarityFilter === "all" || pt.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    });
  }, [searchQuery, rarityFilter]);

  // Calculate total training points allocated
  const totalTrainingPoints =
    trainingPoints.attack +
    trainingPoints.defense +
    trainingPoints.sustainability +
    trainingPoints.hunting;

  // Rarity colors
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500";
      case "uncommon":
        return "bg-green-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calculate XP needed for next level
  const getXPForNextLevel = (level: number) => level * 100;

  // Get color class based on stat value
  const getStatColor = (value: number): string => {
    if (value >= 70) return "bg-green-500";
    if (value >= 40) return "bg-yellow-500";
    if (value >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  // Show maintenance screen if feature is disabled
  if (featureFlagLoading) {
    return (
      <div>
        <Header />
        <div
          className="flex items-center justify-center min-h-[60vh]"
          data-testid="status-loading-feature-flag"
        >
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (featureFlagError || (petsFeatureFlag && !petsFeatureFlag.enabled)) {
    return (
      <div>
        <Header />
        <MaintenanceScreen
          featureName="Pet System"
          message={
            petsFeatureFlag?.description ||
            "The pet system is currently under maintenance. Please check back later!"
          }
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-impact text-primary dm-title">
            🐾 Pet System
          </h1>
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
        <TabsList
          className="grid w-full grid-cols-5"
          data-testid="tabs-pet-system"
        >
          <TabsTrigger value="my-pets" data-testid="tab-my-pets">
            My Pets
          </TabsTrigger>
          <TabsTrigger value="adopt" data-testid="tab-adopt">
            Adopt Pet
          </TabsTrigger>
          <TabsTrigger value="rooms" data-testid="tab-rooms">
            Pet Rooms
          </TabsTrigger>
          <TabsTrigger value="breeding" data-testid="tab-breeding">
            Breeding
          </TabsTrigger>
          <TabsTrigger value="skills" data-testid="tab-skills">
            Skills
          </TabsTrigger>
        </TabsList>

        {/* My Pets Tab */}
        <TabsContent value="my-pets" className="mt-6">
          {petsLoading ? (
            <div className="text-center py-12">Loading your pets...</div>
          ) : pets.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No Pets Yet</CardTitle>
                <CardDescription>
                  Visit the Adopt Pet tab to get your first companion!
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {petsWithTypes.map((pet) => {
                const petTypeData = pet.petType;
                const xpProgress =
                  (pet.xp / getXPForNextLevel(pet.level)) * 100;
                const learnedSkills = (pet.skills as string[]) || [];

                if (!petTypeData) {
                  return null;
                }

                return (
                  <Card
                    key={pet.id}
                    className={`relative overflow-hidden ${pet.isDead ? 'opacity-60 bg-gray-100 dark:bg-gray-900 border-red-500' : ''}`}
                    data-testid={`card-pet-${pet.id}`}
                  >
                    {pet.isDead && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="destructive" className="text-xs">
                          💀 Dead
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={`/PetIcons/${petTypeData?.iconPath || "futureupdate.png"}`}
                            alt={petTypeData?.name || "Pet"}
                            className={`w-16 h-16 object-contain ${pet.isDead ? 'grayscale' : ''}`}
                            data-testid={`img-pet-icon-${pet.id}`}
                          />
                          <div>
                            <CardTitle
                              className="text-lg"
                              data-testid={`text-pet-name-${pet.id}`}
                            >
                              {pet.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={getRarityColor(
                                  petTypeData?.rarity || "common",
                                )}
                                data-testid={`badge-rarity-${pet.id}`}
                              >
                                {petTypeData?.rarity || "common"}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Lv. {pet.level}
                              </span>
                              {pet.prestigeLevel > 0 && (
                                <div className="flex items-center gap-1">
                                  {Array.from({
                                    length: pet.prestigeLevel,
                                  }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 fill-yellow-500 text-yellow-500"
                                    />
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
                          <span>
                            {pet.xp}/{getXPForNextLevel(pet.level)}
                          </span>
                        </div>
                        <Progress
                          value={xpProgress}
                          className="h-2"
                          data-testid={`progress-xp-${pet.id}`}
                        />
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
                          <span className={`text-xs font-bold ${pet.hunger < 20 ? 'text-red-600' : ''}`}>{pet.hunger}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStatColor(pet.hunger)} transition-all duration-300`}
                            style={{ width: `${pet.hunger}%` }}
                            data-testid={`progress-hunger-${pet.id}`}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span>Hygiene</span>
                          </div>
                          <span className={`text-xs font-bold ${pet.hygiene < 20 ? 'text-red-600' : ''}`}>{pet.hygiene}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStatColor(pet.hygiene)} transition-all duration-300`}
                            style={{ width: `${pet.hygiene}%` }}
                            data-testid={`progress-hygiene-${pet.id}`}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span>Energy</span>
                          </div>
                          <span className={`text-xs font-bold ${pet.energy < 20 ? 'text-red-600' : ''}`}>{pet.energy}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStatColor(pet.energy)} transition-all duration-300`}
                            style={{ width: `${pet.energy}%` }}
                            data-testid={`progress-energy-${pet.id}`}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Smile className="w-4 h-4 text-green-500" />
                            <span>Fun</span>
                          </div>
                          <span className={`text-xs font-bold ${pet.fun < 20 ? 'text-red-600' : ''}`}>{pet.fun}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStatColor(pet.fun)} transition-all duration-300`}
                            style={{ width: `${pet.fun}%` }}
                            data-testid={`progress-fun-${pet.id}`}
                          />
                        </div>
                      </div>

                      {/* Care Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => feedMutation.mutate(pet.id)}
                          disabled={pet.isDead || feedMutation.isPending || pet.hunger >= 100}
                          data-testid={`button-feed-${pet.id}`}
                        >
                          <Heart className="w-3 h-3 mr-1" /> Feed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cleanMutation.mutate(pet.id)}
                          disabled={pet.isDead || cleanMutation.isPending || pet.hygiene >= 100}
                          data-testid={`button-clean-${pet.id}`}
                        >
                          <Droplets className="w-3 h-3 mr-1" /> Clean
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => playMutation.mutate(pet.id)}
                          disabled={pet.isDead || playMutation.isPending || pet.fun >= 100}
                          data-testid={`button-play-${pet.id}`}
                        >
                          <Smile className="w-3 h-3 mr-1" /> Play
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => restMutation.mutate(pet.id)}
                          disabled={pet.isDead || restMutation.isPending || pet.energy >= 100}
                          data-testid={`button-rest-${pet.id}`}
                        >
                          <Zap className="w-3 h-3 mr-1" /> Rest
                        </Button>
                      </div>

                      {/* Pet Stats */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Attack:</span>{" "}
                          {pet.attack}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">
                            Defense:
                          </span>{" "}
                          {pet.defense}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">
                            Sustain:
                          </span>{" "}
                          {pet.sustainability}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">
                            Hunting:
                          </span>{" "}
                          {pet.hunting}
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
                          disabled={pet.isDead}
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
                          disabled={pet.isDead}
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
                        onClick={() =>
                          startHuntMutation.mutate({
                            petId: pet.id,
                            huntType: "short",
                          })
                        }
                        disabled={pet.isDead || startHuntMutation.isPending}
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
                          disabled={pet.isDead || prestigeMutation.isPending}
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
                  const pet = pets.find((p) => p.id === hunt.petId);
                  const timeLeft =
                    new Date(hunt.completesAt).getTime() - Date.now();
                  const isComplete = timeLeft <= 0;

                  return (
                    <Card key={hunt.id} data-testid={`card-hunt-${hunt.id}`}>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {pet?.name} - {hunt.huntType} Hunt
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isComplete ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              apiRequest(
                                "POST",
                                `/api/pets/hunts/${hunt.id}/complete`,
                              ).then(() => {
                                queryClient.invalidateQueries({
                                  queryKey: ["/api/pets/hunts"],
                                });
                                toast({
                                  title: "🎉 Hunt Complete!",
                                  description:
                                    "Your pet returned with rewards!",
                                });
                              });
                            }}
                            data-testid={`button-complete-hunt-${hunt.id}`}
                          >
                            Collect Rewards
                          </Button>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Time remaining: {Math.floor(timeLeft / 60000)}{" "}
                            minutes
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
              <SelectTrigger
                className="w-40"
                data-testid="select-rarity-filter"
              >
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
              <span className="text-lg" data-testid="text-coin-balance">
                {userProfile?.coins?.toLocaleString() || 0} 🪙
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPetTypes.map((petType) => (
              <Card
                key={petType.petId}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                data-testid={`card-adopt-${petType.petId}`}
              >
                <CardHeader className="text-center pb-3">
                  <img
                    src={`/PetIcons/${petType.iconPath}`}
                    alt={petType.name}
                    className="w-20 h-20 mx-auto mb-2 object-contain"
                    data-testid={`img-adopt-icon-${petType.petId}`}
                  />
                  <CardTitle className="text-lg">{petType.name}</CardTitle>
                  <Badge className={getRarityColor(petType.rarity)}>
                    {petType.rarity}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {petType.description}
                  </p>
                  <div className="text-xs space-y-1">
                    <div>Hunger Decay: {petType.hungerDecay}/hr</div>
                    <div>Hygiene Decay: {petType.hygieneDecay}/hr</div>
                    <div>Energy Decay: {petType.energyDecay}/hr</div>
                    <div>Fun Decay: {petType.funDecay}/hr</div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="font-bold text-center mb-2">
                      {petType.adoptionCost.toLocaleString()} 🪙
                    </div>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => {
                        setSelectedPetType(petType);
                        setAdoptDialogOpen(true);
                      }}
                      disabled={
                        !userProfile || userProfile.coins < petType.adoptionCost
                      }
                      data-testid={`button-adopt-${petType.petId}`}
                    >
                      {!userProfile ||
                      userProfile.coins < petType.adoptionCost ? (
                        <Lock className="w-4 h-4 mr-1" />
                      ) : null}
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
                Create Room {rooms.length >= 10 && "(Max 10)"}
              </Button>
            </div>
          </div>

          {rooms.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No Rooms Yet</CardTitle>
                <CardDescription>
                  Create your first pet room above!
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const roomPets = pets.filter((p) => p.roomId === room.id);
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
                          <span className="text-muted-foreground">Floor:</span>{" "}
                          {FLOOR_STYLES.find((s) => s.id === room.floorStyle)
                            ?.name || "Wooden"}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Walls:</span>{" "}
                          {WALL_STYLES.find((s) => s.id === room.wallStyle)
                            ?.name || "Plain"}
                        </div>
                        {room.sitterId && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Sitter:
                            </span>{" "}
                            {
                              AVAILABLE_SITTERS.find(
                                (s) => s.sitterId === room.sitterId,
                              )?.name
                            }
                          </div>
                        )}
                        <div className="pt-2 flex gap-2">
                          {roomPets.slice(0, 5).map((pet) => {
                            const petTypeData = petTypes.find((pt) => pt.id === pet.petTypeId) || 
                              STATIC_PET_TYPES.find((pt) => pt.petId === pet.petTypeId);
                            return (
                              <img
                                key={pet.id}
                                src={`/PetIcons/${petTypeData?.iconPath || "futureupdate.png"}`}
                                alt={petTypeData?.name || "Pet"}
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
              <CardDescription>
                Select two compatible pets to breed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                  data-testid="select-pet1-breeding"
                  value={breedingPet1}
                  onValueChange={setBreedingPet1}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select first pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} (Lv. {pet.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  data-testid="select-pet2-breeding"
                  value={breedingPet2}
                  onValueChange={setBreedingPet2}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select second pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} (Lv. {pet.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full mt-4"
                data-testid="button-start-breeding"
                onClick={() => {
                  if (!breedingPet1 || !breedingPet2) {
                    toast({
                      title: "❌ Select Both Pets",
                      description: "Please select two pets to breed",
                      variant: "destructive",
                    });
                    return;
                  }
                  if (breedingPet1 === breedingPet2) {
                    toast({
                      title: "❌ Different Pets Required",
                      description: "Please select two different pets",
                      variant: "destructive",
                    });
                    return;
                  }
                  startBreedingMutation.mutate({ 
                    petId1: breedingPet1, 
                    petId2: breedingPet2 
                  });
                  setBreedingPet1("");
                  setBreedingPet2("");
                }}
                disabled={startBreedingMutation.isPending}
              >
                <Baby className="w-4 h-4 mr-2" />
                {startBreedingMutation.isPending ? "Starting..." : "Start Breeding (24 hours)"}
              </Button>
            </CardContent>
          </Card>

          {/* Active Breeding */}
          {breedings.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">💕 Active Breeding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {breedings.map((breeding) => {
                  const pet1 = pets.find((p) => p.id === breeding.petId1);
                  const pet2 = pets.find((p) => p.id === breeding.petId2);
                  const timeLeft =
                    new Date(breeding.completesAt).getTime() - Date.now();
                  const isComplete = timeLeft <= 0;

                  return (
                    <Card
                      key={breeding.id}
                      data-testid={`card-breeding-${breeding.id}`}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {pet1?.name} × {pet2?.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isComplete ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              apiRequest(
                                "POST",
                                `/api/pets/breeding/${breeding.id}/complete`,
                              ).then(() => {
                                queryClient.invalidateQueries({
                                  queryKey: ["/api/pets/breeding"],
                                });
                                queryClient.invalidateQueries({
                                  queryKey: ["/api/pets"],
                                });
                                toast({
                                  title: "🎉 Breeding Complete!",
                                  description: "A new pet has been born!",
                                });
                              });
                            }}
                            data-testid={`button-complete-breeding-${breeding.id}`}
                          >
                            Get Offspring
                          </Button>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Time remaining: {Math.floor(timeLeft / 3600000)}h{" "}
                            {Math.floor((timeLeft % 3600000) / 60000)}m
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
            <p className="text-sm text-muted-foreground">
              Learn new skills to enhance your pet's abilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_SKILLS.map((skill) => (
              <Card
                key={skill.skillId}
                data-testid={`card-skill-${skill.skillId}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{skill.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {skill.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {skill.description}
                  </p>
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
              src={`/PetIcons/${selectedPetType?.iconPath || "futureupdate.png"}`}
              alt={selectedPetType?.name || "Pet"}
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
              <span className="font-bold">
                {selectedPetType?.adoptionCost?.toLocaleString()} 🪙
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdoptDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedPetType) {
                  adoptMutation.mutate({
                    petTypeId: selectedPetType.petId,
                    customName: customPetName || undefined,
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
              Allocate training points to improve stats (Max 35 points per
              session)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span>Training Points Available:</span>
              <span className="font-bold">
                {selectedPet?.trainingPoints || 0}
              </span>
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
                  onValueChange={(v) =>
                    setTrainingPoints((prev) => ({ ...prev, attack: v[0] }))
                  }
                  max={Math.min(
                    35 - (totalTrainingPoints - trainingPoints.attack),
                    selectedPet?.trainingPoints || 0,
                  )}
                  step={1}
                  data-testid="slider-attack"
                />
              </div>
              <div>
                <Label>Defense (+{trainingPoints.defense})</Label>
                <Slider
                  value={[trainingPoints.defense]}
                  onValueChange={(v) =>
                    setTrainingPoints((prev) => ({ ...prev, defense: v[0] }))
                  }
                  max={Math.min(
                    35 - (totalTrainingPoints - trainingPoints.defense),
                    selectedPet?.trainingPoints || 0,
                  )}
                  step={1}
                  data-testid="slider-defense"
                />
              </div>
              <div>
                <Label>Sustainability (+{trainingPoints.sustainability})</Label>
                <Slider
                  value={[trainingPoints.sustainability]}
                  onValueChange={(v) =>
                    setTrainingPoints((prev) => ({
                      ...prev,
                      sustainability: v[0],
                    }))
                  }
                  max={Math.min(
                    35 - (totalTrainingPoints - trainingPoints.sustainability),
                    selectedPet?.trainingPoints || 0,
                  )}
                  step={1}
                  data-testid="slider-sustainability"
                />
              </div>
              <div>
                <Label>Hunting (+{trainingPoints.hunting})</Label>
                <Slider
                  value={[trainingPoints.hunting]}
                  onValueChange={(v) =>
                    setTrainingPoints((prev) => ({ ...prev, hunting: v[0] }))
                  }
                  max={Math.min(
                    35 - (totalTrainingPoints - trainingPoints.hunting),
                    selectedPet?.trainingPoints || 0,
                  )}
                  step={1}
                  data-testid="slider-hunting"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTrainingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedPet && totalTrainingPoints > 0) {
                  Object.entries(trainingPoints).forEach(([stat, points]) => {
                    if (points > 0) {
                      trainMutation.mutate({
                        petId: selectedPet.id,
                        stat: stat as any,
                        points,
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
              const hasSkill = (
                (selectedPet?.skills as string[]) || []
              ).includes(skill.skillId);
              const canAfford =
                (selectedPet?.trainingPoints || 0) >= skill.trainingCost;

              return (
                <Card
                  key={skill.skillId}
                  className={hasSkill ? "bg-green-50 dark:bg-green-950" : ""}
                  data-testid={`card-pet-skill-${skill.skillId}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm">{skill.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      {hasSkill && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      {skill.description}
                    </p>
                    <div className="text-xs mb-2">
                      Cost: {skill.trainingCost} TP
                    </div>
                    {!hasSkill && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          if (selectedPet) {
                            learnSkillMutation.mutate({
                              petId: selectedPet.id,
                              skillId: skill.skillId,
                            });
                          }
                        }}
                        disabled={!canAfford || learnSkillMutation.isPending}
                        data-testid={`button-learn-${skill.skillId}`}
                      >
                        {canAfford ? (
                          "Learn"
                        ) : (
                          <Lock className="w-3 h-3 mr-1" />
                        )}
                        {canAfford ? "Learn" : "Insufficient TP"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Room Dialog */}
      <Dialog open={roomDialogOpen} onOpenChange={(open) => {
        setRoomDialogOpen(open);
        if (!open) setRoomTab("overview");
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" data-testid="dialog-room">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              {selectedRoom?.name}
            </DialogTitle>
            <DialogDescription>
              Customize your pet room with decorations and bonuses
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={roomTab} onValueChange={setRoomTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="decorations">Decorations</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Visual Room Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Room Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8 bg-black rounded-lg overflow-hidden" style={{ perspective: '1200px' }}>
                    <div className="relative" style={{ 
                      transformStyle: 'preserve-3d',
                      transform: 'rotateX(50deg) rotateZ(-45deg)',
                      width: '280px',
                      height: '280px'
                    }}>
                      {/* Floor */}
                      <div 
                        className="absolute w-full h-full flex items-center justify-center"
                        style={{
                          transform: 'translateZ(0px)',
                          background: selectedRoom?.floorStyle === 'carpet' ? 
                            'repeating-linear-gradient(0deg, #d4b896 0px, #d4b896 8px, #c9ad8b 8px, #c9ad8b 16px)' :
                            selectedRoom?.floorStyle === 'tile' ? 
                            'repeating-conic-gradient(#e8e8e8 0% 25%, #d8d8d8 0% 50%) 0 0 / 40px 40px' :
                            selectedRoom?.floorStyle === 'marble' ? 
                            'linear-gradient(135deg, #f5f5f5 25%, #e0e0e0 25%, #e0e0e0 50%, #f5f5f5 50%, #f5f5f5 75%, #e0e0e0 75%, #e0e0e0)' :
                            selectedRoom?.floorStyle === 'grass' ? '#8bc34a' : 
                            'repeating-linear-gradient(90deg, #cd853f 0px, #cd853f 20px, #d2691e 20px, #d2691e 40px)',
                          border: '2px solid #8b7355',
                          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3)'
                        }}
                      >
                        {/* Floor Decorations */}
                        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2 p-4">
                          {(selectedRoom?.floorDecorations as string[] || []).slice(0, 6).map((decId, i) => (
                            <div key={i} className="text-2xl" style={{ transform: 'rotateZ(45deg) rotateX(-50deg)' }}>
                              {getDecorationById(decId)?.emoji}
                            </div>
                          ))}
                        </div>

                        {/* Pets in Room */}
                        <div className="absolute inset-0 flex items-center justify-center gap-2">
                          {pets
                            .filter((p) => p.roomId === selectedRoom?.id)
                            .slice(0, 4)
                            .map((pet) => {
                              const petTypeData = petTypesMap.get(pet.petTypeId);
                              return (
                                <img
                                  key={pet.id}
                                  src={`/PetIcons/${petTypeData?.iconPath || "futureupdate.png"}`}
                                  alt={pet.name}
                                  className="w-10 h-10 object-contain"
                                  title={pet.name}
                                  style={{ transform: 'rotateZ(45deg) rotateX(-50deg)' }}
                                />
                              );
                            })}
                        </div>
                      </div>

                      {/* Back Wall */}
                      <div 
                        className="absolute w-full flex items-center justify-center"
                        style={{
                          height: '200px',
                          transform: 'rotateX(90deg) translateZ(-200px)',
                          transformOrigin: 'bottom',
                          background: selectedRoom?.wallStyle === 'brick' ? 
                            'repeating-linear-gradient(0deg, #a0522d 0px, #a0522d 15px, #8b4513 15px, #8b4513 30px), repeating-linear-gradient(90deg, transparent 0px, transparent 40px, #8b4513 40px, #8b4513 42px)' :
                            selectedRoom?.wallStyle === 'wood' ? 
                            'repeating-linear-gradient(90deg, #8b6f47 0px, #8b6f47 8px, #7a5f3a 8px, #7a5f3a 16px)' :
                            selectedRoom?.wallStyle === 'stone' ? 
                            'repeating-linear-gradient(45deg, #708090 0px, #708090 20px, #5f6f7f 20px, #5f6f7f 40px)' :
                            selectedRoom?.wallStyle === 'wallpaper' ? 
                            'repeating-linear-gradient(0deg, #f0e68c 0px, #f0e68c 15px, #e6d970 15px, #e6d970 30px)' : 
                            'linear-gradient(180deg, #e8dcc4 0%, #d4c8b0 100%)',
                          border: '2px solid #8b7355',
                          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.4)'
                        }}
                      >
                        {/* Wall Decorations */}
                        <div className="absolute inset-0 flex items-center justify-around px-8">
                          {(selectedRoom?.wallDecorations as string[] || []).slice(0, 3).map((decId, i) => (
                            <div key={i} className="text-2xl" style={{ transform: 'rotateX(-90deg) rotateZ(45deg)' }}>
                              {getDecorationById(decId)?.emoji}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Left Wall */}
                      <div 
                        className="absolute h-full"
                        style={{
                          width: '200px',
                          transform: 'rotateY(90deg) translateZ(-200px)',
                          transformOrigin: 'right',
                          background: selectedRoom?.wallStyle === 'brick' ? 
                            'repeating-linear-gradient(0deg, #a0522d 0px, #a0522d 15px, #8b4513 15px, #8b4513 30px), repeating-linear-gradient(90deg, transparent 0px, transparent 40px, #8b4513 40px, #8b4513 42px)' :
                            selectedRoom?.wallStyle === 'wood' ? 
                            'repeating-linear-gradient(90deg, #8b6f47 0px, #8b6f47 8px, #7a5f3a 8px, #7a5f3a 16px)' :
                            selectedRoom?.wallStyle === 'stone' ? 
                            'repeating-linear-gradient(45deg, #708090 0px, #708090 20px, #5f6f7f 20px, #5f6f7f 40px)' :
                            selectedRoom?.wallStyle === 'wallpaper' ? 
                            'repeating-linear-gradient(0deg, #f0e68c 0px, #f0e68c 15px, #e6d970 15px, #e6d970 30px)' : 
                            'linear-gradient(180deg, #e8dcc4 0%, #d4c8b0 100%)',
                          border: '2px solid #8b7355',
                          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Room Stats & Bonuses */}
              <Card>
                <CardHeader>
                  <CardTitle>Room Bonuses</CardTitle>
                  <CardDescription>
                    Active bonuses affecting all pets in this room
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const bonuses = calculateRoomBonuses(
                      selectedRoom?.floorStyle || 'wooden',
                      selectedRoom?.wallStyle || 'plain',
                      (selectedRoom?.floorDecorations as string[]) || [],
                      (selectedRoom?.wallDecorations as string[]) || []
                    );
                    
                    return bonuses.size > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Array.from(bonuses.entries()).map(([type, value]) => (
                          <div
                            key={type}
                            className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                          >
                            {type === 'hygiene' && <Droplets className="w-4 h-4 text-blue-500" />}
                            {type === 'fun' && <Smile className="w-4 h-4 text-purple-500" />}
                            {type === 'energy' && <Zap className="w-4 h-4 text-yellow-500" />}
                            {type === 'hunger' && <Heart className="w-4 h-4 text-red-500" />}
                            {type === 'exp' && <Star className="w-4 h-4 text-orange-500" />}
                            {type === 'decay_reduction' && <Sparkles className="w-4 h-4 text-green-500" />}
                            <div className="flex-1">
                              <div className="text-sm font-medium capitalize">
                                {type.replace('_', ' ')}
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                +{value}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No bonuses active. Add decorations to boost your pets' stats!
                      </p>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Pets in Room */}
              <Card>
                <CardHeader>
                  <CardTitle>Pets ({pets.filter(p => p.roomId === selectedRoom?.id).length}/5)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {pets
                      .filter((p) => !p.roomId || p.roomId === selectedRoom?.id)
                      .map((pet) => (
                        <Button
                          key={pet.id}
                          size="sm"
                          variant={
                            pet.roomId === selectedRoom?.id ? "default" : "outline"
                          }
                          onClick={() => {
                            if (selectedRoom) {
                              assignPetMutation.mutate({
                                roomId: selectedRoom.id,
                                petId: pet.id,
                              });
                            }
                          }}
                          data-testid={`button-assign-pet-${pet.id}`}
                        >
                          {pet.name} {pet.roomId === selectedRoom?.id && "✓"}
                        </Button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Decorations Tab */}
            <TabsContent value="decorations" className="space-y-4">
              {/* Floor Decorations */}
              <Card>
                <CardHeader>
                  <CardTitle>Floor Decorations ({(selectedRoom?.floorDecorations as string[] || []).length}/10)</CardTitle>
                  <CardDescription>
                    Purchase and place floor decorations to boost room bonuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FLOOR_DECORATIONS.map((dec) => {
                      const owned = (selectedRoom?.floorDecorations as string[] || []).includes(dec.id);
                      const canAfford = (userProfile?.coins || 0) >= dec.cost;
                      
                      return (
                        <Card key={dec.id} className={owned ? "bg-green-50 dark:bg-green-950 border-green-500" : ""}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-3xl">{dec.emoji}</span>
                                <div>
                                  <CardTitle className="text-sm">{dec.name}</CardTitle>
                                  <p className="text-xs text-muted-foreground">{dec.description}</p>
                                </div>
                              </div>
                              {owned && <CheckCircle className="w-5 h-5 text-green-500" />}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-xs space-y-1">
                              {dec.bonuses.map((bonus, i) => (
                                <div key={i} className="text-green-600 font-medium">
                                  {bonus.description}
                                </div>
                              ))}
                            </div>
                            {!owned && (
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  if (selectedRoom) {
                                    const newDecorations = [...(selectedRoom.floorDecorations as string[] || []), dec.id];
                                    updateRoomMutation.mutate({
                                      roomId: selectedRoom.id,
                                      updates: { floorDecorations: newDecorations },
                                    });
                                  }
                                }}
                                disabled={!canAfford || (selectedRoom?.floorDecorations as string[] || []).length >= 10}
                                data-testid={`button-buy-floor-${dec.id}`}
                              >
                                {canAfford ? `Buy ${dec.cost} 🪙` : <><Lock className="w-3 h-3 mr-1" /> {dec.cost} 🪙</>}
                              </Button>
                            )}
                            {owned && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full"
                                onClick={() => {
                                  if (selectedRoom) {
                                    const newDecorations = (selectedRoom.floorDecorations as string[] || []).filter(id => id !== dec.id);
                                    updateRoomMutation.mutate({
                                      roomId: selectedRoom.id,
                                      updates: { floorDecorations: newDecorations },
                                    });
                                  }
                                }}
                                data-testid={`button-remove-floor-${dec.id}`}
                              >
                                Remove
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Wall Decorations */}
              <Card>
                <CardHeader>
                  <CardTitle>Wall Decorations ({(selectedRoom?.wallDecorations as string[] || []).length}/10)</CardTitle>
                  <CardDescription>
                    Purchase and place wall decorations to boost room bonuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {WALL_DECORATIONS.map((dec) => {
                      const owned = (selectedRoom?.wallDecorations as string[] || []).includes(dec.id);
                      const canAfford = (userProfile?.coins || 0) >= dec.cost;
                      
                      return (
                        <Card key={dec.id} className={owned ? "bg-green-50 dark:bg-green-950 border-green-500" : ""}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-3xl">{dec.emoji}</span>
                                <div>
                                  <CardTitle className="text-sm">{dec.name}</CardTitle>
                                  <p className="text-xs text-muted-foreground">{dec.description}</p>
                                </div>
                              </div>
                              {owned && <CheckCircle className="w-5 h-5 text-green-500" />}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-xs space-y-1">
                              {dec.bonuses.map((bonus, i) => (
                                <div key={i} className="text-green-600 font-medium">
                                  {bonus.description}
                                </div>
                              ))}
                            </div>
                            {!owned && (
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  if (selectedRoom) {
                                    const newDecorations = [...(selectedRoom.wallDecorations as string[] || []), dec.id];
                                    updateRoomMutation.mutate({
                                      roomId: selectedRoom.id,
                                      updates: { wallDecorations: newDecorations },
                                    });
                                  }
                                }}
                                disabled={!canAfford || (selectedRoom?.wallDecorations as string[] || []).length >= 10}
                                data-testid={`button-buy-wall-${dec.id}`}
                              >
                                {canAfford ? `Buy ${dec.cost} 🪙` : <><Lock className="w-3 h-3 mr-1" /> {dec.cost} 🪙</>}
                              </Button>
                            )}
                            {owned && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full"
                                onClick={() => {
                                  if (selectedRoom) {
                                    const newDecorations = (selectedRoom.wallDecorations as string[] || []).filter(id => id !== dec.id);
                                    updateRoomMutation.mutate({
                                      roomId: selectedRoom.id,
                                      updates: { wallDecorations: newDecorations },
                                    });
                                  }
                                }}
                                data-testid={`button-remove-wall-${dec.id}`}
                              >
                                Remove
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              {/* Floor & Wall Styles */}
              <Card>
                <CardHeader>
                  <CardTitle>Room Styles</CardTitle>
                  <CardDescription>
                    Change the floor and wall styles of your room
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Floor Style</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {FLOOR_STYLES.map((style) => {
                        const selected = selectedRoom?.floorStyle === style.id;
                        const canAfford = (userProfile?.coins || 0) >= style.cost;
                        
                        return (
                          <Card key={style.id} className={selected ? "bg-blue-50 dark:bg-blue-950 border-blue-500" : ""}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{style.emoji}</span>
                                  <div>
                                    <CardTitle className="text-sm">{style.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{style.description}</p>
                                  </div>
                                </div>
                                {selected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                              </div>
                            </CardHeader>
                            <CardContent>
                              {style.bonuses.length > 0 && (
                                <div className="text-xs space-y-1 mb-2">
                                  {style.bonuses.map((bonus, i) => (
                                    <div key={i} className="text-green-600 font-medium">
                                      {bonus.description}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {!selected && (
                                <Button
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    if (selectedRoom) {
                                      updateRoomMutation.mutate({
                                        roomId: selectedRoom.id,
                                        updates: { floorStyle: style.id },
                                      });
                                    }
                                  }}
                                  disabled={!canAfford && style.cost > 0}
                                  data-testid={`button-floor-style-${style.id}`}
                                >
                                  {style.cost === 0 ? "Select" : canAfford ? `Buy ${style.cost} 🪙` : <><Lock className="w-3 h-3 mr-1" /> {style.cost} 🪙</>}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label>Wall Style</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {WALL_STYLES.map((style) => {
                        const selected = selectedRoom?.wallStyle === style.id;
                        const canAfford = (userProfile?.coins || 0) >= style.cost;
                        
                        return (
                          <Card key={style.id} className={selected ? "bg-blue-50 dark:bg-blue-950 border-blue-500" : ""}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{style.emoji}</span>
                                  <div>
                                    <CardTitle className="text-sm">{style.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{style.description}</p>
                                  </div>
                                </div>
                                {selected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                              </div>
                            </CardHeader>
                            <CardContent>
                              {style.bonuses.length > 0 && (
                                <div className="text-xs space-y-1 mb-2">
                                  {style.bonuses.map((bonus, i) => (
                                    <div key={i} className="text-green-600 font-medium">
                                      {bonus.description}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {!selected && (
                                <Button
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    if (selectedRoom) {
                                      updateRoomMutation.mutate({
                                        roomId: selectedRoom.id,
                                        updates: { wallStyle: style.id },
                                      });
                                    }
                                  }}
                                  disabled={!canAfford && style.cost > 0}
                                  data-testid={`button-wall-style-${style.id}`}
                                >
                                  {style.cost === 0 ? "Select" : canAfford ? `Buy ${style.cost} 🪙` : <><Lock className="w-3 h-3 mr-1" /> {style.cost} 🪙</>}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pet Sitter */}
              <Card>
                <CardHeader>
                  <CardTitle>Hire Pet Sitter</CardTitle>
                  <CardDescription>
                    Hire a sitter to automatically care for pets in this room
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedRoom?.sitterId ? (
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-sm font-medium">
                        Sitter: {AVAILABLE_SITTERS.find(s => s.sitterId === selectedRoom.sitterId)?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Active until: {selectedRoom.sitterUntil ? new Date(selectedRoom.sitterUntil).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {AVAILABLE_SITTERS.map((sitter) => (
                        <Card key={sitter.sitterId}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">{sitter.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{sitter.description}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="text-xs space-y-1 mb-2">
                              <div>Cost: {sitter.costPerHour} 🪙/hr</div>
                              <div className="text-green-600">Effectiveness: {sitter.effectiveness}%</div>
                            </div>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                if (selectedRoom) {
                                  hireSitterMutation.mutate({
                                    roomId: selectedRoom.id,
                                    sitterId: sitter.sitterId,
                                    hours: 24,
                                  });
                                }
                              }}
                              disabled={!userProfile || userProfile.coins < sitter.costPerHour * 24}
                              data-testid={`button-hire-sitter-${sitter.sitterId}`}
                            >
                              Hire (24h)
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delete Room */}
              <Card className="border-red-500">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Permanently delete this room. All pets will be moved out.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      if (selectedRoom && confirm(`Are you sure you want to delete "${selectedRoom.name}"? This cannot be undone.`)) {
                        deleteRoomMutation.mutate(selectedRoom.id);
                      }
                    }}
                    disabled={deleteRoomMutation.isPending}
                    data-testid="button-delete-room"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Delete Room
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
