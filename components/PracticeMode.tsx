import React, { useState } from 'react';
import { generatePracticeQuestion, PracticeQuestion } from '../services/geminiService';
import { Brain, ArrowRight, CheckCircle, XCircle, RefreshCw, ChevronLeft, Scale, FileText, AlertTriangle, MoreHorizontal, Target } from 'lucide-react';

interface PracticeModeProps {
  isFheemMode: boolean;
}

const TOPICS = [
  { id: 'Verbal Analogy', name: 'تناظر لفظي', icon: Scale, desc: 'اكتشف العلاقة بين زوجين من الكلمات.' },
  { id: 'Sentence Completion', name: 'إكمال الجمل', icon: MoreHorizontal, desc: 'املأ الفراغات بما يناسب السياق.' },
  { id: 'Contextual Error', name: 'الخطأ السياقي', icon: AlertTriangle, desc: 'حدد الكلمة التي تفسد المعنى.' },
  { id: 'Reading Comprehension', name: 'استيعاب المقروء', icon: FileText, desc: 'حلل النصوص وأجب عن الأسئلة.' },
  { id: 'Odd One Out', name: 'المفردة الشاذة', icon: Target, desc: 'استخرج الكلمة المختلفة في المعنى.' },
];

const PracticeMode: React.FC<PracticeModeProps> = ({ isFheemMode }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questionData, setQuestionData] = useState<PracticeQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const accentColor = isFheemMode ? '#39FF14' : '#00FF88';
  const accentText = isFheemMode ? 'text-[#39FF14]' : 'text-[#00FF88]';
  const accentBorder = isFheemMode ? 'border-[#39FF14]' : 'border-[#00FF88]';
  const accentBg = isFheemMode ? 'bg-[#39FF14]' : 'bg-[#00FF88]';

  const loadQuestion = async (topic: string) => {
    setLoading(true);
    setQuestionData(null);
    setUserAnswer(null);
    try {
      const data = await generatePracticeQuestion(topic, isFheemMode);
      setQuestionData(data);
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء تحميل السؤال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    loadQuestion(topicId);
  };

  const handleAnswer = (index: number) => {
    if (userAnswer !== null) return; // Prevent changing answer
    setUserAnswer(index);
    if (questionData && index === questionData.correctIndex) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (selectedTopic) {
      loadQuestion(selectedTopic);
    }
  };

  const goBack = () => {
    setSelectedTopic(null);
    setQuestionData(null);
    setStreak(0);
  };

  if (!selectedTopic) {
    return (
      <div className="h-full w-full p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Cairo']">
               تدريب <span className={`${accentText} neon-text`}>القدرات</span>
            </h1>
            <p className="text-[#9CA3AF] text-lg">اختر نوع السؤال للبدء في تمرين مكثف مدعوم بالذكاء الاصطناعي</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPICS.map((topic, idx) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className={`
                  group relative p-6 rounded-2xl glass-panel text-right transition-all duration-300
                  hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-transparent
                  hover:${accentBorder}
                `}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`absolute top-6 left-6 p-3 rounded-xl bg-[#ffffff05] group-hover:bg-[#ffffff10] transition-colors`}>
                  <topic.icon className={`w-6 h-6 ${accentText}`} />
                </div>
                <h3 className="text-xl font-bold mb-2 mt-8 font-['Cairo'] group-hover:text-white text-gray-200">{topic.name}</h3>
                <p className="text-sm text-[#525252] group-hover:text-[#9CA3AF] transition-colors">{topic.desc}</p>
                <div className={`absolute bottom-0 right-0 h-1 bg-gradient-to-r from-transparent via-[${accentColor}] to-transparent w-0 group-hover:w-full transition-all duration-500`}></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col p-4 md:p-8 max-w-4xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={goBack} className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors interactive">
           <ChevronLeft className="w-5 h-5" />
           <span>العودة للقائمة</span>
        </button>
        <div className="flex items-center gap-3 bg-[#ffffff05] px-4 py-2 rounded-full border border-[#ffffff05]">
           <Brain className={`w-4 h-4 ${accentText}`} />
           <span className="text-sm font-bold tracking-wider">STREAK: {streak}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-pulse">
           <div className={`w-16 h-16 rounded-full border-t-2 border-b-2 ${accentBorder} animate-spin`}></div>
           <p className="text-[#9CA3AF] font-mono tracking-widest">GENERATING SIMULATION...</p>
        </div>
      ) : questionData ? (
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
           
           {/* Question Card */}
           <div className="relative glass-panel p-8 rounded-3xl border border-[#ffffff05] shadow-2xl">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[${accentColor}] to-transparent opacity-50`}></div>
              
              {questionData.context && (
                <div className="mb-6 p-4 bg-[#000000] rounded-xl border-r-2 border-[#ffffff20] text-[#D1D5DB] leading-loose text-lg">
                   {questionData.context}
                </div>
              )}
              
              <h2 className="text-2xl md:text-3xl font-bold text-center leading-relaxed font-['Cairo'] text-white">
                {questionData.question}
              </h2>
           </div>

           {/* Options Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionData.options.map((option, idx) => {
                const isSelected = userAnswer === idx;
                const isCorrect = idx === questionData.correctIndex;
                const showResult = userAnswer !== null;

                let btnClass = "border-[#ffffff10] hover:border-[#ffffff30] bg-[#ffffff03]";
                if (showResult) {
                  if (isCorrect) btnClass = `border-[${accentColor}] bg-[${accentColor}]/10 shadow-[0_0_20px_rgba(0,255,136,0.1)]`;
                  else if (isSelected) btnClass = "border-red-500 bg-red-500/10";
                  else btnClass = "border-[#ffffff05] opacity-50";
                } else {
                  btnClass += " hover:bg-[#ffffff08]";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showResult}
                    className={`
                      relative p-6 rounded-xl border text-lg font-medium text-right transition-all duration-200
                      flex items-center justify-between group
                      ${btnClass}
                    `}
                  >
                    <span className={`flex-1 ${showResult && isCorrect ? accentText : 'text-[#EDEDED]'}`}>{option}</span>
                    {showResult && isCorrect && <CheckCircle className={`w-6 h-6 ${accentText}`} />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                  </button>
                );
              })}
           </div>

           {/* Explanation Reveal */}
           {userAnswer !== null && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
               <div className={`glass-panel p-6 rounded-2xl border ${questionData.correctIndex === userAnswer ? accentBorder : 'border-red-500/30'}`}>
                 <h3 className="text-sm font-bold text-[#525252] uppercase tracking-widest mb-2">ANALYSIS LOG</h3>
                 <p className="text-lg leading-relaxed text-[#EDEDED] font-['Cairo']">
                    {questionData.explanation}
                 </p>
               </div>
               
               <div className="mt-8 flex justify-center">
                 <button 
                   onClick={handleNext}
                   className={`
                     px-8 py-4 rounded-full font-bold text-black flex items-center gap-3 transition-transform hover:scale-105 active:scale-95
                     ${accentBg} shadow-[0_0_30px_rgba(0,255,136,0.3)]
                   `}
                 >
                   <span>السؤال التالي</span>
                   <ArrowRight className="w-5 h-5" />
                 </button>
               </div>
             </div>
           )}
        </div>
      ) : (
        <div className="text-center text-red-400">Error loading data.</div>
      )}
    </div>
  );
};

export default PracticeMode;