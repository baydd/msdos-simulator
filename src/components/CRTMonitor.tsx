import React, { useEffect, useRef } from 'react';

interface CRTMonitorProps {
  children: React.ReactNode;
}

export const CRTMonitor: React.FC<CRTMonitorProps> = ({ children }) => {
  const monitorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const monitor = monitorRef.current;
    if (!monitor) return;

    // Add subtle screen flicker
    const flicker = () => {
      const opacity = 0.98 + Math.random() * 0.02;
      monitor.style.opacity = opacity.toString();
    };

    const flickerInterval = setInterval(flicker, 100 + Math.random() * 200);

    return () => clearInterval(flickerInterval);
  }, []);

  return (
    <div className="crt-monitor h-screen w-screen bg-black overflow-hidden relative">
      {/* Monitor Bezel */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-8">
        <div className="relative h-full w-full bg-black rounded-lg overflow-hidden shadow-2xl">
          {/* Screen Content Container */}
          <div
            ref={monitorRef}
            className="relative h-full w-full bg-black crt-curvature crt-glow"
            style={{
              background: 'radial-gradient(ellipse at center, #000080 0%, #000040 70%, #000000 100%)',
            }}
          >
            {children}
            
            {/* Scanlines Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none crt-scanlines"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255, 255, 255, 0.03) 2px,
                  rgba(255, 255, 255, 0.03) 4px
                )`,
                animation: 'scanlines 0.1s linear infinite'
              }}
            />
            
            {/* Screen Flare */}
            <div 
              className="absolute top-4 left-4 w-32 h-32 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                filter: 'blur(20px)'
              }}
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .crt-curvature {
          border-radius: 15px;
          transform: perspective(1000px) rotateX(2deg);
        }
        
        .crt-glow {
          box-shadow: 
            inset 0 0 50px rgba(0, 0, 255, 0.1),
            0 0 50px rgba(0, 0, 255, 0.2);
        }
        
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
};