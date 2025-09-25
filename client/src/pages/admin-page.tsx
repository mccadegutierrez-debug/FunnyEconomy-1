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
import { AlertTriangle, Users, DollarSign, Settings, Command, Package, Activity, BarChart3, Search, Plus, Edit2, Trash2, Eye, RefreshCw, Clock, TrendingUp, Database, Server } from "lucide-react";

export default function AdminPage() {
  const [command, setCommand] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banReason, setBanReason] = useState("");
  const [tempBanDuration, setTempBanDuration] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    type: "tool",
    rarity: "common",
    stock: ""
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showUserActionDialog, setShowUserActionDialog] = useState(false);
  const [userAction, setUserAction] = useState<string>("");
  const [selectedAdminRole, setSelectedAdminRole] = useState("");
  const { toast } = useToast();

  // Initialize with stored admin key on component mount
  const storedKey = localStorage.getItem('adminKey');
  
  // Initialize authentication state if there's a stored key
  useEffect(() => {
    if (storedKey && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [storedKey, isAuthenticated]);
  
  // Check if user has admin access by trying to fetch users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("GET", "/api/admin/users", {
        headers: { 'admin-key': keyToUse }
      });
      return res.json();
    },
    enabled: isAuthenticated || (!!storedKey && !isAuthenticating),
    retry: false,
  });

  // Fetch items for item management
  const { data: items = [] } = useQuery({
    queryKey: ["/api/admin/items"],
    queryFn: async () => {
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("GET", "/api/admin/items", {
        headers: { 'admin-key': keyToUse }
      });
      return res.json();
    },
    enabled: isAuthenticated || !!storedKey,
  });

  // Fetch transactions for monitoring
  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/admin/transactions"],
    queryFn: async () => {
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("GET", "/api/admin/transactions", {
        headers: { 'admin-key': keyToUse }
      });
      return res.json();
    },
    enabled: isAuthenticated || !!storedKey,
  });

  // Fetch analytics data
  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("GET", "/api/admin/analytics", {
        headers: { 'admin-key': keyToUse }
      });
      return res.json();
    },
    enabled: isAuthenticated || !!storedKey,
  });

  const executeCommandMutation = useMutation({
    mutationFn: async (cmd: string) => {
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("POST", "/api/admin/command", {
        body: { command: cmd, adminKey: keyToUse },
        headers: { 'admin-key': keyToUse }
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
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("POST", `/api/admin/users/${userId}/ban`, {
        body: { reason },
        headers: { 'admin-key': keyToUse }
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
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("POST", `/api/admin/users/${userId}/unban`, {
        headers: { 'admin-key': keyToUse }
      });
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
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("POST", `/api/admin/users/${userId}/tempban`, {
        body: { reason, duration: parseInt(duration) || 1 },
        headers: { 'admin-key': keyToUse }
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
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("POST", `/api/admin/users/${userId}/give-coins`, {
        body: { amount: parseInt(amount) || 0 },
        headers: { 'admin-key': keyToUse }
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
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("POST", `/api/admin/users/${userId}/remove-coins`, {
        body: { amount: parseInt(amount) || 0 },
        headers: { 'admin-key': keyToUse }
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

  const createItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("POST", "/api/admin/items", {
        body: {
          name: itemData.name,
          description: itemData.description,
          price: parseFloat(itemData.price) || 0,
          stock: itemData.stock === "999999" ? 2147483647 : parseInt(itemData.stock) || 0,
          type: itemData.type,
          rarity: itemData.rarity,
          currentPrice: parseFloat(itemData.price) || 0,
          effects: {
            passive: { winRateBoost: 0, coinsPerHour: 0 },
            active: { useCooldown: 0, duration: 0, effect: "" }
          }
        },
        headers: { 'admin-key': keyToUse }
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
        stock: ""
      });
      setShowItemDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/items"] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, itemData }: { id: string; itemData: any }) => {
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("PUT", `/api/admin/items/${id}`, {
        body: {
          name: itemData.name,
          description: itemData.description,
          price: parseFloat(itemData.price) || undefined,
          stock: itemData.stock === "999999" ? 2147483647 : parseInt(itemData.stock) || undefined,
          type: itemData.type,
          rarity: itemData.rarity,
          currentPrice: parseFloat(itemData.price) || undefined
        },
        headers: { 'admin-key': keyToUse }
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
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("DELETE", `/api/admin/items/${id}`, {
        headers: { 'admin-key': keyToUse }
      });
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
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("POST", `/api/admin/users/${userId}/give-admin`, {
        body: { adminRole },
        headers: { 'admin-key': keyToUse }
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
      const keyToUse = storedKey || adminKey;
      const res = await apiRequest("POST", `/api/admin/users/${userId}/remove-admin`, {
        headers: { 'admin-key': keyToUse }
      });
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
        // Test the admin key by trying to fetch users
        const res = await apiRequest("GET", "/api/admin/users", {
          headers: { 'admin-key': adminKey }
        });
        
        if (res.ok) {
          localStorage.setItem('adminKey', adminKey);
          setIsAuthenticated(true);
          toast({
            title: "Access Granted! 🔓",
            description: "Welcome to the admin panel",
          });
        } else {
          toast({
            title: "Access Denied ❌",
            description: "Invalid admin key",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Access Denied ❌",
          description: "Invalid admin key",
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

  // Show admin key input if not authenticated and no stored key
  if (!isAuthenticated && !storedKey) {
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
                  localStorage.removeItem('adminKey');
                  setAdminKey("");
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" data-testid="tab-overview">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="items" data-testid="tab-items">
                <Package className="w-4 h-4 mr-2" />
                Items
              </TabsTrigger>
              <TabsTrigger value="transactions" data-testid="tab-transactions">
                <Activity className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="system" data-testid="tab-system">
                <Settings className="w-4 h-4 mr-2" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-impact text-2xl text-primary">👥 USER MANAGEMENT</CardTitle>
                  <CardDescription>
                    Manage user accounts, bans, permissions, and coins
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-4">
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
                    <Button
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] })}
                      variant="outline"
                      size="sm"
                      data-testid="button-refresh-users"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary" data-testid="total-users">
                          {users.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Users</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-500" data-testid="active-users">
                          {users.filter((u: any) => !u.banned).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Users</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-destructive" data-testid="banned-users">
                          {users.filter((u: any) => u.banned).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Banned Users</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-500" data-testid="temp-banned-users">
                          {users.filter((u: any) => u.tempBanUntil && new Date(u.tempBanUntil) > new Date()).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Temp Banned</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {users
                      .filter((user: any) => 
                        userSearchTerm === "" || 
                        user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
                      )
                      .map((user: any) => (
                      <div 
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
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
                        </div>
                      </div>
                    ))}
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
                            stock: ""
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
                      data-testid="button-refresh-items"
                    >
                      <RefreshCw className="w-4 h-4" />
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
                                  stock: item.stock === 2147483647 ? "999999" : item.stock?.toString()
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
                      data-testid="button-refresh-transactions"
                    >
                      <RefreshCw className="w-4 h-4" />
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
                      stock: ""
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
      </main>

      <Footer />
    </div>
  );
}
