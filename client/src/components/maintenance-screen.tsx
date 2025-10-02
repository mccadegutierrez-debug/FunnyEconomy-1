import { Wrench, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
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
      <Card className="w-full max-w-2xl bg-card/50 border-border/50">
        <CardContent className="text-center space-y-6 py-12 px-8">
          <div className="flex justify-center mb-6">
            <Wrench className="w-20 h-20 text-muted-foreground" />
          </div>
          
          <h2
            className="text-3xl md:text-4xl font-bold"
            data-testid="text-maintenance-title"
          >
            {featureName} Is Being Updated
          </h2>
          
          <p
            className="text-lg text-muted-foreground max-w-xl mx-auto"
            data-testid="text-maintenance-message"
          >
            {message ||
              `The ${featureName.toLowerCase()} is currently undergoing update to bring you an even better experience.`}
          </p>

          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            We appreciate your patience as we work on exciting new features and improvements. Check back soon for updates!
          </p>

          <div className="pt-4">
            <Button asChild className="px-6" data-testid="button-go-home">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
