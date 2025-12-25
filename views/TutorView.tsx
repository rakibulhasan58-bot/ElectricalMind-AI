import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { Message } from '../types';
import { Chat, GenerateContentResponse } from "@google/genai";

const TutorView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am ElectroMind. Ask me anything about Electrical Engineering, from Ohm\'s Law to complex Circuit Analysis.',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatSession.current) {
      chatSession.current = createChatSession();
    }
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!chatSession.current) throw new Error("Chat session not initialized");

      const result = await chatSession.current.sendMessageStream({ message: userMsg.text });
      
      let fullResponseText = '';
      const botMsgId = (Date.now() + 1).toString();

      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullResponseText += textChunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullResponseText } : msg
        ));
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Connection error. Please check internet.",
        isError: true,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-circuit-900/50 backdrop-blur z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center text-2xl shadow-lg shadow-electric-500/20">
            🤖
        </div>
        <div>
            <h2 className="text-2xl font-bold text-white">AI Tutor & Solver</h2>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-slate-400 text-xs">Gemini 3 Flash • Online</p>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] lg:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-md ${
                    msg.role === 'user' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-gradient-to-br from-electric-500 to-electric-600 text-white'
                }`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                </div>

                {/* Bubble */}
                <div
                className={`rounded-2xl px-6 py-4 shadow-lg text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                    ? 'bg-circuit-800 text-white border border-white/10 rounded-tr-none'
                    : 'glass-panel text-slate-200 rounded-tl-none'
                } ${msg.isError ? 'border-red-500/50 bg-red-900/20 text-red-100' : ''}`}
                >
                {msg.text}
                </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
            <div className="flex w-full justify-start">
                <div className="flex max-w-[85%] gap-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-md bg-gradient-to-br from-electric-500 to-electric-600 text-white">
                        AI
                    </div>
                    <div className="glass-panel rounded-2xl rounded-tl-none px-6 py-4">
                         <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-circuit-900/80 backdrop-blur-md border-t border-white/5">
        <div className="max-w-4xl mx-auto flex items-end space-x-2 bg-black/40 border border-white/10 rounded-2xl p-2 focus-within:border-electric-500/50 focus-within:ring-1 focus-within:ring-electric-500/50 transition-all shadow-inner">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 px-4 py-3 resize-none focus:outline-none max-h-32 min-h-[48px]"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className={`p-3 rounded-xl transition-all duration-200 transform active:scale-95 ${
              isLoading || !inputText.trim()
                ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                : 'bg-electric-500 hover:bg-electric-400 text-white shadow-lg shadow-electric-500/20'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-2">
            <span className="text-[10px] text-slate-600">AI can make mistakes. Verify important calculations.</span>
        </div>
      </div>
    </div>
  );
};

export default TutorView;