import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import {
  User,
  Coins,
  Trophy,
  Calendar,
  Clock,
  TrendingUp,
  Shield,
  Edit2,
  Eye,
  Users,
  Package,
  Activity,
  Star,
  Medal,
  Crown,
  Gamepad2,
} from "lucide-react";
import { UsernameLink } from "@/components/ui/username-link";

const profileUpdateSchema = z.object({
  bio: z.string().max(200, "Bio must be 200 characters or less").optional(),
  avatarUrl: z.string().refine(
    (val) => !val || val === "" || val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image/"),
    "Must be a valid URL or uploaded image"
  ).optional().or(z.literal("")),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user/profile");
      return res.json();
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/user/transactions"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user/transactions?limit=5");
      return res.json();
    },
  });

  const { data: achievementDefinitions = [] } = useQuery({
    queryKey: ["/api/achievements"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/achievements");
      return res.json();
    },
  });

  const { data: friends = [] } = useQuery({
    queryKey: ["/api/friends"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/friends");
      return res.json();
    },
  });

  const { data: friendRequests = [] } = useQuery({
    queryKey: ["/api/friends/requests"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/friends/requests");
      return res.json();
    },
  });

  const profileForm = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      bio: userProfile?.bio || user?.bio || "",
      avatarUrl: userProfile?.avatarUrl || user?.avatarUrl || "",
    },
  });

  // Reset form when profile data loads
  React.useEffect(() => {
    if (userProfile) {
      profileForm.reset({
        bio: userProfile.bio || "",
        avatarUrl: userProfile.avatarUrl || "",
      });
    }
  }, [userProfile, profileForm]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileUpdateSchema>) => {
      const res = await apiRequest("PUT", "/api/user/profile", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated! ✨",
        description: "Your profile information has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const acceptFriendMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await apiRequest("POST", `/api/friends/requests/${requestId}/accept`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Friend Added! 👋",
        description: "Friend request accepted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectFriendMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await apiRequest("POST", `/api/friends/requests/${requestId}/reject`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Rejected",
        description: "Friend request has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      const res = await apiRequest("DELETE", `/api/friends/${friendId}`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Friend Removed",
        description: "Friend has been removed from your list.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const profile = userProfile || user;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }
  const safeLevel = Math.max(profile.level || 1, 1);
  const levelProgress = Math.min(
    100,
    Math.max(0, ((profile.xp % (safeLevel * 1000)) / (safeLevel * 1000)) * 100),
  );
  const nextLevelXP = safeLevel * 1000;
  const totalWealth = profile.coins + profile.bank;

  // Parse achievements and game stats
  const achievements = Array.isArray(profile.achievements)
    ? profile.achievements
    : [];
  const gameStats = profile.gameStats || {};

  // Calculate profile completion
  const profileFields = [
    profile.bio,
    profile.avatarUrl,
    achievements.length > 0,
    profile.friends?.length > 0,
    profile.inventory?.length > 0,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const profileCompletion = (completedFields / profileFields.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Profile Header */}
        <Card
          className="glow-primary border-primary/20"
          data-testid="profile-header"
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {profile.onlineStatus && (
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1
                    className="font-impact text-3xl text-primary"
                    data-testid="profile-username"
                  >
                    {profile.username}
                  </h1>
                  {/* Owner Badge - Check for 'owners' achievement */}
                  {achievements.includes("owners") && (
                    <Badge
                      variant="default"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Owner
                    </Badge>
                  )}
                  {/* Admin Role Badges */}
                  {profile.adminRole && profile.adminRole !== "none" && (
                    <Badge
                      variant="outline"
                      className="bg-red-500/20 text-red-600 border-red-500/50"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {profile.adminRole === "junior_admin" && "Junior Admin"}
                      {profile.adminRole === "admin" && "Admin"}
                      {profile.adminRole === "senior_admin" && "Senior Admin"}
                      {profile.adminRole === "lead_admin" && "Lead Admin"}
                      {profile.adminRole === "owner" && "Owner Admin"}
                    </Badge>
                  )}
                  <Badge variant="secondary" data-testid="profile-level">
                    Level {profile.level}
                  </Badge>
                </div>

                <p className="text-muted-foreground" data-testid="profile-bio">
                  {profile.bio ||
                    "No bio set yet. Add one to tell others about yourself!"}
                </p>

                {/* Level Progress */}
                <div className="space-y-2" data-testid="level-progress">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground font-semibold">
                      Level Progress
                    </span>
                    <span className="text-muted-foreground">
                      {profile.xp} / {nextLevelXP} XP
                    </span>
                  </div>
                  <Progress value={levelProgress} className="h-3" />
                </div>

                {/* Profile Completion */}
                <div className="space-y-2" data-testid="profile-completion">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground font-semibold">
                      Profile Completion
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(profileCompletion)}%
                    </span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="text-sm text-muted-foreground">
                  Member since{" "}
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "Unknown"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last active{" "}
                  {profile.lastActive
                    ? new Date(profile.lastActive).toLocaleDateString()
                    : "Unknown"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Column */}
          <div className="space-y-6">
            {/* Economy Stats */}
            <Card data-testid="economy-stats">
              <CardHeader>
                <CardTitle className="font-impact text-xl text-accent flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Economy Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Wallet</span>
                  <span
                    className="font-bold text-foreground"
                    data-testid="wallet-amount"
                  >
                    {profile.coins.toLocaleString()} coins
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Bank</span>
                  <span
                    className="font-bold text-foreground"
                    data-testid="bank-amount"
                  >
                    {profile.bank.toLocaleString()} /{" "}
                    {profile.bankCapacity.toLocaleString()} coins
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">
                    Total Wealth
                  </span>
                  <span
                    className="font-bold text-primary text-lg"
                    data-testid="total-wealth"
                  >
                    {totalWealth.toLocaleString()} coins
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Daily Earnings</span>
                  <span
                    className="font-bold text-accent"
                    data-testid="daily-earnings"
                  >
                    {profile.dailyEarn?.toLocaleString() || 0} coins
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Game Stats */}
            <Card data-testid="game-stats">
              <CardHeader>
                <CardTitle className="font-impact text-xl text-accent flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Game Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.keys(gameStats).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Start playing games to see your stats here!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(gameStats).map(
                      ([game, stats]: [string, any]) => (
                        <div
                          key={game}
                          className="flex justify-between items-center"
                          data-testid={`game-stat-${game}`}
                        >
                          <span className="text-muted-foreground capitalize">
                            {game.replace("_", " ")}
                          </span>
                          <span className="font-bold text-foreground">
                            {typeof stats === "object" && stats !== null
                              ? `${stats.wins || 0}W / ${stats.losses || 0}L`
                              : stats || 0}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card data-testid="achievements">
              <CardHeader>
                <CardTitle className="font-impact text-xl text-accent flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  {achievements.length} achievements unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                {achievements.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No achievements yet. Keep playing to unlock some!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                    {achievements.map((achievementId: string, index: number) => {
                      const achievementDef = achievementDefinitions.find(
                        (def: any) => def.id === achievementId
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 bg-muted rounded-lg"
                          data-testid={`achievement-${index}`}
                        >
                          <Medal className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-foreground">
                              {achievementDef?.name || achievementId}
                            </div>
                            {achievementDef?.description && (
                              <div className="text-xs text-muted-foreground">
                                {achievementDef.description}
                              </div>
                            )}
                            {achievementDef?.coins > 0 && (
                              <div className="text-xs text-accent mt-1">
                                +{achievementDef.coins} coins
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card data-testid="profile-settings">
              <CardHeader>
                <CardTitle className="font-impact text-xl text-primary flex items-center gap-2">
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit((data) =>
                      updateProfileMutation.mutate(data),
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell others about yourself..."
                              className="min-h-[100px]"
                              {...field}
                              data-testid="input-bio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="avatarUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avatar URL</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                placeholder="https://example.com/avatar.jpg"
                                {...field}
                                data-testid="input-avatar-url"
                              />
                              <div className="text-sm text-muted-foreground">
                                Or upload an image:
                              </div>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                      toast({
                                        title: "File too large",
                                        description: "Please upload an image smaller than 2MB",
                                        variant: "destructive",
                                      });
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      field.onChange(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                data-testid="input-avatar-file"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="w-full"
                      data-testid="button-update-profile"
                    >
                      {updateProfileMutation.isPending
                        ? "Updating..."
                        : "Update Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card data-testid="recent-activity">
              <CardHeader>
                <CardTitle className="font-impact text-xl text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction: any, index: number) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        data-testid={`transaction-${index}`}
                      >
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            transaction.type === "earn"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {transaction.type === "earn" ? "+" : "-"}
                          {transaction.amount} coins
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inventory Preview */}
            <Card data-testid="inventory-preview">
              <CardHeader>
                <CardTitle className="font-impact text-xl text-accent flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Inventory
                </CardTitle>
                <CardDescription>
                  {profile.inventory?.length || 0} items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!profile.inventory || profile.inventory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Your inventory is empty
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {profile.inventory
                      .slice(0, 12)
                      .map((item: any, index: number) => (
                        <div
                          key={index}
                          className="aspect-square bg-muted rounded-lg p-2 flex flex-col items-center justify-center text-center"
                          data-testid={`inventory-item-${index}`}
                        >
                          <span className="text-lg">{item.emoji || "📦"}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {item.name}
                          </span>
                          {item.quantity > 1 && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {item.quantity}
                            </Badge>
                          )}
                        </div>
                      ))}
                    {profile.inventory.length > 12 && (
                      <div className="aspect-square bg-muted rounded-lg p-2 flex flex-col items-center justify-center text-center">
                        <span className="text-muted-foreground text-sm">
                          +{profile.inventory.length - 12} more
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <Card data-testid="friend-requests">
                <CardHeader>
                  <CardTitle className="font-impact text-xl text-accent flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Friend Requests
                  </CardTitle>
                  <CardDescription>
                    {friendRequests.length} pending request{friendRequests.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {friendRequests.map((request: any) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        data-testid={`friend-request-${request.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={request.fromUserAvatar} />
                            <AvatarFallback className="text-sm">
                              {request.fromUsername?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <UsernameLink username={request.fromUsername} className="text-sm font-medium" />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => acceptFriendMutation.mutate(request.id)}
                            disabled={acceptFriendMutation.isPending}
                            data-testid={`button-accept-${request.id}`}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectFriendMutation.mutate(request.id)}
                            disabled={rejectFriendMutation.isPending}
                            data-testid={`button-reject-${request.id}`}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Friends */}
            <Card data-testid="friends-list">
              <CardHeader>
                <CardTitle className="font-impact text-xl text-accent flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Friends
                </CardTitle>
                <CardDescription>
                  {friends.length} friend{friends.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {friends.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No friends yet. Add friends to see them here!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {friends.slice(0, 10).map((friend: any) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                        data-testid={`friend-${friend.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={friend.avatarUrl} />
                            <AvatarFallback className="text-sm">
                              {friend.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <UsernameLink username={friend.username} className="text-sm font-medium" />
                            <span className="text-xs text-muted-foreground">
                              Level {friend.level}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFriendMutation.mutate(friend.id)}
                          disabled={removeFriendMutation.isPending}
                          data-testid={`button-unfriend-${friend.id}`}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    {friends.length > 10 && (
                      <p className="text-muted-foreground text-center text-sm">
                        +{friends.length - 10} more friends
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
