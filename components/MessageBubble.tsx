import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { User, Bot, Sparkles, Copy, ThumbsUp } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isFheemMode?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isFheemMode = false }) => {
  const isUser = message.role === 'user';
  
  // Theme colors based on mode
  const accentColor = isFheemMode ? '#39FF14' : '#00FF88';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} group perspective-1000 mb-2`}>
      <div 
        className={`
          flex max-w-[95%] md:max-w-[85%] gap-4
          ${isUser ? 'flex-row-reverse' : 'flex-row'}
          animate-in fade-in slide-in-from-bottom-2 duration-300
        `}
      >
        {/* Avatar */}
        <div className={`
           w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
           ${isUser 
             ? `bg-[#111614] border border-[#ffffff10] shadow-lg` 
             : `bg-black border ${isFheemMode ? 'border-[#39FF14]/50 shadow-[0_0_15px_#39FF14/20]' : 'border-[#00FF88]/30 shadow-[0_0_10px_#00FF88/10]'}`
           }
        `}>
           {isUser ? (
             <User className="w-5 h-5 text-gray-400" />
           ) : (
             <Bot className={`w-5 h-5 ${isFheemMode ? 'text-[#39FF14]' : 'text-[#00FF88]'}`} />
           )}
        </div>

        {/* Bubble Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
           <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[10px] font-bold text-[#525252] uppercase tracking-widest">
                 {isUser ? 'OPERATOR' : (isFheemMode ? 'FHEEM CORE' : 'APEX SYSTEM')}
              </span>
              <span className="text-[10px] text-[#333]">
                 {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
           </div>

           <div className={`
             relative px-6 py-4 rounded-2xl text-sm md:text-base leading-relaxed overflow-hidden transition-all duration-300
             ${isUser 
               ? 'bg-[#111614] border border-[#ffffff10] text-[#EDEDED] rounded-tr-sm hover:border-[#ffffff30]' 
               : `glass-panel text-[#e5e5e5] rounded-tl-sm border-l-2 ${isFheemMode ? 'border-l-[#39FF14]' : 'border-l-[#00FF88]'}`
             }
           `}>
              {/* Highlight Glow Effect on Hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r from-transparent via-[${accentColor}] to-transparent pointer-events-none`}></div>

              {message.image && (
                <div className="mb-4 rounded-lg overflow-hidden border border-[#ffffff10]">
                   <img src={message.image} alt="Upload" className="max-w-full max-h-64 object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              )}

              <div className="markdown-content relative z-10 font-['Cairo']">
                <ReactMarkdown
                  components={{
                    strong: ({node, ...props}) => <span className={`font-bold ${isFheemMode ? 'text-[#39FF14] drop-shadow-[0_0_5px_#39FF14]' : 'text-[#00FF88]'}`} {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4 border-b border-[#ffffff10] pb-2 text-white" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                    code: ({node, ...props}) => <code className="bg-[#000000] border border-[#ffffff20] px-1.5 py-0.5 rounded text-xs font-mono text-[#00FF88]" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
           </div>

           {/* Message Actions */}
           {!isUser && (
             <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-1">
                <button className="p-1 hover:text-white text-[#525252] transition-colors interactive" title="Copy">
                   <Copy className="w-3 h-3" />
                </button>
                <button className="p-1 hover:text-[#00FF88] text-[#525252] transition-colors interactive" title="Helpful">
                   <ThumbsUp className="w-3 h-3" />
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;