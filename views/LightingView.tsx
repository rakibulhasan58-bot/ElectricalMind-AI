import React, { useState, useRef, useEffect } from 'react';
import { createLightingChatSession } from '../services/geminiService';
import { Message } from '../types';
import { Chat, GenerateContentResponse } from "@google/genai";

const LightingView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
        id: 'welcome',
        role: 'model',
        text: 'Welcome to the Professional Lighting Design System.\n\nI can assist you with:\n• Lumen Method Calculations (Room Lux)\n• Fixture Selection (CCT, CRI, IP)\n• Street & Outdoor Lighting Standards\n• Dialux EVO Workflows\n\nWhat are you designing today?',
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
      chatSession.current = createLightingChatSession();
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
      if (!chatSession.current) chatSession.current = createLightingChatSession();
      
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

  const handleQuickAction = (action: string) => {
    const prompts: Record<string, string> = {
        'Calc': `Help me calculate the number of fixtures for a room. Ask me for the dimensions (L x W x H), desired Lux level, and the Lumen output of the fixture I want to use.`,
        'Standards': `What are the standard Lux levels (illuminance) required for common areas like Offices, Classrooms, Corridors, Industrial Warehouses, and Parking lots according to CIBSE and IESNA?`,
        'Street': `Explain the basics of Street Lighting Design classes (M1 to M6) and what factors like Pole Height and Spacing to Height Ratio matter.`,
        'Dialux': `Give me a checklist for starting a new interior project in Dialux EVO.`
    };
    handleSend(prompts[action]);
  };

  return (
    <div className="flex flex-col h-full bg-circuit-950">
      {/* Header */}
      <div className="p-6 border-b border-circuit-800 bg-circuit-900/50 backdrop-blur">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3 text-3xl">💡</span> 
                    Lighting Design System
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Photometric calculations, fixture selection, and lux standards.
                </p>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] lg:max-w-[75%] rounded-2xl px-5 py-3 shadow-md text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
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
        
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-thin scrollbar-thumb-circuit-700">
            <span className="text-xs text-slate-500 self-center mr-2 uppercase tracking-wide font-bold">Tools:</span>
            <button 
                onClick={() => handleQuickAction('Calc')}
                className="whitespace-nowrap px-4 py-1.5 bg-circuit-800 text-electric-400 text-xs font-semibold rounded-full hover:bg-circuit-700 border border-circuit-700 hover:border-electric-500 transition-colors"
            >
                🧮 Calculate Fixtures
            </button>
            <button 
                onClick={() => handleQuickAction('Standards')}
                className="whitespace-nowrap px-4 py-1.5 bg-circuit-800 text-electric-400 text-xs font-semibold rounded-full hover:bg-circuit-700 border border-circuit-700 hover:border-electric-500 transition-colors"
            >
                📋 Lux Standards
            </button>
            <button 
                onClick={() => handleQuickAction('Street')}
                className="whitespace-nowrap px-4 py-1.5 bg-circuit-800 text-electric-400 text-xs font-semibold rounded-full hover:bg-circuit-700 border border-circuit-700 hover:border-electric-500 transition-colors"
            >
                🛣️ Street Lighting
            </button>
             <button 
                onClick={() => handleQuickAction('Dialux')}
                className="whitespace-nowrap px-4 py-1.5 bg-circuit-800 text-electric-400 text-xs font-semibold rounded-full hover:bg-circuit-700 border border-circuit-700 hover:border-electric-500 transition-colors"
            >
                🖥️ Dialux Help
            </button>
        </div>

        <div className="max-w-4xl mx-auto flex items-end space-x-2 bg-circuit-950 border border-circuit-700 rounded-xl p-2 focus-within:border-electric-500 transition-colors">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about lighting (e.g., 'How many 4000lm fixtures for a 5x5m office?')"
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

export default LightingView;