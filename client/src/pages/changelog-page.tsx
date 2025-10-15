
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  changes: {
    category: string;
    items: string[];
  }[];
  author?: string;
}

// Mock data - replace with actual API call later
const mockChangelogs: ChangelogEntry[] = [
  {
    id: "1",
    version: "2025.10.15",
    date: "October 15, 2025",
    changes: [
      {
        category: "Major Update",
        items: [
          "Introduced trading system for items and pets",
          "Themed Update: Halloween Edition",
        ],
      },
      {
        category: "Improvements",
        items: [
          "Improved performance and loading times",
          "Better mobile responsiveness",
        ],
      },
      {
        category: "Bug Fixes",
        items: [
          "Fixed inventory duplication glitch",
          "Resolved chat message deletion issues",
          "Corrected XP calculation errors",
        ],
      },
    ],
    author: "savage",
  },
  {
    id: "2",
    version: "2025.09.12",
    date: "December 20, 2024",
    changes: [
      {
        category: "New Features",
        items: [
          "Added Friday Boost event system",
          "New gambling games: High-Low and Scratch cards",
          "Achievement system with badges",
        ],
      },
      {
        category: "Economy Updates",
        items: [
          "Rebalanced coin rewards across all activities",
          "Added new earning methods: Stream, Post Meme, Dig",
          "Introduced bank capacity upgrades",
        ],
      },
    ],
    author: "savage",
  },
  {
    id: "3",
    version: "2025.9.11",
    date: "Septempber 11, 2025",
    changes: [
      {
        category: "Launch",
        items: [
          "Initial release of Funny Economy",
          "Core economy system with coins and banking",
          "Basic games: Blackjack, Slots, Coinflip, Dice",
          "Shop system with items and lootboxes",
        ],
      },
      {
        category: "Social Features",
        items: [
          "Real-time chat with WebSocket support",
          "User profiles with customization",
          "Leaderboard system",
        ],
      },
    ],
    author: "savage",
  },
];

export default function ChangelogPage() {
  // Future: Replace with actual API call
  // const { data: changelogs = [] } = useQuery({
  //   queryKey: ["/api/changelog"],
  //   queryFn: async () => {
  //     const res = await apiRequest("GET", "/api/changelog");
  //     return res.json();
  //   },
  // });

  const changelogs = mockChangelogs;

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "new features":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "improvements":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "bug fixes":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "economy updates":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "launch":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "social features":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getTotalChanges = (entry: ChangelogEntry) => {
    return entry.changes.reduce((total, cat) => total + cat.items.length, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="font-impact text-5xl dm-title">
            Changelog
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Browse through all the changelogs available for Funny Economy. Stay updated with the latest features, bug fixes, and gameplay improvements.
          </p>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-6">
          {changelogs.map((entry, index) => (
            <Card
              key={entry.id}
              className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              {/* Version Header with Gradient */}
              <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-6 border-b border-border/50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="font-impact text-4xl text-foreground mb-2">
                      {entry.version}
                    </h2>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{entry.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{getTotalChanges(entry)} changes</span>
                      </div>
                      {entry.author && (
                        <Badge variant="outline" className="font-normal">
                          👤 {entry.author}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Changes Content */}
              <CardContent className="p-6 space-y-6">
                {entry.changes.map((category, catIndex) => (
                  <div key={catIndex} className="space-y-3">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getCategoryColor(category.category)}
                      >
                        {category.category}
                      </Badge>
                    </h3>
                    <ul className="space-y-2 ml-4">
                      {category.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No More Updates Message */}
        {changelogs.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              🎉 You've reached the beginning of our journey!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
