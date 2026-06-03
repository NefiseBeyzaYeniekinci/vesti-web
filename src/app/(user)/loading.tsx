"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50/30">
      {/* Dynamic Swaying Hanger & Shirt Animation */}
      <div className="relative flex flex-col items-center justify-center gap-6">
        
        {/* Style injector for the realistic hanger swing animation */}
        <style jsx global>{`
          @keyframes hangerSwing {
            0% {
              transform: rotate(-12deg);
            }
            50% {
              transform: rotate(12deg);
            }
            100% {
              transform: rotate(-12deg);
            }
          }
          .hanger-swing {
            animation: hangerSwing 2.4s ease-in-out infinite;
            transform-origin: 50% 15px; /* Pivot from the tip of the hook */
          }
          @keyframes textPulse {
            0%, 100% {
              opacity: 0.5;
              transform: scale(0.98);
            }
            50% {
              opacity: 1;
              transform: scale(1.02);
            }
          }
          .loader-text-pulse {
            animation: textPulse 2s ease-in-out infinite;
          }
        `}</style>

        {/* The Masterpiece Hanger SVG */}
        <div className="hanger-swing drop-shadow-[0_8px_16px_rgba(121,134,203,0.15)]">
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            className="text-[#7986CB]"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* The Hook (Pivots around 50 15) */}
            <path d="M50 25 C50 15, 60 12, 60 18 C60 24, 50 26, 50 34" />
            
            {/* The Hanger Triangle Body */}
            <path d="M50 34 L18 52 C22 55, 78 55, 82 52 Z" fill="#F8F9FE" />
            
            {/* The Stylish Dress/Shirt hanging naturally from the hanger */}
            <path
              d="M32 46 
                 L24 56 
                 L33 62 
                 L37 54 
                 L37 84 
                 L63 84 
                 L63 54 
                 L67 62 
                 L76 56 
                 L68 46 
                 Z"
              className="fill-[#E8EAF6] stroke-[#7986CB] opacity-95"
              strokeWidth="2"
            />
            
            {/* Elegant details: dynamic collar line */}
            <path d="M42 46 C45 52, 55 52, 58 46" strokeWidth="2" />
          </svg>
        </div>

        {/* Elite Minimalist Labels */}
        <div className="flex flex-col items-center gap-1.5 text-center mt-2">
          <p className="text-sm font-bold text-gray-700 tracking-wide loader-text-pulse">
            Gardırobunuz Düzenleniyor...
          </p>
          <p className="text-xs text-gray-400 font-medium tracking-normal">
            Askıdaki en şık parçalar hazırlanıyor
          </p>
        </div>
      </div>
    </div>
  );
}
