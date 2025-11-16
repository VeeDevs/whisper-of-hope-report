import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Send, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeEmotionalContent, generateTherapeuticGuidance, EmotionalAnalysis } from '@/utils/emotionalNLP';

interface Message {
  id: string;
  role: 'user' | 'therapist';
  content: string;
  timestamp: Date;
  emotionalContext?: EmotionalAnalysis;
}

export const AITherapist: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'therapist',
      content: "Hello, I'm here to listen and understand you. This is a safe space where your feelings matter. Tell me what's on your mind—whether it's stress, grief, anxiety, relationships, or anything else weighing on you. I'm genuinely here to listen and help you work through it. 💙",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<EmotionalAnalysis | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Analyze emotional content
    const analysis = analyzeEmotionalContent(input);
    setCurrentAnalysis(analysis);

    setMessages((prev) => [...prev, { ...userMessage, emotionalContext: analysis }]);
    setInput('');
    setIsLoading(true);

    // Simulate therapist thinking/typing delay (more natural)
    setTimeout(() => {
      const therapeuticResponse = generateTherapeuticGuidance(analysis);
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'therapist',
        content: therapeuticResponse,
        timestamp: new Date(),
        emotionalContext: analysis,
      };
      
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl h-[600px] md:h-[700px] flex flex-col shadow-2xl border-2 border-purple-200">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 animate-pulse" />
              <div>
                <CardTitle>Empathetic Mental Health Support</CardTitle>
                <p className="text-sm text-purple-100 mt-1">A compassionate listener trained to understand your emotions</p>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-2"
              >
                {/* Main message */}
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg text-sm md:text-base leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none shadow-md'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-60 mt-2 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Emotional analysis tags (for therapist's understanding) */}
                {message.role === 'user' && message.emotionalContext && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 ml-4 mt-2"
                  >
                    {/* Crisis indicator */}
                    {message.emotionalContext.urgencyLevel === 'critical' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        <AlertCircle className="w-3 h-3" /> Crisis Support
                      </span>
                    )}

                    {/* Detected emotions */}
                    {message.emotionalContext.emotions.length > 0 && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        🎭 Feeling: {message.emotionalContext.emotions.slice(0, 2).join(', ')}
                      </span>
                    )}

                    {/* Pain points */}
                    {message.emotionalContext.painPoints.length > 0 && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                        💭 Focus: {message.emotionalContext.painPoints[0]}
                      </span>
                    )}

                    {/* Sentiment indicator */}
                    {message.emotionalContext.sentiment === 'negative' && (
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs">😔 Difficult moment</span>
                    )}
                    {message.emotionalContext.sentiment === 'positive' && (
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">✨ Finding hope</span>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 px-4 py-3 rounded-lg rounded-bl-none border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm italic">Listening and understanding...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <CardContent className="border-t bg-gradient-to-b from-white to-gray-50 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Share what's on your mind... Be honest about how you're feeling"
              className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs text-purple-700">
              <span className="font-semibold">💡 How I can help:</span> Share your emotions honestly—stress, anxiety, grief, trauma, relationships, work struggles, or anything weighing on you. I'll listen with genuine empathy and provide personalized coping strategies grounded in evidence-based therapy.
            </p>
          </div>

          {/* Current analysis display (if available) */}
          {currentAnalysis && currentAnalysis.urgencyLevel === 'critical' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-xs text-red-700">
                <span className="font-semibold">🆘 If you're in immediate danger or having thoughts of self-harm:</span> Please contact emergency services (911 in US) or a crisis line immediately.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
