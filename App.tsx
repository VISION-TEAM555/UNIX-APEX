import React, { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { sendMessageToGemini } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import SplashScreen from './components/SplashScreen';
import PracticeMode from './components/PracticeMode';
import { Trash2, Scale, FileText, AlertTriangle, MoreHorizontal, Target, Zap, Menu, X, Cpu, Activity, History, MessageSquare, Brain } from 'lucide-react';

// --- Custom Cursor Component ---
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
      }
      if (outlineRef.current) {
        outlineRef.current.animate({
          transform: `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`
        }, { duration: 500, fill: "forwards" });
      }
    };

    const addHoverClass = () => document.body.classList.add('hovering');
    const removeHoverClass = () => document.body.classList.remove('hovering');

    window.addEventListener('mousemove', moveCursor);
    
    // Add hover effect listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addHoverClass);
      el.addEventListener('mouseleave', removeHoverClass);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addHoverClass);
        el.removeEventListener('mouseleave', removeHoverClass);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot fixed top-0 left-0 pointer-events-none z-[100]" />
      <div ref={outlineRef} className="cursor-outline fixed top-0 left-0 pointer-events-none z-[100]" />
    </>
  );
};

// --- Thinking Indicator ---
const ThinkingIndicator = ({ isFheemMode }: { isFheemMode: boolean }) => (
  <div className="flex items-center gap-4 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center border ${isFheemMode ? 'bg-black border-[#39FF14] shadow-[0_0_15px_#39FF14/30]' : 'bg-[#111614] border-[#1F2A25]'}`}>
      <Cpu className={`w-5 h-5 ${isFheemMode ? 'text-[#39FF14] animate-pulse' : 'text-[#00FF88]'} animate-spin-slow`} />
    </div>
    <div className="flex flex-col gap-1">
       <span className={`text-xs font-mono tracking-widest ${isFheemMode ? 'text-[#39FF14]' : 'text-[#00FF88]'}`}>
          {isFheemMode ? 'FHEEM_CORE::PROCESSING' : 'APEX::ANALYZING'}
       </span>
       <div className="flex gap-1">
         <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s] opacity-60"></span>
         <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s] opacity-60"></span>
         <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce opacity-60"></span>
       </div>
    </div>
  </div>
);

// --- Cinematic Fheem Activation Overlay ---
const FheemActivationOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState<'idle' | 'impact' | 'aftermath'>('idle');

  useEffect(() => {
    // Sequence Timeline
    
    // 1. Start Impact (FHEEM slams down)
    setTimeout(() => {
      setStage('impact');
    }, 500);

    // 2. Aftermath (Reveal Brain)
    setTimeout(() => {
      setStage('aftermath');
    }, 1200);

    // 3. Finish
    setTimeout(() => {
      onComplete();
    }, 4000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden">
      {/* Background Flash */}
      <div className={`absolute inset-0 bg-[#39FF14] transition-opacity duration-100 ease-out ${stage === 'impact' ? 'opacity-20' : 'opacity-0'}`}></div>
      
      {/* Content Container */}
      <div className={`relative w-full h-full flex items-center justify-center ${stage === 'impact' ? 'animate-[screenShake_0.5s_linear]' : ''}`}>
        
        {/* The Victim: APEX */}
        <div className="absolute flex items-center justify-center font-['JetBrains_Mono'] font-bold text-6xl md:text-9xl tracking-tighter text-[#525252]">
          <span 
            className={`transition-all duration-700 ${stage !== 'idle' ? 'animate-[shatterLeft_0.8s_forwards_ease-in]' : ''}`}
            style={{ display: 'inline-block' }}
          >
            AP
          </span>
          <span 
            className={`transition-all duration-700 ${stage !== 'idle' ? 'animate-[shatterRight_0.8s_forwards_ease-in]' : ''}`}
            style={{ display: 'inline-block' }}
          >
            EX
          </span>
        </div>

        {/* The Crusher: FHEEM */}
        <div 
          className={`
            absolute font-['Cairo'] font-black text-7xl md:text-[12rem] text-[#39FF14] tracking-widest drop-shadow-[0_0_50px_rgba(57,255,20,0.8)]
            ${stage === 'idle' ? 'opacity-0' : 'opacity-100 animate-[wordSlam_0.4s_cubic-bezier(0.25,1,0.5,1)_forwards]'}
          `}
          style={{ 
             textShadow: '0 0 30px #39FF14, 0 0 60px #39FF14'
          }}
        >
          FHEEM
        </div>

        {/* The Result: SUPER BRAIN */}
        <div 
          className={`
            absolute flex flex-col items-center justify-center gap-6
            ${stage === 'aftermath' ? 'animate-[brainRise_1s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]' : 'opacity-0 translate-y-20'}
          `}
        >
           <div className="relative">
              <div className="absolute inset-0 bg-[#39FF14] blur-[100px] opacity-40 animate-pulse"></div>
              <Brain className="w-32 h-32 md:w-48 md:h-48 text-[#39FF14] fill-black drop-shadow-[0_0_15px_rgba(57,255,20,1)]" strokeWidth={1.5} />
              <Zap className="absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16 text-white fill-[#39FF14] animate-bounce" />
           </div>
           
           <h2 className="text-2xl md:text-4xl font-bold text-white tracking-[0.5em] font-mono mt-8">
              SUPER INTELLIGENCE
           </h2>
        </div>

      </div>
    </div>
  );
};

type ViewMode = 'chat' | 'practice';

// --- Main App Component ---
const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFheemMode, setIsFheemMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mouse parallax for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 20;
      const y = (e.clientY / window.innerHeight) * 20;
      document.documentElement.style.setProperty('--move-x', `${x}px`);
      document.documentElement.style.setProperty('--move-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToBottom = () => {
    if (viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, viewMode]);

  const toggleFheemMode = () => {
    if (isTransitioning) return;

    if (!isFheemMode) {
      // Activating Fheem Mode
      setIsTransitioning(true);
      // Actual logic to switch mode happens after animation in the Overlay callback
    } else {
      // Deactivating Fheem Mode (Instant)
      setIsFheemMode(false);
      const systemMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        content: "System restored to Standard Operational Mode.",
        timestamp: Date.now(),
      };
      if (viewMode === 'chat') {
        setMessages(prev => [...prev, systemMsg]);
      }
    }
  };

  const handleTransitionComplete = () => {
    setIsFheemMode(true);
    setIsTransitioning(false);
    
    // Add system notification
    const systemMsg: Message = {
      id: Date.now().toString(),
      role: 'model',
      content: "⚡ **SYSTEM OVERRIDE: FHEEM MODE ENGAGED.** \n\nPerformance: Maximum. \nLogic: Hyper-Optimized.",
      timestamp: Date.now(),
    };
    if (viewMode === 'chat') {
      setMessages(prev => [...prev, systemMsg]);
    }
  };

  const handleSendMessage = async (text: string, image?: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      image: image,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text, image, isFheemMode);
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: error.message || "Connection Error.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Purge current session logs?')) {
        setMessages([]);
    }
  };

  const suggestions = [
    { title: "تناظر لفظي", prompt: "أعطني سؤال تناظر لفظي صعب مع الشرح.", icon: Scale },
    { title: "استيعاب المقروء", prompt: "نص قصير وسؤال استيعاب.", icon: FileText },
    { title: "الخطأ السياقي", prompt: "سؤال خطأ سياقي ذكي.", icon: AlertTriangle },
    { title: "إكمال الجمل", prompt: "تمرين إكمال جمل.", icon: MoreHorizontal },
  ];
  
  const fheemSuggestions = [
    { title: "⚡ كشف الأنماط", prompt: "كيف أكشف نمط التناظر المخادع؟", icon: Zap },
    { title: "🎯 الحذف الذكي", prompt: "استراتيجية استبعاد الخيارات.", icon: Target },
  ];

  return (
    <div className={`relative h-screen w-full overflow-hidden flex transition-colors duration-700 ${isFheemMode ? 'bg-[#000000]' : 'bg-[#050505]'}`}>
      <CustomCursor />
      
      {isTransitioning && <FheemActivationOverlay onComplete={handleTransitionComplete} />}

      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: `linear-gradient(${isFheemMode ? '#39FF14' : '#00FF88'} 1px, transparent 1px), linear-gradient(90deg, ${isFheemMode ? '#39FF14' : '#00FF88'} 1px, transparent 1px)`,
               backgroundSize: '50px 50px',
               transform: 'translate(var(--move-x), var(--move-y))'
             }}>
        </div>
        <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-10 ${isFheemMode ? 'bg-[#39FF14]' : 'bg-[#00FF88]'}`}></div>
        <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-10 ${isFheemMode ? 'bg-[#39FF14]' : 'bg-[#00FF88]'}`}></div>
      </div>

      {showSplash && <SplashScreen onStart={() => setShowSplash(false)} />}

      {/* --- Sidebar (Desktop: Left Panel) --- */}
      <aside className={`fixed inset-y-0 right-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 glass-panel border-l border-[#ffffff05] flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-[#ffffff05] flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isFheemMode ? 'border-[#39FF14] bg-[#39FF14]/10' : 'border-[#00FF88] bg-[#00FF88]/10'}`}>
                 <Cpu className="w-4 h-4" />
              </div>
              <h1 className="font-bold text-lg tracking-wider font-['JetBrains_Mono']">APEX<span className="text-xs align-top opacity-50">v2</span></h1>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-[#9CA3AF] interactive">
              <X className="w-5 h-5" />
           </button>
        </div>

        {/* Navigation Buttons */}
        <div className="px-4 pt-6 space-y-2">
           <button 
             onClick={() => { setViewMode('chat'); setIsSidebarOpen(false); }}
             className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all interactive ${viewMode === 'chat' ? 'bg-[#ffffff08] text-white border border-[#ffffff10]' : 'text-[#9CA3AF] hover:text-white hover:bg-[#ffffff05]'}`}
           >
              <MessageSquare className="w-4 h-4" />
              Chat Mode
           </button>
           <button 
             onClick={() => { setViewMode('practice'); setIsSidebarOpen(false); }}
             className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all interactive ${viewMode === 'practice' ? 'bg-[#ffffff08] text-white border border-[#ffffff10]' : 'text-[#9CA3AF] hover:text-white hover:bg-[#ffffff05]'}`}
           >
              <Brain className="w-4 h-4" />
              Practice Mode
           </button>
        </div>

        <div className="flex-1 p-4 space-y-6">
           {/* FHEEM Toggle Card */}
           <div className={`mt-4 p-4 rounded-xl border transition-all duration-300 interactive cursor-pointer group relative overflow-hidden ${isFheemMode ? 'bg-[#39FF14]/5 border-[#39FF14]/50 shadow-[0_0_20px_#39FF14/10]' : 'bg-[#111614] border-[#1F2A25] hover:border-[#00FF88]/30'}`} onClick={toggleFheemMode}>
              <div className="flex items-center justify-between mb-2">
                 <span className={`text-xs font-bold tracking-widest ${isFheemMode ? 'text-[#39FF14]' : 'text-[#9CA3AF]'}`}>FHEEM CORE</span>
                 <Zap className={`w-4 h-4 ${isFheemMode ? 'text-[#39FF14] fill-current animate-pulse' : 'text-[#9CA3AF]'}`} />
              </div>
              <div className="h-1 w-full bg-[#000] rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-500 ${isFheemMode ? 'w-full bg-[#39FF14]' : 'w-[30%] bg-[#1F2A25]'}`}></div>
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-2 group-hover:text-white transition-colors">
                 {isFheemMode ? 'Super-Intelligence Active' : 'Click to Activate Super Mode'}
              </p>
           </div>
        </div>

        <div className="p-4 border-t border-[#ffffff05]">
           <button onClick={clearChat} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-xs font-medium text-[#ff4d4d] hover:bg-[#ff4d4d]/10 transition-colors interactive border border-transparent hover:border-[#ff4d4d]/20">
              <Trash2 className="w-4 h-4" />
              PURGE LOGS
           </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 glass-panel z-20 sticky top-0 shrink-0">
           <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isFheemMode ? 'bg-[#39FF14] animate-pulse' : 'bg-[#00FF88]'}`}></span>
              <span className="font-bold tracking-widest">APEX</span>
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 interactive">
              <Menu className="w-5 h-5" />
           </button>
        </header>

        {viewMode === 'chat' ? (
          <>
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
               {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
                     <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isFheemMode ? 'border-[#39FF14] shadow-[0_0_50px_#39FF14/20]' : 'border-[#00FF88] shadow-[0_0_50px_#00FF88/10]'}`}>
                        <div className={`absolute inset-0 bg-current opacity-10 rounded-full animate-ping ${isFheemMode ? 'text-[#39FF14]' : 'text-[#00FF88]'}`}></div>
                        <Cpu className={`w-10 h-10 ${isFheemMode ? 'text-[#39FF14]' : 'text-[#00FF88]'}`} />
                     </div>
                     <div>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
                           {isFheemMode ? <span className="text-[#39FF14] neon-text">FHEEM CORE ONLINE</span> : "SYSTEM READY"}
                        </h2>
                        <p className="text-[#9CA3AF] max-w-md mx-auto">
                           {isFheemMode ? "Advanced verbal reasoning logic engaged. Awaiting complex input." : "Initialize verbal aptitude analysis sequence."}
                        </p>
                     </div>
                  </div>
               ) : (
                 <>
                   {messages.map((msg) => (
                     <MessageBubble key={msg.id} message={msg} isFheemMode={isFheemMode} />
                   ))}
                   {isLoading && <ThinkingIndicator isFheemMode={isFheemMode} />}
                   <div ref={messagesEndRef} className="h-4" />
                 </>
               )}
            </div>

            {/* Floating Input Area */}
            <div className="p-4 md:p-6 pb-6 relative z-30 shrink-0">
               <InputArea 
                 onSend={handleSendMessage} 
                 isLoading={isLoading} 
                 suggestions={messages.length > 0 ? (isFheemMode ? fheemSuggestions : suggestions) : (isFheemMode ? fheemSuggestions : suggestions)} // Always show suggestions if chat empty
                 isFheemMode={isFheemMode}
               />
            </div>
          </>
        ) : (
          <PracticeMode isFheemMode={isFheemMode} />
        )}
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

export default App;