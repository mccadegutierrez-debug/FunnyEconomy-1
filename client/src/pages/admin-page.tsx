import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Users, DollarSign, Settings, Command, Package, Activity, BarChart3, Search, Plus, Edit2, Trash2, Eye, RefreshCw, Clock, TrendingUp, Database, Server, Heart } from "lucide-react";
import { AVAILABLE_PETS } from "@shared/pets-data";

export default function AdminPage() {
  const [command, setCommand] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banReason, setBanReason] = useState("");
  const [tempBanDuration, setTempBanDuration] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [usersPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    type: "tool",
    rarity: "common",
    stock: "",
    effects: {
      passive: { winRateBoost: 0, coinsPerHour: 0 },
      active: { useCooldown: 0, duration: 0, effect: "" }
    },
    lootboxContents: [] as { itemName: string; rarity: string; chance: number }[],
    consumableEffect: { type: "", magnitude: 0, duration: 0 }
  });
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showUserActionDialog, setShowUserActionDialog] = useState(false);
  const [userAction, setUserAction] = useState<string>("");
  const [selectedAdminRole, setSelectedAdminRole] = useState("");
  const [selectedPetId, setSelectedPetId] = useState("");
  const [petName, setPetName] = useState("");
  const [showPetDialog, setShowPetDialog] = useState(false);
  const [expandedUserActions, setExpandedUserActions] = useState<Set<string>>(new Set());
  const [showCreatePetDialog, setShowCreatePetDialog] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    emoji: "",
    rarity: "common",
    adoptionCost: "",
    hungerDecay: "",
    hygieneDecay: "",
    energyDecay: "",
    funDecay: ""
  });
  const { toast } = useToast();

  // Helper function to toggle user actions expansion
  const toggleUserActions = (userId: string) => {
    setExpandedUserActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Check admin access through session-based authentication
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setIsAuthenticating(true);
        
        // First check if user is logged in
        const userRes = await apiRequest("GET", "/api/user");
        
        if (!userRes.ok) {
          setAuthError("Please log in first to access admin panel.");
          setIsAuthenticated(false);
          return;
        }
        
        const userData = await userRes.json();
        setCurrentUser(userData);
        
        // Check admin access by trying to access admin endpoint
        const adminRes = await apiRequest("GET", "/api/admin/users");
        
        if (adminRes.ok) {
          setIsAuthenticated(true);
          setAuthError("");
        } else {
          setIsAuthenticated(false);
          setAuthError("Admin authentication required. Please enter the admin key.");
        }
      } catch (error) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setAuthError("Please log in first to access admin panel.");
      } finally {
        setIsAuthenticating(false);
      }
    };
    
    checkAdminAccess();
  }, []);
  
  // Fetch admin data using session-based authentication only
  const { data: users = [], isLoading, error, isFetching: isFetchingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/users");
      return res.json();
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch items for item management
  const { data: items = [], isFetching: isFetchingItems } = useQuery({
    queryKey: ["/api/admin/items"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/items");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  // Fetch transactions for monitoring
  const { data: transactions = [], isFetching: isFetchingTransactions } = useQuery({
    queryKey: ["/api/admin/transactions"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/transactions");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  // Fetch analytics data
  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/analytics");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const executeCommandMutation = useMutation({
    mutationFn: async (cmd: string) => {
      const res = await apiRequest("POST", "/api/admin/command", {
        body: { command: cmd }
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Command Executed! ⚙️",
        description: data.message,
      });
      setCommand("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Command Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/ban`, {
        body: { reason }
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "User Banned! 🔨",
        description: "User has been banned successfully.",
      });
      setSelectedUser(null);
      setBanReason("");
      setShowUserActionDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Ban Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/unban`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "User Unbanned! ✅",
        description: "User has been unbanned successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const tempBanUserMutation = useMutation({
    mutationFn: async ({ userId, reason, duration }: { userId: string; reason: string; duration: string }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/tempban`, {
        body: { reason, duration: parseInt(duration) || 1 }
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "User Temporarily Banned! ⏱️",
        description: "User has been temporarily banned successfully.",
      });
      setSelectedUser(null);
      setBanReason("");
      setTempBanDuration("");
      setShowUserActionDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const giveCoinsUserMutation = useMutation({
    mutationFn: async ({ userId, amount }: { userId: string; amount: string }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/give-coins`, {
        body: { amount: parseInt(amount) || 0 }
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Coins Given! 💰",
        description: "Coins have been given to the user successfully.",
      });
      setSelectedUser(null);
      setCoinAmount("");
      setShowUserActionDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const removeCoinsUserMutation = useMutation({
    mutationFn: async ({ userId, amount }: { userId: string; amount: string }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/remove-coins`, {
        body: { amount: parseInt(amount) || 0 }
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Coins Removed! 💸",
        description: data.message || "Coins have been removed from the user successfully.",
      });
      setSelectedUser(null);
      setCoinAmount("");
      setShowUserActionDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Remove Coins Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const givePetMutation = useMutation({
    mutationFn: async ({ userId, petId, petName }: { userId: string; petId: string; petName: string }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/give-pet`, {
        body: { petId, petName }
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Pet Given! 🐾",
        description: data.message || "Pet has been given to the user successfully.",
      });
      setSelectedUser(null);
      setSelectedPetId("");
      setPetName("");
      setShowPetDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Give Pet Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createPetMutation = useMutation({
    mutationFn: async (petData: any) => {
      const res = await apiRequest("POST", "/api/admin/pets", {
        body: {
          name: petData.name,
          emoji: petData.emoji,
          rarity: petData.rarity,
          adoptionCost: parseInt(petData.adoptionCost),
          hungerDecay: parseInt(petData.hungerDecay),
          hygieneDecay: parseInt(petData.hygieneDecay),
          energyDecay: parseInt(petData.energyDecay),
          funDecay: parseInt(petData.funDecay)
        }
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Pet Created! 🐾",
        description: data.message || "New pet has been created successfully.",
      });
      setShowCreatePetDialog(false);
      setNewPet({
        name: "",
        emoji: "",
        rarity: "common",
        adoptionCost: "",
        hungerDecay: "",
        hygieneDecay: "",
        energyDecay: "",
        funDecay: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Create Pet Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      const effectsData: any = {
        passive: itemData.effects.passive,
        active: itemData.effects.active
      };
      
      if (itemData.type === 'lootbox') {
        effectsData.lootboxContents = itemData.lootboxContents;
      } else if (itemData.type === 'consumable') {
        effectsData.consumableEffect = itemData.consumableEffect;
      }
      
      const res = await apiRequest("POST", "/api/admin/items", {
        body: {
          name: itemData.name,
          description: itemData.description,
          price: parseFloat(itemData.price) || 0,
          stock: itemData.stock === "999999" ? 2147483647 : parseInt(itemData.stock) || 0,
          type: itemData.type,
          rarity: itemData.rarity,
          currentPrice: parseFloat(itemData.price) || 0,
          effects: effectsData
        }
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Item Created! 📦",
        description: "New item has been created successfully.",
      });
      setNewItem({
        name: "",
        description: "",
        price: "",
        type: "tool",
        rarity: "common",
        stock: "",
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        lootboxContents: [],
        consumableEffect: { type: "", magnitude: 0, duration: 0 }
      });
      setShowItemDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/items"] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, itemData }: { id: string; itemData: any }) => {
      const res = await apiRequest("PUT", `/api/admin/items/${id}`, {
        body: {
          name: itemData.name,
          description: itemData.description,
          price: parseFloat(itemData.price) || undefined,
          stock: itemData.stock === "999999" ? 2147483647 : parseInt(itemData.stock) || undefined,
          type: itemData.type,
          rarity: itemData.rarity,
          currentPrice: parseFloat(itemData.price) || undefined
        }
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Item Updated! ✏️",
        description: "Item has been updated successfully.",
      });
      setSelectedItem(null);
      setShowItemDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/items"] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/items/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Item Deleted! 🗑️",
        description: "Item has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/items"] });
    },
  });

  const giveAdminRoleMutation = useMutation({
    mutationFn: async ({ userId, adminRole }: { userId: string; adminRole: string }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/give-admin`, {
        body: { adminRole }
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Admin Role Granted! 🛡️",
        description: data.message,
      });
      setSelectedUser(null);
      setSelectedAdminRole("");
      setShowUserActionDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Grant Admin Role Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeAdminRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/remove-admin`);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Admin Role Removed! 🚫",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Remove Admin Role Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdminKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey) {
      setIsAuthenticating(true);
      try {
        // Use new admin authentication endpoint
        const res = await apiRequest("POST", "/api/admin/authenticate", {
          body: { adminKey }
        });
        
        if (res.ok) {
          setIsAuthenticated(true);
          setAdminKey(""); // Clear the key from memory
          toast({
            title: "Access Granted! 🔓",
            description: "Welcome to the admin panel",
          });
          // Refresh the queries to load admin data
          queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
          queryClient.invalidateQueries({ queryKey: ["/api/admin/items"] });
          queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
        } else {
          const errorData = await res.json();
          toast({
            title: "Access Denied ❌",
            description: errorData.error || "Invalid admin key",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Access Denied ❌",
          description: "Authentication failed",
          variant: "destructive",
        });
      } finally {
        setIsAuthenticating(false);
      }
    }
  };

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommandMutation.mutate(command.trim());
    }
  };

  // Show admin key input if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto border-destructive/20">
            <CardHeader className="text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <CardTitle className="font-impact text-2xl text-destructive">
                🔧 ADMIN ACCESS REQUIRED
              </CardTitle>
              <CardDescription>
                Enter the admin key to access the control panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminKeySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="admin-key">Admin Key</Label>
                  <Input
                    id="admin-key"
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin key"
                    data-testid="input-admin-key"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full font-comic bg-destructive hover:bg-destructive/80"
                  data-testid="button-submit-admin-key"
                  disabled={isAuthenticating}
                >
                  {isAuthenticating ? "⏳ Checking Access..." : "🔓 ACCESS ADMIN PANEL"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error if authentication failed
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto border-destructive">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-bold text-destructive mb-2">Access Denied</h3>
              <p className="text-muted-foreground mb-4">Invalid admin key or insufficient permissions.</p>
              <Button 
                onClick={() => {
                  setAdminKey("");
                  setAuthError("");
                  setIsAuthenticated(false);
                }}
                variant="outline"
                data-testid="button-try-again"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        <div className="text-center">
          <h1 className="font-impact text-4xl text-destructive mb-2" data-testid="admin-title">
            🔧 ADMIN PANEL 🔧
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage users, economy, and system settings
          </p>
          <Badge variant="destructive" className="mt-2">
            RESTRICTED ACCESS
          </Badge>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 h-auto p-2 bg-muted rounded-lg">
              <TabsTrigger value="overview" data-testid="tab-overview" className="flex-shrink-0">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users" className="flex-shrink-0">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="items" data-testid="tab-items" className="flex-shrink-0">
                <Package className="w-4 h-4 mr-2" />
                Items
              </TabsTrigger>
              <TabsTrigger value="transactions" data-testid="tab-transactions" className="flex-shrink-0">
                <Activity className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics" className="flex-shrink-0">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="pets" data-testid="tab-pets" className="flex-shrink-0">
                <Heart className="w-4 h-4 mr-2" />
                Pets
              </TabsTrigger>
              <TabsTrigger value="system" data-testid="tab-system" className="flex-shrink-0">
                <Settings className="w-4 h-4 mr-2" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <div className="text-2xl font-bold text-primary" data-testid="overview-total-users">
                        {analytics?.users?.total || 0}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-accent" />
                      <div className="text-2xl font-bold text-accent" data-testid="overview-total-coins">
                        {analytics?.economy?.totalCoins?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Total Coins</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Package className="w-5 h-5 text-secondary" />
                      <div className="text-2xl font-bold text-secondary" data-testid="overview-total-items">
                        {analytics?.economy?.totalItems || 0}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Total Items</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Server className="w-5 h-5 text-green-500" />
                      <div className="text-2xl font-bold text-green-500" data-testid="overview-uptime">
                        {analytics?.system?.uptime ? Math.floor(analytics.system.uptime / 3600) : 0}h
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Server Uptime</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-impact text-xl">📊 Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Active Users:</span>
                        <Badge variant="secondary">{analytics?.users?.active || 0}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Banned Users:</span>
                        <Badge variant="destructive">{analytics?.users?.banned || 0}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>New Users (7d):</span>
                        <Badge variant="outline">{analytics?.users?.recent || 0}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Level:</span>
                        <Badge>{analytics?.economy?.avgLevel || 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-impact text-xl">⚡ Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {transactions.slice(0, 5).map((transaction: any) => (
                        <div key={transaction.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                          <div>
                            <span className="font-medium">{transaction.user}</span>
                            <span className="text-muted-foreground"> • {transaction.type}</span>
                          </div>
                          <div className={`font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="space-y-4">
                  <div>
                    <CardTitle className="font-impact text-2xl text-primary">👥 USER MANAGEMENT</CardTitle>
                    <CardDescription className="text-base">
                      Manage user accounts, bans, permissions, and coins
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        placeholder="Search users by username..."
                        className="pl-10"
                        data-testid="input-user-search"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowAllUsers(!showAllUsers)}
                        variant={showAllUsers ? "default" : "outline"}
                        size="sm"
                        data-testid="button-show-all-users"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {showAllUsers ? "Show Less" : "Show All Users"}
                      </Button>
                      
                      <Button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] })}
                        variant="outline"
                        size="sm"
                        disabled={isFetchingUsers}
                        data-testid="button-refresh-users"
                      >
                        <RefreshCw className={`w-4 h-4 ${isFetchingUsers ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-primary">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary" data-testid="total-users">
                          {users.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Users</div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-500" data-testid="active-users">
                          {users.filter((u: any) => !u.banned).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Users</div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-destructive">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-destructive" data-testid="banned-users">
                          {users.filter((u: any) => u.banned).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Banned Users</div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-500" data-testid="temp-banned-users">
                          {users.filter((u: any) => u.tempBanUntil && new Date(u.tempBanUntil) > new Date()).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Temp Banned</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">User List</h3>
                      <p className="text-sm text-muted-foreground">
                        Showing {showAllUsers ? 'all' : `first ${usersPerPage}`} users
                        {userSearchTerm && ` matching "${userSearchTerm}"`}
                      </p>
                    </div>
                    
                    <div className="space-y-3 max-h-[600px] overflow-y-auto border rounded-lg p-4">
                      {users
                        .filter((user: any) => 
                          userSearchTerm === "" || 
                          user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
                        )
                        .slice(0, showAllUsers ? undefined : usersPerPage)
                        .map((user: any) => (
                          <div 
                            key={user.id}
                            className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                            data-testid={`user-${user.id}`}
                          >
                            <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                            {user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-foreground flex items-center space-x-2">
                              <span>{user.username}</span>
                              {user.banned && <Badge variant="destructive">BANNED</Badge>}
                              {user.tempBanUntil && new Date(user.tempBanUntil) > new Date() && (
                                <Badge variant="secondary">TEMP BANNED</Badge>
                              )}
                              {user.adminRole && user.adminRole !== 'none' && (
                                <Badge variant={user.adminRole === 'owner' ? 'default' : 'outline'} className={
                                  user.adminRole === 'owner' ? 'bg-purple-600 text-white' :
                                  user.adminRole === 'lead_admin' ? 'bg-red-600 text-white' :
                                  user.adminRole === 'senior_admin' ? 'bg-orange-600 text-white' :
                                  user.adminRole === 'admin' ? 'bg-blue-600 text-white' :
                                  user.adminRole === 'junior_admin' ? 'bg-green-600 text-white' : ''
                                }>
                                  {user.adminRole === 'owner' ? '👑 OWNER' :
                                   user.adminRole === 'lead_admin' ? '🔴 LEAD ADMIN' :
                                   user.adminRole === 'senior_admin' ? '🟠 SENIOR ADMIN' :
                                   user.adminRole === 'admin' ? '🔵 ADMIN' :
                                   user.adminRole === 'junior_admin' ? '🟢 JUNIOR ADMIN' : ''}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Level {user.level} • {user.coins?.toLocaleString() || 0} coins
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                              {user.tempBanUntil && new Date(user.tempBanUntil) > new Date() && (
                                <span> • Temp ban until {new Date(user.tempBanUntil).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.banned || (user.tempBanUntil && new Date(user.tempBanUntil) > new Date()) ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => unbanUserMutation.mutate(user.id)}
                              data-testid={`button-unban-${user.id}`}
                            >
                              ✅ Unban {user.banned ? "(Permanent)" : "(Temp)"}
                            </Button>
                          ) : (
                            <>
                              {/* Essential actions - always visible */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setUserAction("give-coins");
                                  setShowUserActionDialog(true);
                                }}
                                data-testid={`button-give-coins-${user.id}`}
                              >
                                💰 Give Coins
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowPetDialog(true);
                                }}
                                data-testid={`button-give-pet-${user.id}`}
                              >
                                🐾 Give Pet
                              </Button>
                              
                              {/* Show All Actions toggle button */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleUserActions(user.id)}
                                data-testid={`button-toggle-actions-${user.id}`}
                              >
                                {expandedUserActions.has(user.id) ? "← Less" : "More →"}
                              </Button>
                              
                              {/* Additional actions - show when expanded */}
                              {expandedUserActions.has(user.id) && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setUserAction("remove-coins");
                                      setShowUserActionDialog(true);
                                    }}
                                    data-testid={`button-remove-coins-${user.id}`}
                                  >
                                    💸 Remove Coins
                                  </Button>
                                  {user.adminRole !== 'owner' && (
                                    <>
                                      {user.adminRole && user.adminRole !== 'none' ? (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => removeAdminRoleMutation.mutate(user.id)}
                                          data-testid={`button-remove-admin-${user.id}`}
                                        >
                                          🚫 Remove Admin
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setSelectedUser(user);
                                            setUserAction("give-admin");
                                            setShowUserActionDialog(true);
                                          }}
                                          data-testid={`button-give-admin-${user.id}`}
                                        >
                                          🛡️ Give Admin
                                        </Button>
                                      )}
                                    </>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setUserAction("temp-ban");
                                      setShowUserActionDialog(true);
                                    }}
                                    data-testid={`button-temp-ban-${user.id}`}
                                  >
                                    ⏱️ Temp Ban
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setUserAction("ban");
                                      setShowUserActionDialog(true);
                                    }}
                                    data-testid={`button-ban-${user.id}`}
                                  >
                                    🔨 Ban
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ban User Modal */}
              {selectedUser && (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      Ban User: {selectedUser.username}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="ban-reason">Ban Reason</Label>
                      <Input
                        id="ban-reason"
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        placeholder="Enter reason for ban"
                        data-testid="input-ban-reason"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="destructive"
                        onClick={() => banUserMutation.mutate({ 
                          userId: selectedUser.id, 
                          reason: banReason 
                        })}
                        disabled={!banReason.trim() || banUserMutation.isPending}
                        data-testid="button-confirm-ban"
                      >
                        {banUserMutation.isPending ? "Banning..." : "Confirm Ban"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(null);
                          setBanReason("");
                        }}
                        data-testid="button-cancel-ban"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-impact text-2xl text-secondary">📦 ITEM MANAGEMENT</CardTitle>
                  <CardDescription>
                    Create, edit, and manage shop items and inventory
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-4">
                    <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
                      <DialogTrigger asChild>
                        <Button onClick={() => {
                          setSelectedItem(null);
                          setNewItem({
                            name: "",
                            description: "",
                            price: "",
                            type: "tool",
                            rarity: "common",
                            stock: "",
                            effects: {
                              passive: { winRateBoost: 0, coinsPerHour: 0 },
                              active: { useCooldown: 0, duration: 0, effect: "" }
                            },
                            lootboxContents: [],
                            consumableEffect: { type: "", magnitude: 0, duration: 0 }
                          });
                        }} data-testid="button-create-item">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Item
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <Button
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/items"] })}
                      variant="outline"
                      size="sm"
                      disabled={isFetchingItems}
                      data-testid="button-refresh-items"
                    >
                      <RefreshCw className={`w-4 h-4 ${isFetchingItems ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary" data-testid="total-items">
                          {items.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Items</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-accent" data-testid="total-item-value">
                          {items.reduce((sum: number, item: any) => sum + (item.price * item.stock), 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Value</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-500" data-testid="available-items">
                          {items.filter((item: any) => item.stock > 0).length}
                        </div>
                        <div className="text-sm text-muted-foreground">In Stock</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-500" data-testid="out-of-stock-items">
                          {items.filter((item: any) => item.stock === 0).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Out of Stock</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item: any) => (
                      <Card key={item.id} className="relative" data-testid={`item-${item.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-foreground">{item.name}</h3>
                              <Badge variant={
                                item.rarity === 'legendary' ? 'default' :
                                item.rarity === 'epic' ? 'secondary' :
                                item.rarity === 'rare' ? 'outline' : 'secondary'
                              }>
                                {item.rarity.toUpperCase()}
                              </Badge>
                            </div>
                            <Badge variant={item.stock > 0 ? 'secondary' : 'destructive'}>
                              {item.stock === 2147483647 ? "∞" : item.stock}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between text-sm mb-3">
                            <span className="font-medium">💰 {item.currentPrice?.toLocaleString() || item.price?.toLocaleString()}</span>
                            <span className="text-muted-foreground">{item.type}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedItem(item);
                                setNewItem({
                                  name: item.name,
                                  description: item.description,
                                  price: item.currentPrice?.toString() || item.price?.toString(),
                                  type: item.type,
                                  rarity: item.rarity,
                                  stock: item.stock === 2147483647 ? "999999" : item.stock?.toString(),
                                  effects: item.effects || {
                                    passive: { winRateBoost: 0, coinsPerHour: 0 },
                                    active: { useCooldown: 0, duration: 0, effect: "" }
                                  },
                                  lootboxContents: item.effects?.lootboxContents || [],
                                  consumableEffect: item.effects?.consumableEffect || { type: "", magnitude: 0, duration: 0 }
                                });
                                setShowItemDialog(true);
                              }}
                              data-testid={`button-edit-item-${item.id}`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                  deleteItemMutation.mutate(item.id);
                                }
                              }}
                              data-testid={`button-delete-item-${item.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-impact text-2xl text-accent">💸 TRANSACTION MONITORING</CardTitle>
                  <CardDescription>
                    Monitor all user transactions and economic activity
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-4">
                    <Button
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] })}
                      variant="outline"
                      size="sm"
                      disabled={isFetchingTransactions}
                      data-testid="button-refresh-transactions"
                    >
                      <RefreshCw className={`w-4 h-4 ${isFetchingTransactions ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary" data-testid="total-transactions">
                          {transactions.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Transactions</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-500" data-testid="earn-transactions">
                          {transactions.filter((t: any) => t.amount > 0).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Earning Transactions</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-500" data-testid="spend-transactions">
                          {transactions.filter((t: any) => t.amount < 0).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Spending Transactions</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-accent" data-testid="total-volume">
                          {Math.abs(transactions.reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0)).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Volume</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {transactions.map((transaction: any) => (
                      <div 
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        data-testid={`transaction-${transaction.id}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            transaction.amount > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="font-bold text-foreground">
                              {transaction.user}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(transaction.timestamp).toLocaleString()} • {transaction.type}
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold text-lg ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-impact text-2xl text-primary">📊 SYSTEM ANALYTICS</CardTitle>
                  <CardDescription>
                    Advanced analytics and system monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">💾 System Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Memory Used:</span>
                            <Badge variant="outline">
                              {analytics?.system?.memoryUsage ? 
                                `${Math.round(analytics.system.memoryUsage.heapUsed / 1024 / 1024)}MB` : 
                                'N/A'
                              }
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Memory Total:</span>
                            <Badge variant="outline">
                              {analytics?.system?.memoryUsage ? 
                                `${Math.round(analytics.system.memoryUsage.heapTotal / 1024 / 1024)}MB` : 
                                'N/A'
                              }
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Uptime:</span>
                            <Badge variant="secondary">
                              {analytics?.system?.uptime ? 
                                `${Math.floor(analytics.system.uptime / 3600)}h ${Math.floor((analytics.system.uptime % 3600) / 60)}m` : 
                                'N/A'
                              }
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Updated:</span>
                            <Badge variant="outline">
                              {analytics?.system?.timestamp ? 
                                new Date(analytics.system.timestamp).toLocaleTimeString() : 
                                'N/A'
                              }
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">📈 Economic Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Total Economy Value:</span>
                            <Badge variant="secondary">
                              {analytics?.economy?.totalCoins?.toLocaleString() || 0}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Average User Wealth:</span>
                            <Badge variant="outline">
                              {analytics?.users?.total ? 
                                Math.round((analytics.economy?.totalCoins || 0) / analytics.users.total).toLocaleString() : 
                                0
                              }
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Items in Circulation:</span>
                            <Badge variant="secondary">
                              {analytics?.economy?.totalItems || 0}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Active vs Banned Ratio:</span>
                            <Badge variant={
                              (analytics?.users?.banned || 0) > (analytics?.users?.active || 0) * 0.1 ? 
                              'destructive' : 'secondary'
                            }>
                              {analytics?.users?.active || 0}:{analytics?.users?.banned || 0}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="economy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-impact text-2xl text-accent">💰 ECONOMY CONTROLS</CardTitle>
                  <CardDescription>
                    Manage the game economy and user finances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-accent" data-testid="total-coins">
                          💰 {users.reduce((sum: number, u: any) => sum + u.coins, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Coins in Circulation</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-secondary" data-testid="avg-level">
                          ⭐ {Math.round(users.reduce((sum: number, u: any) => sum + u.level, 0) / users.length || 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Average User Level</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary" data-testid="richest-user">
                          👑 {Math.max(...users.map((u: any) => u.coins)).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Richest User</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-muted-foreground" data-testid="avg-coins">
                          📊 {Math.round(users.reduce((sum: number, u: any) => sum + u.coins, 0) / users.length || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Average Coins</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pets" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-green-400">Pet Management</h2>
                  <p className="text-muted-foreground">Manage pet distribution and availability</p>
                </div>
                <Dialog open={showCreatePetDialog} onOpenChange={setShowCreatePetDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setNewPet({
                        name: "",
                        emoji: "",
                        rarity: "common",
                        adoptionCost: "",
                        hungerDecay: "",
                        hygieneDecay: "",
                        energyDecay: "",
                        funDecay: ""
                      });
                    }} data-testid="button-create-pet">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Pet
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AVAILABLE_PETS.map((pet) => (
                  <Card key={pet.id} className="p-4 border-green-700 bg-green-900/20" data-testid={`pet-card-${pet.id}`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{pet.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-300">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{pet.rarity}</p>
                        <p className="text-sm text-green-400">{pet.adoptionCost.toLocaleString()} coins</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>Hunger decay: {pet.hungerDecay}h</p>
                      <p>Hygiene decay: {pet.hygieneDecay}h</p>
                      <p>Energy decay: {pet.energyDecay}h</p>
                      <p>Fun decay: {pet.funDecay}h</p>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 border border-green-700 rounded-lg bg-green-900/10">
                <h3 className="text-lg font-semibold text-green-300 mb-2">Quick Actions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use the "Give Pet" button in the Users tab to grant pets to specific users.
                  All pets shown above are available for distribution.
                </p>
                <div className="text-sm text-green-400">
                  Total available pets: {AVAILABLE_PETS.length}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-impact text-2xl text-destructive">⚙️ SYSTEM CONTROLS</CardTitle>
                  <CardDescription>
                    Execute administrative commands and system maintenance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleExecuteCommand} className="space-y-4">
                    <div>
                      <Label htmlFor="command">Custom Command</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="command"
                          value={command}
                          onChange={(e) => setCommand(e.target.value)}
                          placeholder="e.g., giveAll 100"
                          className="flex-1"
                          data-testid="input-command"
                        />
                        <Button
                          type="submit"
                          disabled={!command.trim() || executeCommandMutation.isPending}
                          className="font-comic bg-destructive hover:bg-destructive/80"
                          data-testid="button-execute-command"
                        >
                          <Command className="w-4 h-4 mr-2" />
                          {executeCommandMutation.isPending ? "Executing..." : "EXECUTE"}
                        </Button>
                      </div>
                    </div>
                  </form>

                  <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Available Commands:</h4>
                    <ul className="space-y-1">
                      <li><code className="bg-background px-2 py-1 rounded">giveAll [amount]</code> - Give coins to all active users</li>
                      <li><code className="bg-background px-2 py-1 rounded">resetEconomy</code> - Reset all user balances (dangerous!)</li>
                      <li><code className="bg-background px-2 py-1 rounded">clearTransactions</code> - Clear all transaction history</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* User Action Dialog */}
        <Dialog open={showUserActionDialog} onOpenChange={setShowUserActionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {userAction === "ban" && "🔨 Ban User"}
                {userAction === "temp-ban" && "⏱️ Temporary Ban User"}
                {userAction === "give-coins" && "💰 Give Coins"}
                {userAction === "remove-coins" && "💸 Remove Coins"}
              </DialogTitle>
              <DialogDescription>
                {selectedUser && (
                  <>
                    {userAction === "ban" && `Permanently ban ${selectedUser.username} from the platform.`}
                    {userAction === "temp-ban" && `Temporarily ban ${selectedUser.username} for a specified duration.`}
                    {userAction === "give-coins" && `Give coins to ${selectedUser.username}.`}
                    {userAction === "remove-coins" && `Remove coins from ${selectedUser.username}.`}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {userAction === "ban" && (
                <div>
                  <Label htmlFor="ban-reason">Ban Reason</Label>
                  <Textarea
                    id="ban-reason"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Enter reason for ban"
                    data-testid="textarea-ban-reason"
                  />
                </div>
              )}
              
              {userAction === "temp-ban" && (
                <>
                  <div>
                    <Label htmlFor="temp-ban-reason">Ban Reason</Label>
                    <Textarea
                      id="temp-ban-reason"
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Enter reason for temporary ban"
                      data-testid="textarea-temp-ban-reason"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temp-ban-duration">Duration (hours)</Label>
                    <Input
                      id="temp-ban-duration"
                      type="number"
                      value={tempBanDuration}
                      onChange={(e) => setTempBanDuration(e.target.value)}
                      placeholder="Enter duration in hours"
                      min="1"
                      max="8760"
                      data-testid="input-temp-ban-duration"
                    />
                  </div>
                </>
              )}
              
              {userAction === "give-coins" && (
                <div>
                  <Label htmlFor="coin-amount">Amount</Label>
                  <Input
                    id="coin-amount"
                    type="number"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(e.target.value)}
                    placeholder="Enter amount of coins to give"
                    min="1"
                    data-testid="input-coin-amount"
                  />
                </div>
              )}
              
              {userAction === "remove-coins" && (
                <div>
                  <Label htmlFor="remove-coin-amount">Amount</Label>
                  <Input
                    id="remove-coin-amount"
                    type="number"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(e.target.value)}
                    placeholder="Enter amount of coins to remove"
                    min="1"
                    data-testid="input-remove-coin-amount"
                  />
                  {selectedUser && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Current balance: {selectedUser.coins.toLocaleString()} coins
                    </p>
                  )}
                </div>
              )}
              
              {userAction === "give-admin" && (
                <div>
                  <Label htmlFor="admin-role">Admin Role</Label>
                  <Select value={selectedAdminRole} onValueChange={setSelectedAdminRole}>
                    <SelectTrigger data-testid="select-admin-role">
                      <SelectValue placeholder="Select admin role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior_admin">🟢 Junior Admin</SelectItem>
                      <SelectItem value="admin">🔵 Admin</SelectItem>
                      <SelectItem value="senior_admin">🟠 Senior Admin</SelectItem>
                      <SelectItem value="lead_admin">🔴 Lead Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Permission Levels:</strong><br />
                    🟢 <strong>Junior Admin:</strong> Basic user management, view analytics<br />
                    🔵 <strong>Admin:</strong> Full user management, item management<br />
                    🟠 <strong>Senior Admin:</strong> Advanced controls, system commands<br />
                    🔴 <strong>Lead Admin:</strong> All permissions except owner functions
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    if (userAction === "ban" && selectedUser) {
                      banUserMutation.mutate({ userId: selectedUser.id, reason: banReason });
                    } else if (userAction === "temp-ban" && selectedUser) {
                      tempBanUserMutation.mutate({ 
                        userId: selectedUser.id, 
                        reason: banReason, 
                        duration: tempBanDuration 
                      });
                    } else if (userAction === "give-coins" && selectedUser) {
                      giveCoinsUserMutation.mutate({ 
                        userId: selectedUser.id, 
                        amount: coinAmount 
                      });
                    } else if (userAction === "remove-coins" && selectedUser) {
                      removeCoinsUserMutation.mutate({ 
                        userId: selectedUser.id, 
                        amount: coinAmount 
                      });
                    } else if (userAction === "give-admin" && selectedUser) {
                      giveAdminRoleMutation.mutate({ 
                        userId: selectedUser.id, 
                        adminRole: selectedAdminRole 
                      });
                    }
                  }}
                  disabled={
                    (userAction === "ban" && !banReason.trim()) ||
                    (userAction === "temp-ban" && (!banReason.trim() || !tempBanDuration)) ||
                    (userAction === "give-coins" && (!coinAmount || parseInt(coinAmount) <= 0)) ||
                    (userAction === "remove-coins" && (!coinAmount || parseInt(coinAmount) <= 0)) ||
                    (userAction === "give-admin" && !selectedAdminRole)
                  }
                  data-testid="button-confirm-action"
                >
                  {userAction === "ban" && "Confirm Ban"}
                  {userAction === "temp-ban" && "Confirm Temporary Ban"}
                  {userAction === "give-coins" && "Give Coins"}
                  {userAction === "remove-coins" && "Remove Coins"}
                  {userAction === "give-admin" && "Grant Admin Role"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUserActionDialog(false);
                    setSelectedUser(null);
                    setBanReason("");
                    setTempBanDuration("");
                    setCoinAmount("");
                    setSelectedAdminRole("");
                    setUserAction("");
                  }}
                  data-testid="button-cancel-action"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Item Creation/Edit Dialog */}
        <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedItem ? "✏️ Edit Item" : "📦 Create New Item"}
              </DialogTitle>
              <DialogDescription>
                {selectedItem ? "Update the item details below." : "Fill in the details to create a new item."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name"
                  data-testid="input-item-name"
                />
              </div>
              <div>
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Item description"
                  data-testid="textarea-item-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-price">Price</Label>
                  <Input
                    id="item-price"
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="0"
                    min="0"
                    data-testid="input-item-price"
                  />
                </div>
                <div>
                  <Label htmlFor="item-stock">Stock</Label>
                  <Input
                    id="item-stock"
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                    placeholder="0"
                    min="0"
                    data-testid="input-item-stock"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-type">Type</Label>
                  <Select value={newItem.type} onValueChange={(value) => setNewItem({ ...newItem, type: value })}>
                    <SelectTrigger data-testid="select-item-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tool">Tool</SelectItem>
                      <SelectItem value="collectible">Collectible</SelectItem>
                      <SelectItem value="powerup">Powerup</SelectItem>
                      <SelectItem value="consumable">Consumable</SelectItem>
                      <SelectItem value="lootbox">Lootbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="item-rarity">Rarity</Label>
                  <Select value={newItem.rarity} onValueChange={(value) => setNewItem({ ...newItem, rarity: value })}>
                    <SelectTrigger data-testid="select-item-rarity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Type-specific fields */}
              {newItem.type === 'lootbox' && (
                <div className="space-y-3 p-3 border rounded-md bg-muted/50">
                  <Label className="text-sm font-semibold">Lootbox Configuration</Label>
                  <p className="text-xs text-muted-foreground">Configure items and drop chances (stored in effects.lootboxContents)</p>
                  <Textarea
                    placeholder='e.g., [{"itemName": "Gold Coin", "rarity": "common", "chance": 50}, {"itemName": "Diamond", "rarity": "rare", "chance": 10}]'
                    value={JSON.stringify(newItem.lootboxContents, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setNewItem({ ...newItem, lootboxContents: parsed });
                      } catch {}
                    }}
                    rows={4}
                    data-testid="textarea-lootbox-contents"
                  />
                </div>
              )}

              {newItem.type === 'consumable' && (
                <div className="space-y-3 p-3 border rounded-md bg-muted/50">
                  <Label className="text-sm font-semibold">Consumable Effects</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="consumable-type" className="text-xs">Effect Type</Label>
                      <Input
                        id="consumable-type"
                        value={newItem.consumableEffect.type}
                        onChange={(e) => setNewItem({ ...newItem, consumableEffect: { ...newItem.consumableEffect, type: e.target.value }})}
                        placeholder="e.g., heal, boost"
                        data-testid="input-consumable-type"
                      />
                    </div>
                    <div>
                      <Label htmlFor="consumable-magnitude" className="text-xs">Magnitude</Label>
                      <Input
                        id="consumable-magnitude"
                        type="number"
                        value={newItem.consumableEffect.magnitude}
                        onChange={(e) => setNewItem({ ...newItem, consumableEffect: { ...newItem.consumableEffect, magnitude: parseInt(e.target.value) || 0 }})}
                        placeholder="e.g., 50"
                        data-testid="input-consumable-magnitude"
                      />
                    </div>
                    <div>
                      <Label htmlFor="consumable-duration" className="text-xs">Duration (sec)</Label>
                      <Input
                        id="consumable-duration"
                        type="number"
                        value={newItem.consumableEffect.duration}
                        onChange={(e) => setNewItem({ ...newItem, consumableEffect: { ...newItem.consumableEffect, duration: parseInt(e.target.value) || 0 }})}
                        placeholder="e.g., 3600"
                        data-testid="input-consumable-duration"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(newItem.type === 'tool' || newItem.type === 'powerup') && (
                <div className="space-y-3 p-3 border rounded-md bg-muted/50">
                  <Label className="text-sm font-semibold">Item Effects</Label>
                  <div className="space-y-2">
                    <Label className="text-xs">Passive Effects</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="win-rate-boost" className="text-xs">Win Rate Boost (%)</Label>
                        <Input
                          id="win-rate-boost"
                          type="number"
                          value={newItem.effects.passive.winRateBoost}
                          onChange={(e) => setNewItem({ ...newItem, effects: { ...newItem.effects, passive: { ...newItem.effects.passive, winRateBoost: parseInt(e.target.value) || 0 }}})}
                          placeholder="0"
                          data-testid="input-win-rate-boost"
                        />
                      </div>
                      <div>
                        <Label htmlFor="coins-per-hour" className="text-xs">Coins Per Hour</Label>
                        <Input
                          id="coins-per-hour"
                          type="number"
                          value={newItem.effects.passive.coinsPerHour}
                          onChange={(e) => setNewItem({ ...newItem, effects: { ...newItem.effects, passive: { ...newItem.effects.passive, coinsPerHour: parseInt(e.target.value) || 0 }}})}
                          placeholder="0"
                          data-testid="input-coins-per-hour"
                        />
                      </div>
                    </div>
                    <Label className="text-xs mt-2">Active Effects</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="effect-text" className="text-xs">Effect</Label>
                        <Input
                          id="effect-text"
                          value={newItem.effects.active.effect}
                          onChange={(e) => setNewItem({ ...newItem, effects: { ...newItem.effects, active: { ...newItem.effects.active, effect: e.target.value }}})}
                          placeholder="e.g., double_coins"
                          data-testid="input-effect-text"
                        />
                      </div>
                      <div>
                        <Label htmlFor="effect-duration" className="text-xs">Duration (sec)</Label>
                        <Input
                          id="effect-duration"
                          type="number"
                          value={newItem.effects.active.duration}
                          onChange={(e) => setNewItem({ ...newItem, effects: { ...newItem.effects, active: { ...newItem.effects.active, duration: parseInt(e.target.value) || 0 }}})}
                          placeholder="0"
                          data-testid="input-effect-duration"
                        />
                      </div>
                      <div>
                        <Label htmlFor="use-cooldown" className="text-xs">Cooldown (sec)</Label>
                        <Input
                          id="use-cooldown"
                          type="number"
                          value={newItem.effects.active.useCooldown}
                          onChange={(e) => setNewItem({ ...newItem, effects: { ...newItem.effects, active: { ...newItem.effects.active, useCooldown: parseInt(e.target.value) || 0 }}})}
                          placeholder="0"
                          data-testid="input-use-cooldown"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    if (selectedItem) {
                      updateItemMutation.mutate({ id: selectedItem.id, itemData: newItem });
                    } else {
                      createItemMutation.mutate(newItem);
                    }
                  }}
                  disabled={
                    !newItem.name.trim() || 
                    !newItem.description.trim() || 
                    !newItem.price || 
                    !newItem.stock ||
                    parseInt(newItem.price) <= 0 ||
                    parseInt(newItem.stock) < 0
                  }
                  data-testid="button-save-item"
                >
                  {selectedItem ? "Update Item" : "Create Item"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowItemDialog(false);
                    setSelectedItem(null);
                    setNewItem({
                      name: "",
                      description: "",
                      price: "",
                      type: "tool",
                      rarity: "common",
                      stock: "",
                      effects: {
                        passive: { winRateBoost: 0, coinsPerHour: 0 },
                        active: { useCooldown: 0, duration: 0, effect: "" }
                      },
                      lootboxContents: [],
                      consumableEffect: { type: "", magnitude: 0, duration: 0 }
                    });
                  }}
                  data-testid="button-cancel-item"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pet Dialog */}
        <Dialog open={showPetDialog} onOpenChange={setShowPetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Give Pet to User</DialogTitle>
              <DialogDescription>
                Give {selectedUser?.username} a new pet companion.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pet-select">Select Pet</Label>
                <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                  <SelectTrigger data-testid="select-pet">
                    <SelectValue placeholder="Choose a pet..." />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_PETS.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.emoji} {pet.name} ({pet.rarity}) - {pet.adoptionCost.toLocaleString()} coins
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pet-name">Pet Name (Optional)</Label>
                <Input
                  id="pet-name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Custom name for the pet..."
                  maxLength={50}
                  data-testid="input-pet-name"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    if (selectedUser && selectedPetId) {
                      givePetMutation.mutate({
                        userId: selectedUser.id,
                        petId: selectedPetId,
                        petName: petName || AVAILABLE_PETS.find(p => p.id === selectedPetId)?.name || ""
                      });
                    }
                  }}
                  disabled={!selectedPetId || givePetMutation.isPending}
                  data-testid="button-give-pet"
                >
                  {givePetMutation.isPending ? "Giving..." : "Give Pet"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPetDialog(false);
                    setSelectedPetId("");
                    setPetName("");
                  }}
                  data-testid="button-cancel-pet"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Pet Dialog */}
        <Dialog open={showCreatePetDialog} onOpenChange={setShowCreatePetDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Pet</DialogTitle>
              <DialogDescription>
                Design a new pet type for the adoption center.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pet-name">Pet Name</Label>
                  <Input
                    id="pet-name"
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    placeholder="e.g., Dragon"
                    data-testid="input-pet-name"
                  />
                </div>
                <div>
                  <Label htmlFor="pet-emoji">Emoji</Label>
                  <Input
                    id="pet-emoji"
                    value={newPet.emoji}
                    onChange={(e) => setNewPet({ ...newPet, emoji: e.target.value })}
                    placeholder="🐉"
                    maxLength={10}
                    data-testid="input-pet-emoji"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pet-rarity">Rarity</Label>
                  <Select value={newPet.rarity} onValueChange={(value) => setNewPet({ ...newPet, rarity: value })}>
                    <SelectTrigger data-testid="select-pet-rarity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                      <SelectItem value="mythic">Mythic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pet-adoption-cost">Adoption Cost</Label>
                  <Input
                    id="pet-adoption-cost"
                    type="number"
                    value={newPet.adoptionCost}
                    onChange={(e) => setNewPet({ ...newPet, adoptionCost: e.target.value })}
                    placeholder="1000"
                    min="0"
                    data-testid="input-pet-adoption-cost"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Decay Rates (per hour)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pet-hunger-decay" className="text-sm">Hunger Decay</Label>
                    <Input
                      id="pet-hunger-decay"
                      type="number"
                      value={newPet.hungerDecay}
                      onChange={(e) => setNewPet({ ...newPet, hungerDecay: e.target.value })}
                      placeholder="12"
                      min="0"
                      max="100"
                      data-testid="input-pet-hunger-decay"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pet-hygiene-decay" className="text-sm">Hygiene Decay</Label>
                    <Input
                      id="pet-hygiene-decay"
                      type="number"
                      value={newPet.hygieneDecay}
                      onChange={(e) => setNewPet({ ...newPet, hygieneDecay: e.target.value })}
                      placeholder="18"
                      min="0"
                      max="100"
                      data-testid="input-pet-hygiene-decay"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pet-energy-decay" className="text-sm">Energy Decay</Label>
                    <Input
                      id="pet-energy-decay"
                      type="number"
                      value={newPet.energyDecay}
                      onChange={(e) => setNewPet({ ...newPet, energyDecay: e.target.value })}
                      placeholder="24"
                      min="0"
                      max="100"
                      data-testid="input-pet-energy-decay"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pet-fun-decay" className="text-sm">Fun Decay</Label>
                    <Input
                      id="pet-fun-decay"
                      type="number"
                      value={newPet.funDecay}
                      onChange={(e) => setNewPet({ ...newPet, funDecay: e.target.value })}
                      placeholder="12"
                      min="0"
                      max="100"
                      data-testid="input-pet-fun-decay"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => createPetMutation.mutate(newPet)}
                  disabled={
                    !newPet.name.trim() ||
                    !newPet.emoji.trim() ||
                    !newPet.adoptionCost ||
                    !newPet.hungerDecay ||
                    !newPet.hygieneDecay ||
                    !newPet.energyDecay ||
                    !newPet.funDecay ||
                    parseInt(newPet.adoptionCost) < 0 ||
                    parseInt(newPet.hungerDecay) < 0 ||
                    parseInt(newPet.hygieneDecay) < 0 ||
                    parseInt(newPet.energyDecay) < 0 ||
                    parseInt(newPet.funDecay) < 0 ||
                    createPetMutation.isPending
                  }
                  data-testid="button-save-pet"
                >
                  {createPetMutation.isPending ? "Creating..." : "Create Pet"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreatePetDialog(false);
                    setNewPet({
                      name: "",
                      emoji: "",
                      rarity: "common",
                      adoptionCost: "",
                      hungerDecay: "",
                      hygieneDecay: "",
                      energyDecay: "",
                      funDecay: ""
                    });
                  }}
                  data-testid="button-cancel-pet"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
