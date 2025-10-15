
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";

const pepeImages = [
  "/Pepes/404.png",
  "/Pepes/cursedpepe.png",
  "/Pepes/pepe.png",
  "/Pepes/toony.gif"
];

export default function NotFound() {
  const [currentImage, setCurrentImage] = useState("/Pepes/404.png");

  const handleImageClick = () => {
    const randomImage = pepeImages[Math.floor(Math.random() * pepeImages.length)];
    setCurrentImage(randomImage);
  };

  useState(() => {
    // Add spooky decorations to 404 page
    const decorations = [
      { type: 'pumpkin', top: '5%', left: '10%', delay: '0s' },
      { type: 'pumpkin', top: '10%', right: '12%', delay: '1.5s' },
      { type: 'pumpkin', top: '85%', left: '8%', delay: '3s' },
      { type: 'pumpkin', top: '90%', right: '10%', delay: '2.5s' },
      { type: 'pumpkin', top: '50%', left: '5%', delay: '2s' },
      { type: 'pumpkin', top: '60%', right: '8%', delay: '3.5s' },
    ];

    decorations.forEach((decor) => {
      const elem = document.createElement('div');
      elem.className = `floating-halloween-decor floating-${decor.type}`;
      elem.style.top = decor.top;
      if (decor.left) elem.style.left = decor.left;
      if (decor.right) elem.style.right = decor.right;
      elem.style.animationDelay = decor.delay;
      document.body.appendChild(elem);
    });

    return () => {
      document.querySelectorAll('.floating-halloween-decor').forEach(el => el.remove());
    };
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0f14] relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5" />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        {/* 404 Image */}
        <img 
          src={currentImage}
          alt="404 Error" 
          className="w-32 h-32 mb-6 object-contain cursor-pointer hover:scale-110 transition-transform"
          onClick={handleImageClick}
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
