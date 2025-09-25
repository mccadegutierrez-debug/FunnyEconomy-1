import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DailyRewards from "@/components/freemium/daily-rewards";
import Bank from "@/components/economy/bank";
import Transfer from "@/components/economy/transfer";
import Chat from "@/components/social/chat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Briefcase, Search, DollarSign, Skull, Target, Pickaxe, Smartphone, TrendingUp, Gamepad2, Ticket, Fish, Mountain, Waves } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/user/transactions"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user/transactions?limit=10");
      return res.json();
    },
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/leaderboard?limit=5");
      return res.json();
    },
  });

  // Work form schema and mutation
  const workSchema = z.object({
    jobType: z.enum(['meme-farmer', 'doge-miner', 'pepe-trader', 'nft-creator', 'mod-botter'])
  });

  const workForm = useForm<z.infer<typeof workSchema>>({
    resolver: zodResolver(workSchema),
    defaultValues: { jobType: 'meme-farmer' }
  });

  const workMutation = useMutation({
    mutationFn: async (data: z.infer<typeof workSchema>) => {
      const res = await apiRequest("POST", "/api/economy/work", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: `Work Complete! 💼`,
        description: `You earned ${data.coins} coins as a ${data.job}!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      workForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Work Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fishing form schema and mutation
  const fishingSchema = z.object({
    location: z.enum(['pond', 'lake', 'ocean'])
  });

  const fishingForm = useForm<z.infer<typeof fishingSchema>>({
    resolver: zodResolver(fishingSchema),
    defaultValues: { location: 'pond' }
  });

  const fishingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof fishingSchema>) => {
      const res = await apiRequest("POST", "/api/economy/fish", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Fishing Success! 🎣",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      fishingForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Fishing Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Crime form schema and mutation
  const crimeSchema = z.object({
    crimeType: z.enum(['steal-meme', 'rob-server', 'hack-computer', 'bank-heist'])
  });

  const crimeForm = useForm<z.infer<typeof crimeSchema>>({
    resolver: zodResolver(crimeSchema),
    defaultValues: { crimeType: 'steal-meme' }
  });

  const crimeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof crimeSchema>) => {
      const res = await apiRequest("POST", "/api/economy/crime", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Crime Success! 🦹" : "Crime Failed! 🚔",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      crimeForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Crime Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Search form schema and mutation
  const searchSchema = z.object({
    location: z.enum(['couch', 'vault', 'dumpster', 'pond', 'rock', 'purse'])
  });

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { location: 'couch' }
  });

  const searchMutation = useMutation({
    mutationFn: async (data: z.infer<typeof searchSchema>) => {
      const res = await apiRequest("POST", "/api/economy/search", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Search Complete! 🔍",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      searchForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Hunt form schema and mutation
  const huntSchema = z.object({
    huntType: z.enum(['forest', 'mountains', 'dragons-lair'])
  });

  const huntForm = useForm<z.infer<typeof huntSchema>>({
    resolver: zodResolver(huntSchema),
    defaultValues: { huntType: 'forest' }
  });

  const huntMutation = useMutation({
    mutationFn: async (data: z.infer<typeof huntSchema>) => {
      const res = await apiRequest("POST", "/api/economy/hunt", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Hunt Success! 🏹",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      huntForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Hunt Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Dig form schema and mutation
  const digSchema = z.object({
    location: z.enum(['backyard', 'beach', 'cave'])
  });

  const digForm = useForm<z.infer<typeof digSchema>>({
    resolver: zodResolver(digSchema),
    defaultValues: { location: 'backyard' }
  });

  const digMutation = useMutation({
    mutationFn: async (data: z.infer<typeof digSchema>) => {
      const res = await apiRequest("POST", "/api/economy/dig", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Dig Success! ⛏️",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      digForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Dig Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Post Meme form schema and mutation
  const memeSchema = z.object({
    memeType: z.enum(['normie', 'dank', 'fresh', 'spicy', 'god-tier'])
  });

  const memeForm = useForm<z.infer<typeof memeSchema>>({
    resolver: zodResolver(memeSchema),
    defaultValues: { memeType: 'normie' }
  });

  const postmemeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof memeSchema>) => {
      const res = await apiRequest("POST", "/api/economy/postmeme", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Meme Posted! 📱",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      memeForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Post Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Stream form schema and mutation
  const streamSchema = z.object({
    gameChoice: z.enum(['among-us', 'fortnite', 'minecraft', 'fall-guys', 'valorant', 'apex-legends'])
  });

  const streamForm = useForm<z.infer<typeof streamSchema>>({
    resolver: zodResolver(streamSchema),
    defaultValues: { gameChoice: 'among-us' }
  });

  const streamMutation = useMutation({
    mutationFn: async (data: z.infer<typeof streamSchema>) => {
      const res = await apiRequest("POST", "/api/economy/stream", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Stream Complete! 📺",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      streamForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Stream Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Simple mutations for commands that don't need options
  const begMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/economy/beg");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Begging Success! 🥺" : "Begging Failed 😔",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Begging Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const scratchMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/economy/scratch");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Scratch Win! 🎫✨" : "Scratch Loss! 🎫💸",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Scratch Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Highlow form schema
  const highlowSchema = z.object({
    guess: z.enum(['higher', 'lower']),
    betAmount: z.number().min(10, "Minimum bet is 10 coins").max(100000, "Maximum bet is 100,000 coins")
  });

  const highlowForm = useForm<z.infer<typeof highlowSchema>>({
    resolver: zodResolver(highlowSchema),
    defaultValues: {
      guess: 'higher',
      betAmount: 50
    }
  });

  const highlowMutation = useMutation({
    mutationFn: async (data: z.infer<typeof highlowSchema>) => {
      const res = await apiRequest("POST", "/api/economy/highlow", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Highlow Win! 🎯" : "Highlow Loss! 📉",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      highlowForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Highlow Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const levelProgress = user ? (user.xp % (user.level * 1000)) / (user.level * 1000) * 100 : 0;
  const nextLevelXP = user ? user.level * 1000 : 1000;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-12">
        {/* Welcome Section */}
        <Card className="glow-primary border-primary/20" data-testid="welcome-card">
          <CardContent className="p-8 text-center">
            <h2 className="font-impact text-4xl text-primary mb-2" data-testid="welcome-title">
              Welcome back, <span className="text-accent">{user?.username}</span>! 🚀
            </h2>
            <p className="text-muted-foreground text-lg mb-6">Ready to meme your way to riches? 💰</p>
            
            {/* Level Progress */}
            <div className="mb-6 max-w-md mx-auto" data-testid="level-progress">
              <div className="flex justify-between items-center mb-2">
                <span className="text-foreground font-semibold">Level Progress</span>
                <span className="text-muted-foreground text-sm">
                  {user?.xp || 0} / {nextLevelXP} XP
                </span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
              <DailyRewards />
              
              {/* Work Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-to-r from-secondary to-primary hover:scale-105 transition-transform glow-secondary cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Briefcase className="mx-auto mb-2 text-2xl" />
                      <h3 className="font-comic font-bold text-secondary-foreground">Work</h3>
                      <Button
                        className="mt-2 w-full bg-transparent hover:bg-white/20"
                        size="sm"
                        data-testid="button-work"
                      >
                        Work Now!
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Choose Your Job 💼</DialogTitle>
                    <DialogDescription>
                      Select what kind of work you want to do today!
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...workForm}>
                    <form onSubmit={workForm.handleSubmit((data) => workMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={workForm.control}
                        name="jobType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-job">
                                  <SelectValue placeholder="Choose your job" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="meme-farmer">Meme Farmer 🌾</SelectItem>
                                <SelectItem value="doge-miner">Doge Miner ⛏️</SelectItem>
                                <SelectItem value="pepe-trader">Pepe Trader 📈</SelectItem>
                                <SelectItem value="nft-creator">NFT Creator 🎨</SelectItem>
                                <SelectItem value="mod-botter">Mod Botter 🤖</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={workMutation.isPending}
                        className="w-full"
                        data-testid="button-start-work"
                      >
                        {workMutation.isPending ? "Working..." : "Start Working!"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              <Card className="bg-gradient-to-r from-accent to-secondary hover:scale-105 transition-transform glow-accent">
                <CardContent className="p-4 text-center">
                  <span className="text-2xl mb-2 block">🥺</span>
                  <h3 className="font-comic font-bold text-accent-foreground">Beg</h3>
                  <Button
                    onClick={() => begMutation.mutate()}
                    disabled={begMutation.isPending}
                    className="mt-2 w-full bg-transparent hover:bg-white/20"
                    size="sm"
                    data-testid="button-beg"
                  >
                    {begMutation.isPending ? "Begging..." : "Beg Now!"}
                  </Button>
                </CardContent>
              </Card>
              
              {/* Search Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Search className="mx-auto mb-2 text-2xl" />
                      <h3 className="font-comic font-bold text-primary-foreground">Search</h3>
                      <Button
                        className="mt-2 w-full bg-transparent hover:bg-white/20"
                        size="sm"
                        data-testid="button-search"
                      >
                        Search Now!
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Where to Search? 🔍</DialogTitle>
                    <DialogDescription>
                      Choose where you want to search for hidden treasures!
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...searchForm}>
                    <form onSubmit={searchForm.handleSubmit((data) => searchMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={searchForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Search Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-search-location">
                                  <SelectValue placeholder="Choose location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="couch">Under the Couch 🛋️</SelectItem>
                                <SelectItem value="vault">In the Meme Vault 🏦</SelectItem>
                                <SelectItem value="dumpster">Behind a Dumpster 🗑️</SelectItem>
                                <SelectItem value="pond">In Pepe's Pond 🐸</SelectItem>
                                <SelectItem value="rock">Under a Rock 🪨</SelectItem>
                                <SelectItem value="purse">In Your Mom's Purse 👛</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={searchMutation.isPending}
                        className="w-full"
                        data-testid="button-start-search"
                      >
                        {searchMutation.isPending ? "Searching..." : "Start Searching!"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Crime Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 transition-transform glow-red cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Skull className="mx-auto mb-2 text-2xl text-white" />
                      <h3 className="font-comic font-bold text-white">Crime</h3>
                      <Button
                        className="mt-2 w-full bg-transparent hover:bg-white/20"
                        size="sm"
                        data-testid="button-crime"
                      >
                        Crime Now!
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Choose Your Crime 🦹</DialogTitle>
                    <DialogDescription>
                      What kind of mischief are you up to today? Higher risk = higher reward!
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...crimeForm}>
                    <form onSubmit={crimeForm.handleSubmit((data) => crimeMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={crimeForm.control}
                        name="crimeType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Crime Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-crime-type">
                                  <SelectValue placeholder="Choose your crime" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="steal-meme">Steal a Meme (Easy) 🖼️</SelectItem>
                                <SelectItem value="rob-server">Rob a Discord Server (Medium) 💻</SelectItem>
                                <SelectItem value="hack-computer">Hack a Computer (Hard) 🔓</SelectItem>
                                <SelectItem value="bank-heist">Bank Heist (Expert) 🏦</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={crimeMutation.isPending}
                        className="w-full"
                        data-testid="button-commit-crime"
                      >
                        {crimeMutation.isPending ? "Committing..." : "Commit Crime!"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Hunt Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-to-r from-green-600 to-green-800 hover:scale-105 transition-transform glow-green cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Target className="mx-auto mb-2 text-2xl text-white" />
                      <h3 className="font-comic font-bold text-white">Hunt</h3>
                      <Button
                        className="mt-2 w-full bg-transparent hover:bg-white/20"
                        size="sm"
                        data-testid="button-hunt"
                      >
                        Hunt Now!
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Choose Hunting Ground 🏹</DialogTitle>
                    <DialogDescription>
                      Where do you want to hunt? Different areas have different creatures!
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...huntForm}>
                    <form onSubmit={huntForm.handleSubmit((data) => huntMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={huntForm.control}
                        name="huntType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hunting Area</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-hunt-area">
                                  <SelectValue placeholder="Choose hunting area" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="forest">Forest (Easy) 🌲</SelectItem>
                                <SelectItem value="mountains">Mountains (Medium) ⛰️</SelectItem>
                                <SelectItem value="dragons-lair">Dragon's Lair (Expert) 🐉</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={huntMutation.isPending}
                        className="w-full"
                        data-testid="button-start-hunt"
                      >
                        {huntMutation.isPending ? "Hunting..." : "Start Hunt!"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Dig Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:scale-105 transition-transform glow-yellow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Pickaxe className="mx-auto mb-2 text-2xl text-white" />
                      <h3 className="font-comic font-bold text-white">Dig</h3>
                      <Button
                        className="mt-2 w-full bg-transparent hover:bg-white/20"
                        size="sm"
                        data-testid="button-dig"
                      >
                        Dig Now!
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Choose Digging Location ⛏️</DialogTitle>
                    <DialogDescription>
                      Where do you want to dig for treasure? Each location has different rewards!
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...digForm}>
                    <form onSubmit={digForm.handleSubmit((data) => digMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={digForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Digging Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-dig-location">
                                  <SelectValue placeholder="Choose location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="backyard">Backyard (Easy) 🏡</SelectItem>
                                <SelectItem value="beach">Beach (Medium) 🏖️</SelectItem>
                                <SelectItem value="cave">Cave (Hard) 🕳️</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={digMutation.isPending}
                        className="w-full"
                        data-testid="button-start-dig"
                      >
                        {digMutation.isPending ? "Digging..." : "Start Digging!"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Post Meme Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform glow-purple cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Smartphone className="mx-auto mb-2 text-2xl text-white" />
                      <h3 className="font-comic font-bold text-white">Post Meme</h3>
                      <Button
                        className="mt-2 w-full bg-transparent hover:bg-white/20"
                        size="sm"
                        data-testid="button-postmeme"
                      >
                        Post Meme!
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Choose Meme Type 📱</DialogTitle>
                    <DialogDescription>
                      What kind of meme are you posting today? Quality affects likes and coins!
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...memeForm}>
                    <form onSubmit={memeForm.handleSubmit((data) => postmemeMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={memeForm.control}
                        name="memeType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meme Quality</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-meme-type">
                                  <SelectValue placeholder="Choose meme type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="normie">Normie Meme 😐</SelectItem>
                                <SelectItem value="dank">Dank Meme 😎</SelectItem>
                                <SelectItem value="fresh">Fresh Meme ✨</SelectItem>
                                <SelectItem value="spicy">Spicy Meme 🌶️</SelectItem>
                                <SelectItem value="god-tier">God-Tier Meme 👑</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={postmemeMutation.isPending}
                        className="w-full"
                        data-testid="button-post-meme"
                      >
                        {postmemeMutation.isPending ? "Posting..." : "Post Meme!"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Stream Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-transform glow-blue cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="mx-auto mb-2 text-2xl text-white" />
                      <h3 className="font-comic font-bold text-white">Stream</h3>
                      <Button
                        className="mt-2 w-full bg-transparent hover:bg-white/20"
                        size="sm"
                        data-testid="button-stream"
                      >
                        Stream Now!
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Choose Game to Stream 📺</DialogTitle>
                    <DialogDescription>
                      What game do you want to stream today? Popular games get more viewers!
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...streamForm}>
                    <form onSubmit={streamForm.handleSubmit((data) => streamMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={streamForm.control}
                        name="gameChoice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Game to Stream</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-stream-game">
                                  <SelectValue placeholder="Choose game" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="among-us">Among Us 👨‍🚀</SelectItem>
                                <SelectItem value="fortnite">Fortnite 🔫 (Trending!)</SelectItem>
                                <SelectItem value="minecraft">Minecraft ⛏️</SelectItem>
                                <SelectItem value="fall-guys">Fall Guys 🎪</SelectItem>
                                <SelectItem value="valorant">Valorant 💥 (Trending!)</SelectItem>
                                <SelectItem value="apex-legends">Apex Legends 🏆</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={streamMutation.isPending}
                        className="w-full"
                        data-testid="button-start-stream"
                      >
                        {streamMutation.isPending ? "Streaming..." : "Start Stream!"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Fishing Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105 transition-transform glow-cyan cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Fish className="mx-auto mb-2 text-2xl text-white" />
                      <h3 className="font-comic font-bold text-white">Fishing</h3>
                      <Button
                        className="mt-2 w-full bg-transparent hover:bg-white/20"
                        size="sm"
                        data-testid="button-fish"
                      >
                        Fish Now!
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Choose Fishing Spot 🎣</DialogTitle>
                    <DialogDescription>
                      Where do you want to cast your line? Different waters have different fish!
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...fishingForm}>
                    <form onSubmit={fishingForm.handleSubmit((data) => fishingMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={fishingForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fishing Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-fishing-location">
                                  <SelectValue placeholder="Choose fishing spot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pond">Pond (Easy) 🐸</SelectItem>
                                <SelectItem value="lake">Lake (Medium) 🏞️</SelectItem>
                                <SelectItem value="ocean">Ocean (Hard) 🌊</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={fishingMutation.isPending}
                        className="w-full"
                        data-testid="button-start-fishing"
                      >
                        {fishingMutation.isPending ? "Fishing..." : "Cast Line!"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Card className="bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 transition-transform glow-orange">
                <CardContent className="p-4 text-center">
                  <Ticket className="mx-auto mb-2 text-2xl text-white" />
                  <h3 className="font-comic font-bold text-white">Scratch</h3>
                  <Button
                    onClick={() => scratchMutation.mutate()}
                    disabled={scratchMutation.isPending}
                    className="mt-2 w-full bg-transparent hover:bg-white/20"
                    size="sm"
                    data-testid="button-scratch"
                  >
                    {scratchMutation.isPending ? "Scratching..." : "Scratch Now!"}
                  </Button>
                </CardContent>
              </Card>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-105 transition-transform glow-cyan cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="mx-auto mb-2 text-2xl text-white" />
                      <h3 className="font-comic font-bold text-white">High-Low</h3>
                      <Button
                        className="mt-2 w-full bg-transparent hover:bg-white/20"
                        size="sm"
                        data-testid="button-highlow"
                      >
                        Play Now!
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>High-Low Game 🎯</DialogTitle>
                    <DialogDescription>
                      Guess if the next number (1-100) will be higher or lower than the current number!
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...highlowForm}>
                    <form onSubmit={highlowForm.handleSubmit((data) => highlowMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={highlowForm.control}
                        name="betAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bet Amount (coins)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="50"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-bet-amount"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={highlowForm.control}
                        name="guess"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Guess</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-guess">
                                  <SelectValue placeholder="Choose your guess" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="higher">Higher ⬆️</SelectItem>
                                <SelectItem value="lower">Lower ⬇️</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={highlowMutation.isPending}
                        className="w-full"
                        data-testid="button-place-bet"
                      >
                        {highlowMutation.isPending ? "Playing..." : "Place Bet!"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Economy and Social Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Economy Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Bank />
              <Transfer />
            </div>
            
            {/* Recent Activity */}
            <Card data-testid="activity-feed">
              <CardHeader>
                <CardTitle className="font-impact text-2xl text-primary">💰 Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent activity</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {transactions.map((transaction: any, index: number) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`transaction-${index}`}>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={transaction.type === 'earn' ? 'default' : 'destructive'}>
                          {transaction.type === 'earn' ? '+' : '-'}{transaction.amount} coins
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            {/* Leaderboard Preview */}
            <Card data-testid="leaderboard-preview">
              <CardHeader>
                <CardTitle className="font-impact text-xl text-accent">🏆 Top Players</CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Loading leaderboard...</p>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((player: any, index: number) => (
                      <div key={player.username} className="flex items-center justify-between" data-testid={`leaderboard-${index}`}>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">#{index + 1}</Badge>
                          <div>
                            <p className="font-bold text-foreground">{player.username}</p>
                            <p className="text-sm text-muted-foreground">Level {player.level}</p>
                          </div>
                        </div>
                        <p className="font-bold text-accent">{player.coins.toLocaleString()} coins</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Chat */}
            <Chat />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}