import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getSymptomAnalysis } from '../services/geminiService';
import { MessageSquareIcon, SendIcon } from './icons/Icons';

const SymptomChecker: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: "Hello! I'm Medi-AI. How are you feeling today? Please describe your symptoms." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const botResponseText = await getSymptomAnalysis(newMessages);
      const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { 
        sender: 'bot', 
        text: "I'm sorry, I encountered an error. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-xl shadow-xl border animate-fade-in">
      <div className="p-4 border-b flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <MessageSquareIcon />
        </div>
        <div>
            <h2 className="text-lg font-bold text-gray-800">AI Symptom Checker</h2>
            <p className="text-sm text-gray-500">Get preliminary health guidance</p>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-blue text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                 {/* FIX: Removed 'as string' cast as ChatMessage.text is now consistently a string. */}
                 <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />').replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start gap-2">
              <div className="max-w-xs p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your symptoms here..."
            className="flex-grow p-3 border rounded-full focus:ring-2 focus:ring-brand-blue outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0
                       hover:bg-brand-blue-light transition-colors
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-2 px-4">This is not a medical diagnosis. Always consult a doctor for medical advice.</p>
      </form>
    </div>
  );
};

export default SymptomChecker;
