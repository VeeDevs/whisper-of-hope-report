import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'therapist';
  content: string;
  timestamp: Date;
}

const therapistGuidance = {
  greeting: "Hello, I'm here to listen and support you. Remember, it's okay to feel whatever you're feeling right now. What's on your mind today?",
  prompts: {
    stress: "I hear you're experiencing stress. Let's break this down together. What specifically is causing you the most concern right now?",
    anxiety: "Anxiety can feel overwhelming. Take a deep breath. Let's explore what's triggering these feelings and work through them together.",
    grief: "I'm sorry you're going through this. Grief is a natural process. Would you like to talk about what you're experiencing?",
    relationships: "Relationships can be complicated. I'm here to help you navigate this. What's been challenging for you?",
    selfcare: "Self-care is crucial for your mental health. Let's discuss what practices could help you feel better.",
    gbv: "I want you to know that what happened is not your fault. Your safety and well-being matter. Let's work through this together at your pace.",
  },
  responses: [
    "That sounds really difficult. How has this been affecting your daily life?",
    "I appreciate you sharing that with me. What do you think would help you feel better?",
    "It's understandable to feel that way. Have you talked to anyone else about this?",
    "Take your time. I'm here to listen without judgment.",
    "That took courage to share. What support do you need right now?",
    "Many people feel this way. You're not alone. What would bring you comfort?",
    "Let's focus on what you can control. What's one small step you could take today?",
    "Your feelings are valid. Self-compassion is important during difficult times.",
  ],
};

export const AITherapist: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'therapist',
      content: therapistGuidance.greeting,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const detectKeyword = (text: string): string | null => {
    const lower = text.toLowerCase();
    if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('pressure'))
      return 'stress';
    if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worry'))
      return 'anxiety';
    if (lower.includes('loss') || lower.includes('grief') || lower.includes('died'))
      return 'grief';
    if (lower.includes('relationship') || lower.includes('partner') || lower.includes('family'))
      return 'relationships';
    if (lower.includes('self-care') || lower.includes('tired') || lower.includes('exhausted'))
      return 'selfcare';
    if (
      lower.includes('abuse') ||
      lower.includes('violence') ||
      lower.includes('assault') ||
      lower.includes('harassment')
    )
      return 'gbv';
    return null;
  };

  const generateResponse = (userMessage: string): string => {
    const keyword = detectKeyword(userMessage);

    if (keyword && therapistGuidance.prompts[keyword as keyof typeof therapistGuidance.prompts]) {
      return therapistGuidance.prompts[keyword as keyof typeof therapistGuidance.prompts];
    }

    return therapistGuidance.responses[Math.floor(Math.random() * therapistGuidance.responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate therapist response delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'therapist',
        content: generateResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] md:h-[700px] flex flex-col shadow-2xl border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            <CardTitle>Mental Health Support</CardTitle>
          </div>
          <p className="text-sm text-blue-100 mt-2">Professional guidance from a caring therapist</p>
        </CardHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm md:text-base">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <CardContent className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Share your thoughts or concerns..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Be specific about your feelings (stress, anxiety, grief, relationships, etc.) for personalized support
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
