import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Ban, Home } from "lucide-react";
import { useLocation } from "wouter";

interface BanPageProps {
  banType: "permanent" | "temporary";
  reason: string;
  banUntil?: string;
}

export default function BanPage({ banType, reason, banUntil }: BanPageProps) {
  const [, setLocation] = useLocation();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (banType === "temporary" && banUntil) {
      const updateTimeRemaining = () => {
        const now = new Date();
        const banEndDate = new Date(banUntil);
        const diff = banEndDate.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining("Ban has expired - please refresh the page");
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000);

      return () => clearInterval(interval);
    }
  }, [banType, banUntil]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            {banType === "permanent" ? (
              <Ban className="w-8 h-8 text-destructive" />
            ) : (
              <Clock className="w-8 h-8 text-orange-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            {banType === "permanent" ? "Account Banned" : "Temporary Ban"}
          </CardTitle>
          <CardDescription className="text-base">
            {banType === "permanent"
              ? "Your account has been permanently banned from accessing this platform."
              : "Your account has been temporarily suspended."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-destructive mb-1">
                  Ban Reason:
                </h4>
                <p className="text-sm text-muted-foreground">{reason}</p>
              </div>
            </div>
          </div>

          {banType === "temporary" && banUntil && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
                    Time Remaining:
                  </h4>
                  <p className="text-sm text-orange-600 dark:text-orange-300 font-mono">
                    {timeRemaining || "Calculating..."}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">
                    Ban expires: {new Date(banUntil).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                {banType === "permanent"
                  ? "If you believe this ban was issued in error, please contact support through official channels."
                  : "Please wait for the ban to expire before attempting to access the platform again."}
              </p>
              {banType === "temporary" && (
                <p className="text-xs">
                  Note: Attempting to circumvent this ban may result in a
                  permanent ban.
                </p>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/auth")}
                data-testid="button-back-to-login"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
