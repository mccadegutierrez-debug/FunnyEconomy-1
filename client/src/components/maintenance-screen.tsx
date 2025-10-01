import { Construction, Home } from "lucide-react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MaintenanceScreenProps {
  featureName: string;
  message?: string;
}

export default function MaintenanceScreen({
  featureName,
  message,
}: MaintenanceScreenProps) {
  return (
    <div
      className="flex items-center justify-center min-h-[60vh] p-4"
      data-testid="status-maintenance"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Construction className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle
            className="text-2xl font-impact"
            data-testid="text-maintenance-title"
          >
            Feature Under Maintenance
          </CardTitle>
          <CardDescription
            className="text-base"
            data-testid="text-maintenance-feature"
          >
            {featureName} is currently disabled
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p
            className="text-muted-foreground"
            data-testid="text-maintenance-message"
          >
            {message ||
              "This feature is temporarily unavailable while we perform maintenance. Please check back later."}
          </p>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Thank you for your patience!
            </p>
          </div>
          <Button asChild className="w-full" data-testid="button-go-home">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
