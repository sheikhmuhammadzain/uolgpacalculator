import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { analyzeQuery, generateResponse } from '../services/nlpService';
import { useGpaStore } from '../stores/gpaStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m UOLGPT, your academic assistant. You can ask me questions like:\n\n- "What would my GPA be if I get an A in a 3-credit course?"\n- "How would a B+ affect my GPA?"\n- "What\'s the point value for an A grade?"'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { semesters, cgpa } = useGpaStore();
  const allCourses = semesters.flatMap(semester => semester.courses);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Process the query using NLP service
    const nlpResult = analyzeQuery(input);
    const response = generateResponse(nlpResult, cgpa, allCourses);

    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant' as const,
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700"
      >
        <MessageSquare size={24} />
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-green-100 dark:border-gray-700 flex flex-col z-50">
          <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">UOL GPT</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="flex-1 p-4 h-96 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 p-2 border-2 border-green-100 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};