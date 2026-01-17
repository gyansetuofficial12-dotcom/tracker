
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 800); // Wait for fade animation
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#87CEEB] transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center">
        {/* Speech Bubble */}
        <div className="mb-8 animate-bounce">
          <div className="relative bg-white text-indigo-950 font-black px-6 py-4 rounded-[2rem] shadow-2xl text-xl md:text-2xl border-4 border-indigo-600">
            BOARDS ARE COMING! ✍️
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-r-4 border-b-4 border-indigo-600 rotate-45"></div>
          </div>
        </div>

        {/* Doraemon Walking Animation (Using a classic public GIF) */}
        <div className="w-64 h-64 md:w-80 md:h-80 relative">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZleHpsZXhzN3ZleHpsZXhzN3ZleHpsZXhzN3ZleHpsZXhzJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/1267Co3vPNBqQU/giphy.gif" 
            alt="Doraemon Walking"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Loading Footer */}
        <div className="mt-12 text-center">
          <p className="text-white font-black text-sm uppercase tracking-[0.4em] animate-pulse">
            GyanSetu Loading...
          </p>
          <div className="mt-4 w-48 h-2 bg-white/30 rounded-full overflow-hidden mx-auto border border-white/20">
            <div className="h-full bg-white animate-[loading_3.5s_ease-in-out]"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
