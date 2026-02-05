import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Sparkles } from 'lucide-react';

const Ai = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your UNIO AI assistant. How can I help you with your studies like DSA, Data Science, etc. today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I'm a demo AI interface. I can't really process that yet, but the UI looks great, doesn't it?", 
        sender: 'ai' 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full max-w-5xl mx-auto p-4 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-4">
          <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Assistant</h1>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 <span className="text-xs text-[var(--color-text-muted)]">Always Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl shadow-md text-sm md:text-base leading-relaxed
              ${msg.sender === 'user' 
                ? 'bg-[var(--color-primary)] text-white rounded-br-none shadow-[var(--color-primary)]/10' 
                : 'glass-card border border-[var(--glass-border)] text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="glass-card p-2 rounded-2xl flex items-center gap-2 border border-[var(--glass-border)] shadow-2xl relative z-20">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder-gray-500 font-medium"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="p-3 bg-[var(--color-primary)] rounded-xl text-white hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-primary)]/20"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default Ai;
