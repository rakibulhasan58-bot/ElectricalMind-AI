import React, { useState, useRef, useEffect } from 'react';
import { createBimChatSession } from '../services/geminiService';
import { Message } from '../types';
import { Chat, GenerateContentResponse } from "@google/genai";

const BimView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
        id: 'welcome',
        role: 'model',
        text: 'Welcome to the BIM & Revit Electrical Hub. I specialize in 3D modeling, family creation, circuiting, and coordination. What topic shall we explore?',
        timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session once
  useEffect(() => {
    if (!chatSession.current) {
      chatSession.current = createBimChatSession();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!chatSession.current) chatSession.current = createBimChatSession();

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
        text: "I'm having trouble connecting to the network. Please check your internet connection.",
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

  const topics = [
      "Revit Families",
      "Panel Schedules",
      "Cable Tray Routing",
      "Clash Detection",
      "Worksets & Sharing",
      "LOD Definitions"
  ];

  return (
    <div className="flex flex-col h-full bg-circuit-950">
      {/* Header */}
      <div className="p-6 border-b border-circuit-800 bg-circuit-900/50 backdrop-blur">
        <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-3 text-3xl">🏢</span> 
            BIM & Revit Master Class
        </h2>
        <p className="text-slate-400 text-sm mt-1">
            Master 3D electrical modeling, coordination workflows, and project delivery.
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-5 py-3 shadow-md text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-electric-600 text-white rounded-br-none'
                  : 'bg-circuit-800 text-slate-200 border border-circuit-700 rounded-bl-none'
              } ${msg.isError ? 'border-red-500 text-red-100 bg-red-900/20' : ''}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1].role === 'user' && (
           <div className="flex justify-start">
             <div className="bg-circuit-800 rounded-2xl rounded-bl-none px-5 py-3 border border-circuit-700">
               <div className="flex space-x-2">
                 <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-circuit-900 border-t border-circuit-800">
        
        {/* Quick Topics */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-thin scrollbar-thumb-circuit-700">
            {topics.map((topic) => (
                <button 
                    key={topic}
                    onClick={() => handleSend(`Teach me about ${topic} in Revit Electrical`)}
                    className="whitespace-nowrap px-3 py-1 bg-circuit-800 text-electric-400 text-xs rounded-full hover:bg-circuit-700 border border-circuit-700 transition-colors"
                >
                    {topic}
                </button>
            ))}
        </div>

        <div className="max-w-4xl mx-auto flex items-end space-x-2 bg-circuit-950 border border-circuit-700 rounded-xl p-2 focus-within:border-electric-500 transition-colors">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about BIM/Revit (e.g., 'How do I create a lighting fixture family?')"
            className="flex-1 bg-transparent text-white placeholder-slate-500 px-3 py-2 resize-none focus:outline-none max-h-32 min-h-[44px]"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className={`p-2 rounded-lg transition-colors ${
              isLoading || !inputText.trim()
                ? 'bg-circuit-800 text-slate-600 cursor-not-allowed'
                : 'bg-electric-600 text-white hover:bg-electric-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BimView;