import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, Command } from 'lucide-react';

interface Suggestion {
  title: string;
  prompt: string;
  icon: React.ElementType;
}

interface InputAreaProps {
  onSend: (text: string, image?: string) => void;
  isLoading: boolean;
  suggestions?: Suggestion[];
  isFheemMode?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, suggestions = [], isFheemMode = false }) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const accentColor = isFheemMode ? 'text-[#39FF14]' : 'text-[#00FF88]';
  const accentBorder = isFheemMode ? 'border-[#39FF14]' : 'border-[#00FF88]';
  const accentBg = isFheemMode ? 'bg-[#39FF14]' : 'bg-[#00FF88]';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;
    onSend(inputText, selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setSelectedImage(reader.result as string);
          reader.readAsDataURL(file);
          return; // Stop after finding the first image
        }
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [inputText]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      {/* Floating Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center md:justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
           {suggestions.map((s, idx) => (
             <button 
               key={idx}
               onClick={() => onSend(s.prompt)}
               disabled={isLoading}
               className={`
                 group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 interactive
                 bg-[#111614]/80 backdrop-blur-md border-[#ffffff10] text-[#9CA3AF]
                 hover:text-white hover:border-opacity-50 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:-translate-y-0.5
               `}
               style={{ animationDelay: `${idx * 0.1}s` }}
             >
               <span className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r from-transparent via-white to-transparent`}></span>
               <s.icon className={`w-3 h-3 transition-colors ${isFheemMode ? 'group-hover:text-[#39FF14]' : 'group-hover:text-[#00FF88]'}`} />
               <span>{s.title}</span>
             </button>
           ))}
        </div>
      )}

      {/* Main Input Capsule */}
      <div className={`
        relative w-full rounded-[2rem] p-2 flex items-end gap-2 transition-all duration-500
        glass-panel shadow-2xl
        ${isFocused 
          ? `border-opacity-100 ${accentBorder} shadow-[0_0_30px_rgba(0,0,0,0.5)] scale-[1.01]` 
          : 'border-white/10 hover:border-white/20'
        }
      `}>
        
        {/* Glow effect when focused */}
        {isFocused && (
            <div className={`absolute -inset-[1px] -z-10 rounded-[2rem] opacity-20 blur-md ${accentBg}`}></div>
        )}

        {/* Attachment Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-3 rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#ffffff10] transition-all interactive flex-shrink-0"
        >
           <ImageIcon className="w-5 h-5" />
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </button>

        {/* Text Input */}
        <div className="flex-1 py-3 min-h-[50px] flex flex-col justify-center">
           {selectedImage && (
             <div className="relative w-fit mb-2 group">
                <img src={selectedImage} alt="Preview" className="h-16 rounded-lg border border-[#ffffff20]" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                   <X className="w-3 h-3" />
                </button>
             </div>
           )}
           <textarea
             ref={textareaRef}
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             onKeyDown={handleKeyDown}
             onPaste={handlePaste}
             onFocus={() => setIsFocused(true)}
             onBlur={() => setIsFocused(false)}
             placeholder="Type your question here (or paste an image)..."
             rows={1}
             disabled={isLoading}
             className="w-full bg-transparent border-none focus:ring-0 text-[#EDEDED] placeholder:text-[#525252] resize-none text-base leading-relaxed px-2 font-['Cairo']"
           />
        </div>

        {/* Send Button */}
        <button 
          onClick={handleSend}
          disabled={(!inputText.trim() && !selectedImage) || isLoading}
          className={`
            p-3.5 rounded-full flex items-center justify-center transition-all duration-300 interactive flex-shrink-0
            ${(!inputText.trim() && !selectedImage) || isLoading 
               ? 'bg-[#1F2A25] text-[#525252] cursor-not-allowed' 
               : `${accentBg} text-black hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(0,255,136,0.4)]`
            }
          `}
        >
           {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>

      </div>
      
      <div className="text-center">
         <p className="text-[10px] text-[#525252] font-mono uppercase tracking-[0.2em] opacity-50">
           Apex Engine v2.4 • Secured Connection
         </p>
      </div>
    </div>
  );
};

export default InputArea;