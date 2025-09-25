import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from 'react';
import { 
  User, 
  Coins, 
  Trophy, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Eye,
  Package,
  Activity,
  Star,
  Medal,
  Crown,
  Gamepad2,
  ExternalLink,
  Shield
} from "lucide-react";
import { useRoute } from "wouter";

interface PublicProfile {
  id: string;
  username: string;
  level: number;
  xp: number;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  lastActive: string;
  achievements: any[];
  gameStats: any;
  onlineStatus: boolean;
  netWorth: number;
  publicInventory: Array<{ itemId: string }>;
  adminRole: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatLastActive(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Active now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString);
}

function getXPForNextLevel(level: number): number {
  return level * 1000;
}

function getCurrentLevelXP(xp: number, level: number): number {
  const previousLevelXP = (level - 1) * 1000;
  return xp - previousLevelXP;
}

function getAchievementBadgeColor(rarity: string) {
  switch (rarity) {
    case 'legendary': return 'bg-yellow-500 text-black';
    case 'epic': return 'bg-purple-500 text-white';
    case 'rare': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
}

export default function PublicProfilePage() {
  const [match, params] = useRoute('/profile/:username');
  const username = params?.username;

  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ["/api/user/profile", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const res = await fetch(`/api/user/profile/${username}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("User not found");
        }
        throw new Error("Failed to load profile");
      }
      return res.json() as Promise<PublicProfile>;
    },
    enabled: !!username,
  });

  // Get public item metadata for inventory display (no auth required)
  const { data: allItems = [] } = useQuery({
    queryKey: ["/api/public/items"],
    queryFn: async () => {
      const res = await fetch("/api/public/items");
      if (!res.ok) return [];
      return res.json();
    },
  });

  if (!match || !username) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Invalid Profile URL</h1>
              <p className="text-muted-foreground">Please provide a valid username.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading profile...</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : `User "${username}" does not exist.`}
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const xpForNextLevel = getXPForNextLevel(userProfile.level);
  const currentLevelXP = getCurrentLevelXP(userProfile.xp, userProfile.level);
  const xpProgress = (currentLevelXP / xpForNextLevel) * 100;

  const publicInventoryItems = userProfile.publicInventory
    .map(invItem => allItems.find((item: any) => item.id === invItem.itemId))
    .filter(Boolean)
    .slice(0, 12); // Show only first 12 items for preview

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card data-testid="card-public-profile">
              <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24" data-testid="avatar-public-profile">
                      <AvatarImage src={userProfile.avatarUrl} alt={userProfile.username} />
                      <AvatarFallback className="text-xl">
                        {userProfile.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {userProfile.onlineStatus && (
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-background" 
                           data-testid="status-online" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold" data-testid="text-username">
                        {userProfile.username}
                      </h1>
                      {/* Owner Badge - Check for 'owners' achievement */}
                      {userProfile.achievements?.includes('owners') && (
                        <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white" data-testid="badge-owner">
                          <Crown className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                      {/* Admin Role Badges */}
                      {userProfile.adminRole && userProfile.adminRole !== 'none' && (
                        <Badge variant="outline" className="bg-red-500/20 text-red-600 border-red-500/50" data-testid="badge-admin">
                          <Shield className="w-3 h-3 mr-1" />
                          {userProfile.adminRole === 'junior_admin' && 'Junior Admin'}
                          {userProfile.adminRole === 'admin' && 'Admin'}
                          {userProfile.adminRole === 'senior_admin' && 'Senior Admin'}
                          {userProfile.adminRole === 'lead_admin' && 'Lead Admin'}
                          {userProfile.adminRole === 'owner' && 'Owner Admin'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground flex items-center justify-center gap-1" data-testid="text-last-active">
                      <Clock className="h-4 w-4" />
                      {formatLastActive(userProfile.lastActive)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {userProfile.bio && (
                  <div className="text-center" data-testid="text-bio">
                    <p className="text-sm text-muted-foreground italic">"{userProfile.bio}"</p>
                  </div>
                )}
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary" data-testid="text-level">
                      {userProfile.level}
                    </p>
                    <p className="text-xs text-muted-foreground">Level</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-green-500" data-testid="text-net-worth">
                      {userProfile.netWorth.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Net Worth</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>XP Progress</span>
                    <span data-testid="text-xp-progress">{currentLevelXP.toLocaleString()} / {xpForNextLevel.toLocaleString()}</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" data-testid="progress-xp" />
                </div>
                
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1" data-testid="text-joined">
                    <Calendar className="h-3 w-3" />
                    Joined {formatDate(userProfile.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Game Stats */}
            {userProfile.gameStats && Object.keys(userProfile.gameStats).length > 0 && (
              <Card data-testid="card-game-stats">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5" />
                    Game Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(userProfile.gameStats).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-mono" data-testid={`stat-${key}`}>{value as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Achievements & Inventory */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <Card data-testid="card-achievements">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements
                  <Badge variant="secondary" data-testid="badge-achievement-count">
                    {userProfile.achievements?.length || 0}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Public achievements earned by this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userProfile.achievements && userProfile.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.achievements.map((achievement: Achievement, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border bg-card" data-testid={`achievement-${index}`}>
                        <div className="flex-shrink-0">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getAchievementBadgeColor(achievement.rarity)}`}>
                            {achievement.icon === 'star' && <Star className="h-5 w-5" />}
                            {achievement.icon === 'medal' && <Medal className="h-5 w-5" />}
                            {achievement.icon === 'trophy' && <Trophy className="h-5 w-5" />}
                            {achievement.icon === 'crown' && <Crown className="h-5 w-5" />}
                            {!['star', 'medal', 'trophy', 'crown'].includes(achievement.icon) && <Star className="h-5 w-5" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate" data-testid={`text-achievement-name-${index}`}>
                              {achievement.name}
                            </p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getAchievementBadgeColor(achievement.rarity)}`}
                              data-testid={`badge-achievement-rarity-${index}`}
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate" data-testid={`text-achievement-desc-${index}`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground" data-testid="text-no-achievements">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No achievements yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Public Inventory Preview */}
            <Card data-testid="card-inventory">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Item Collection Preview
                  <Badge variant="secondary" data-testid="badge-inventory-count">
                    {userProfile.publicInventory?.length || 0} items
                  </Badge>
                </CardTitle>
                <CardDescription>
                  A glimpse of this user's item collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {publicInventoryItems && publicInventoryItems.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {publicInventoryItems.map((item: any, index: number) => (
                        <div key={index} className="flex flex-col items-center p-3 rounded-lg border bg-card text-center" data-testid={`inventory-item-${index}`}>
                          <div className={`h-8 w-8 rounded-full mb-2 flex items-center justify-center text-white ${
                            item.rarity === 'legendary' ? 'bg-yellow-500' :
                            item.rarity === 'epic' ? 'bg-purple-500' :
                            item.rarity === 'rare' ? 'bg-blue-500' :
                            item.rarity === 'uncommon' ? 'bg-green-500' :
                            'bg-gray-500'
                          }`}>
                            <Package className="h-4 w-4" />
                          </div>
                          <p className="text-xs font-medium truncate w-full" data-testid={`text-item-name-${index}`}>
                            {item.name}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="text-xs mt-1" 
                            data-testid={`badge-item-type-${index}`}
                          >
                            {item.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    {userProfile.publicInventory.length > 12 && (
                      <p className="text-center text-sm text-muted-foreground mt-4" data-testid="text-more-items">
                        And {userProfile.publicInventory.length - 12} more items...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground" data-testid="text-no-items">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No items to display</p>
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