
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0f14] relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5" />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        {/* 404 Image */}
        <img 
          src="/Pepes/404.png" 
          alt="404 Error" 
          className="w-32 h-32 mb-6 object-contain"
        />
        
        {/* 404 Text */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
          404
        </h1>
        
        {/* Error Message */}
        <p className="text-gray-400 text-lg mb-8">
          WELL, WHAT ARE YOU STILL DOING HERE, SCRAM!
        </p>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            asChild
            variant="secondary"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6"
          >
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
