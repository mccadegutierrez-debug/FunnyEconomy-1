import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wrench } from 'lucide-react';

export default function PetsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-impact text-primary dm-title">🐾 Pets</h1>
          <Button variant="outline" asChild>
            <Link href="/" data-testid="button-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Wrench className="w-16 h-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl mb-2">Pet System Is Being Rebuilt</CardTitle>
          <CardDescription className="text-lg">
            The pet system is currently undergoing a major overhaul to bring you an even better experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            We appreciate your patience as we work on exciting new features and improvements.
            Check back soon for updates!
          </p>
          <Button asChild data-testid="button-back-home">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
