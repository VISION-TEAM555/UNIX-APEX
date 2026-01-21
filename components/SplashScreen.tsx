import React, { useEffect, useState, useRef } from 'react';
import { Zap, ArrowLeft, Target, Cpu, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStart = () => {
    setIsExiting(true);
    // Play a subtle sound if we had audio assets
    setTimeout(onStart, 1000); // Wait for the exit animation
  };

  // Parallax calculation helper
  const p = (value: number) => {
    return {
      transform: `translate(${mousePos.x * value}px, ${mousePos.y * value}px)`,
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#030303] text-white perspective-1000 transition-opacity duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
         {/* Moving Grid Floor */}
         <div 
           className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
             backgroundSize: '60px 60px',
             transform: `perspective(500px) rotateX(60deg) translateY(${mousePos.y * 20}px) translateZ(-100px)`,
             transformOrigin: 'center 120%',
             maskImage: 'linear-gradient(to top, black, transparent 80%)'
           }}
         />
         
         {/* Spotlight Orb */}
         <div 
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FF88] rounded-full blur-[150px] opacity-10 mix-blend-screen transition-transform duration-100 ease-out"
           style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px) translate(-50%, -50%)` }}
         />
         
         {/* Floating Tech Particles */}
         <div className="absolute top-1/4 left-1/4 animate-float-slow opacity-20" style={p(20)}>
            <Target className="w-12 h-12 text-[#00FF88]" />
         </div>
         <div className="absolute bottom-1/3 right-1/4 animate-float-delayed opacity-20" style={p(-20)}>
            <Cpu className="w-16 h-16 text-[#00FF88]" />
         </div>
      </div>

      {/* --- Main Content Card --- */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center max-w-4xl px-4 text-center transition-all duration-1000 transform ${
            mounted ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-10 opacity-0 blur-lg'
        }`}
      >
        
        {/* Logo Mark */}
        <div className="relative mb-8 group cursor-default">
           <div className="absolute inset-0 bg-[#00FF88] blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
           <div className="relative w-24 h-24 md:w-32 md:h-32 bg-black/40 backdrop-blur-xl border border-[#1F2A25] rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] group-hover:border-[#00FF88]/50 group-hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
              {/* Inner Glow Ring */}
              <div className="absolute inset-0 rounded-[2rem] border border-[#00FF88]/20 opacity-50"></div>
              
              <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 md:w-16 md:h-16 text-[#00FF88] drop-shadow-[0_0_15px_rgba(0,255,136,0.8)]">
                  <path d="M12 2L2 8L12 14L22 8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 14L12 20L22 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 22V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
           </div>
           
           <div className="absolute -right-4 -top-4 animate-bounce-slow">
              <span className="flex items-center gap-1 bg-[#00FF88] text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-[0_0_20px_rgba(0,255,136,0.4)]">
                 <Sparkles className="w-3 h-3" />
                 <span>AI 3.0</span>
              </span>
           </div>
        </div>

        {/* Hero Typography */}
        <div className="space-y-6 relative">
           <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#EDEDED] to-[#9CA3AF] font-['Cairo'] drop-shadow-2xl">
              مع <span className="text-[#00FF88] inline-block hover:scale-105 transition-transform duration-300 cursor-default">APEX</span>
           </h1>
           
           <div className="overflow-hidden">
             <h2 className="text-2xl md:text-4xl font-medium text-white/90 font-['IBM_Plex_Sans_Arabic'] leading-tight animate-[slideUpFade_1s_0.2s_both]">
               لا تخاف من <span className="relative inline-block px-2">
                 <span className="absolute inset-0 bg-[#00FF88]/10 -skew-x-12 rounded-sm"></span>
                 <span className="relative text-[#00FF88]">القدرات</span>
               </span>
             </h2>
           </div>

           <p className="max-w-xl mx-auto text-[#9CA3AF] text-lg md:text-xl font-light leading-relaxed animate-[slideUpFade_1s_0.4s_both]">
             الذكاء الاصطناعي الأقوى لتحليل القسم اللفظي. 
             <br/>
             <span className="text-white/60">دقة، سرعة، وتحليل أسطوري.</span>
           </p>
        </div>

        {/* --- Interactive Start Button --- */}
        <div className="mt-16 relative group animate-[slideUpFade_1s_0.6s_both]">
           {/* Button Glow Behind */}
           <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF88] to-[#00C874] rounded-full blur opacity-20 group-hover:opacity-60 transition duration-500 group-hover:duration-200"></div>
           
           <button
             onClick={handleStart}
             className="relative px-12 py-5 bg-black rounded-full leading-none flex items-center gap-4 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 active:scale-95 border border-[#1F2A25] hover:border-[#00FF88] hover:shadow-[0_0_40px_rgba(0,255,136,0.2)]"
           >
             <span className="text-xl font-bold text-white group-hover:text-[#00FF88] transition-colors">ابدأ التجربة</span>
             <div className="w-8 h-8 bg-[#00FF88] rounded-full flex items-center justify-center text-black group-hover:rotate-[-45deg] transition-transform duration-500">
               <ArrowLeft className="w-5 h-5 fill-current" />
             </div>
           </button>
           
           {/* Trust Indicator */}
           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-[#525252] font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap">
              <Zap className="w-3 h-3 text-[#00FF88]" />
              <span>Powered by Gemini Pro Vision</span>
           </div>
        </div>
      </div>
      
      {/* --- Footer Status --- */}
      <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-between items-end text-[10px] text-[#333] font-mono uppercase tracking-[0.2em] pointer-events-none">
         <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-pulse"></span>
               System Online
            </span>
            <span>v2.5.0-FHEEM</span>
         </div>
         <div className="text-right opacity-50">
            Design by UNIX.co
         </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite 1s; }
      `}</style>
    </div>
  );
};

export default SplashScreen;