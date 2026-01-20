import React from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const WeddingCardTemplate: React.FC<Props> = ({ className = "", children }) => {
  return (
    <div className={`relative w-full min-h-[100dvh] ${className}`}>
      {/* 
        The Fixed Frame: 
        This remains static in the viewport, creating the "Traditional Burmese Scroll" 
        look that frames all scrolling content.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" 
        >
          <defs>
            <linearGradient id="goldGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bf953f" />
              <stop offset="50%" stopColor="#fcf6ba" />
              <stop offset="100%" stopColor="#aa771c" />
            </linearGradient>
            
            <filter id="parabeikShadowFull" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
              <feOffset dx="0" dy="4" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.1" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle Rice Paper Texture */}
            <filter id="paperGrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
              <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
                <feDistantLight azimuth="45" elevation="60" />
              </feDiffuseLighting>
            </filter>
          </defs>
          
          {/* Main Paper Body - Fills entire screen */}
          <path
            d="M 50,0 
               L 950,0 
               Q 950,0 950,30 
               L 950,475 
               Q 950,500 1000,500 
               L 1000,500 
               Q 950,500 950,525 
               L 950,970 
               Q 950,1000 920,1000 
               L 80,1000 
               Q 50,1000 50,970 
               L 50,525 
               Q 50,500 0,500 
               L 0,500 
               Q 50,500 50,475 
               L 50,30 
               Q 50,0 80,0 
               Z"
            fill="white"
            stroke="url(#goldGradFull)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            filter="url(#parabeikShadowFull)"
          />

          {/* Inner Decorative Accent Line */}
          <path
            d="M 70,15 
               L 930,15 
               Q 930,15 930,45 
               L 930,480 
               Q 930,500 970,500 
               L 970,500 
               Q 930,500 930,520 
               L 930,955 
               Q 930,985 900,985 
               L 100,985 
               Q 70,985 70,955 
               L 70,520 
               Q 70,500 30,500 
               L 30,500 
               Q 70,500 70,480 
               L 70,45 
               Q 70,15 100,15 
               Z"
            fill="none"
            stroke="url(#goldGradFull)"
            strokeWidth="0.5"
            opacity="0.3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* 
        Scrollable Content Layer:
        All content sections pass through here. 
        Horizontal padding ensures text doesn't touch the golden edges.
      */}
      <div className="relative z-10 w-full px-12 xs:px-14 md:px-48 pb-20">
        {children}
      </div>
    </div>
  );
};

export default WeddingCardTemplate;