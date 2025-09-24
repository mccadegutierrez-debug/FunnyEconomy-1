import React from "react";
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  Coins,
  TrendingUp,
  Gift,
  Zap
} from "lucide-react"

function getToastIcon(title: React.ReactNode, variant: string) {
  const titleLower = typeof title === 'string' ? title.toLowerCase() : '';
  
  // Success indicators
  if (titleLower.includes('success') || titleLower.includes('complete') || titleLower.includes('win')) {
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  }
  
  // Error indicators  
  if (titleLower.includes('failed') || titleLower.includes('error') || variant === 'destructive') {
    return <XCircle className="h-5 w-5 text-red-500" />;
  }
  
  // Money/economy related
  if (titleLower.includes('earn') || titleLower.includes('coin') || titleLower.includes('bank') || titleLower.includes('work')) {
    return <Coins className="h-5 w-5 text-yellow-500" />;
  }
  
  // Rewards/gifts
  if (titleLower.includes('reward') || titleLower.includes('daily') || titleLower.includes('bonus')) {
    return <Gift className="h-5 w-5 text-purple-500" />;
  }
  
  // Level up/progress
  if (titleLower.includes('level') || titleLower.includes('updated') || titleLower.includes('progress')) {
    return <TrendingUp className="h-5 w-5 text-blue-500" />;
  }
  
  // Gaming related
  if (titleLower.includes('game') || titleLower.includes('play') || titleLower.includes('bet')) {
    return <Zap className="h-5 w-5 text-orange-500" />;
  }
  
  // Warning/caution
  if (titleLower.includes('warning') || titleLower.includes('cooldown') || titleLower.includes('wait')) {
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  }
  
  // Default info
  return <Info className="h-5 w-5 text-blue-500" />;
}

function ToastProgressBar({ duration = 5000 }: { duration?: number }) {
  const [progress, setProgress] = React.useState(100);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [duration]);
  
  return (
    <div className="absolute bottom-0 left-0 h-1 bg-muted rounded-b-md overflow-hidden w-full">
      <div 
        className="h-full bg-primary transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const icon = getToastIcon(title, variant || 'default');
        
        return (
          <Toast key={id} {...props} duration={5000} className="relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {icon}
              </div>
              <div className="grid gap-1 flex-1 min-w-0">
                {title && (
                  <ToastTitle className="font-semibold text-sm leading-none">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm opacity-90 leading-relaxed">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
            <ToastProgressBar duration={5000} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
