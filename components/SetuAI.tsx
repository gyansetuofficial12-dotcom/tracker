
import React, { useState, useRef, useEffect } from 'react';
import { askSetuAI, getStudyMotivation } from '../services/geminiService';
import SplashScreen from './SplashScreen';

const SetuAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPromptSplash, setShowPromptSplash] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'setu', text: string }[]>([
    { role: 'setu', text: "Namaste! I am Setu AI. I'm here to help you navigate this app and stay focused for your boards. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleOpenAI = () => {
    setShowPromptSplash(true);
  };

  const onSplashComplete = () => {
    setShowPromptSplash(false);
    setIsOpen(true);
  };

  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const messageToSend = customMsg || input;
    if (!messageToSend.trim() || isLoading) return;

    if (!customMsg) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);

    const response = await askSetuAI(messageToSend);
    setMessages(prev => [...prev, { role: 'setu', text: response }]);
    setIsLoading(false);
  };

  const fetchMotivation = async () => {
    if (isLoading) return;
    setMessages(prev => [...prev, { role: 'user', text: "Setu, give me some motivation for my board exams!" }]);
    setIsLoading(true);
    const quote = await getStudyMotivation("Board Exams");
    setMessages(prev => [...prev, { role: 'setu', text: `Here is something to keep you going: \n\n"${quote}"` }]);
    setIsLoading(false);
  };

  const sendTeamInfo = async () => {
    if (isLoading) return;
    const userMsg = "Who are Team Hackers?";
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    
    const response = await askSetuAI(userMsg);
    setMessages(prev => [...prev, { role: 'setu', text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Trigger Splash Screen on Click */}
      {showPromptSplash && <SplashScreen onComplete={onSplashComplete} />}

      {/* Floating Button */}
      {!isOpen && !showPromptSplash && (
        <button
          onClick={handleOpenAI}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group bg-indigo-600 text-white animate-in fade-in zoom-in"
        >
          <span className="font-bold text-sm hidden group-hover:inline animate-in fade-in slide-in-from-right-2">Ask Setu AI</span>
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-white"></span>
            </span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 md:p-6 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md h-[80vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10 duration-500">
            {/* Header */}
            <div className="bg-indigo-600 p-6 text-white flex items-center justify-between shadow-lg z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🤖</div>
                <div>
                  <h3 className="font-black text-lg">Setu AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider">Active Study Guide</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Chat Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                    <span className="w-2 h-2 bg-slate-200 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-200 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-slate-200 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-white border-t border-slate-50">
               <button 
                onClick={sendTeamInfo}
                disabled={isLoading}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 hover:bg-rose-100 transition-colors flex items-center gap-2"
               >
                 👥 Team Hackers
               </button>
               <button 
                onClick={fetchMotivation}
                disabled={isLoading}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-2"
               >
                 ✨ Give me motivation
               </button>
               <button 
                onClick={() => handleSend(undefined, "How do I use this app?")}
                disabled={isLoading}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors flex items-center gap-2"
               >
                 📖 App Guide
               </button>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me something..."
                  className="flex-1 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-90"
                >
                  <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SetuAI;
