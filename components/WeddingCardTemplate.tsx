import React from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const WeddingCardTemplate: React.FC<Props> = ({ className = "", children }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center overflow-visible`}>
      {/* 
          Burmese Parabaik SVG Shape:
          - Uses a background SVG that preserves the traditional bracket silhouette.
          - The container itself has padding and overflow management.
      */}
      <div className="absolute inset-0 z-0">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.15)]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bf953f" />
              <stop offset="50%" stopColor="#fcf6ba" />
              <stop offset="100%" stopColor="#aa771c" />
            </linearGradient>
          </defs>
          
          {/* The Parabaik Bracket Silhouette */}
          <path
            d="M 100,0 
               L 900,0 
               Q 950,0 950,50 
               L 950,150 
               Q 950,200 1000,200 
               L 1000,400 
               Q 950,400 950,450 
               L 950,550 
               Q 950,600 900,600 
               L 100,600 
               Q 50,600 50,550 
               L 50,450 
               Q 50,400 0,400 
               L 0,200 
               Q 50,200 50,150 
               L 50,50 
               Q 50,0 100,0 
               Z"
            fill="white"
            stroke="url(#goldGrad)"
            strokeWidth="3"
          />
          
          {/* Inner Decorative Line - Thinner for elegance */}
          <path
            d="M 115,15 
               L 885,15 
               Q 935,15 935,65 
               L 935,165 
               Q 935,215 985,215 
               L 985,385 
               Q 935,385 935,435 
               L 935,535 
               Q 935,585 885,585 
               L 115,585 
               Q 65,585 65,535 
               L 65,435 
               Q 65,385 15,385 
               L 15,215 
               Q 65,215 65,165 
               L 65,65 
               Q 65,15 115,15 
               Z"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="0.8"
            opacity="0.15"
          />
        </svg>
      </div>

      {/* 
          Content Area:
          - Optimized p-4 on small mobile to ensure no cutoffs.
          - justify-between ensures content fills the available height evenly.
      */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-4 xs:p-8 md:p-16 overflow-y-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default WeddingCardTemplate;