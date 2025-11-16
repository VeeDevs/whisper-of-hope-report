import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MotivationalQuote {
  id: number;
  text: string;
  author: string;
  category: 'mental-health' | 'gbv' | 'stress' | 'emotional-balance' | 'hope';
  emoji?: string;
}

const quotes: MotivationalQuote[] = [
  {
    id: 1,
    text: "Your mental health is a priority, not a luxury. Invest in yourself.",
    author: "Mental Health Advocate",
    category: 'mental-health',
    emoji: '🧠',
  },
  {
    id: 2,
    text: "You are not alone. Every survivor of abuse is a testament to human strength.",
    author: "Support Community",
    category: 'gbv',
    emoji: '💪',
  },
  {
    id: 3,
    text: "Stress is temporary. Your strength is permanent. You will get through this.",
    author: "Wellness Expert",
    category: 'stress',
    emoji: '✨',
  },
  {
    id: 4,
    text: "Emotional balance is not about being happy all the time—it's about honoring your feelings.",
    author: "Therapist",
    category: 'emotional-balance',
    emoji: '⚖️',
  },
  {
    id: 5,
    text: "Your story matters. Your voice deserves to be heard. You are enough.",
    author: "Survivor",
    category: 'gbv',
    emoji: '🎤',
  },
  {
    id: 6,
    text: "Taking care of yourself is not selfish. It's essential. Breathe, rest, recover.",
    author: "Wellness Coach",
    category: 'mental-health',
    emoji: '🌿',
  },
  {
    id: 7,
    text: "Anxiety lies. You are stronger than you think. One step at a time.",
    author: "Mindfulness Teacher",
    category: 'stress',
    emoji: '🧘',
  },
  {
    id: 8,
    text: "Your past does not define your future. Healing is possible, and you deserve it.",
    author: "Recovery Coach",
    category: 'gbv',
    emoji: '🌱',
  },
  {
    id: 9,
    text: "It's okay to not be okay sometimes. It's also okay to ask for help.",
    author: "Mental Health Professional",
    category: 'mental-health',
    emoji: '❤️',
  },
  {
    id: 10,
    text: "Boundaries are not walls—they're bridges to healthier relationships.",
    author: "Relationship Expert",
    category: 'emotional-balance',
    emoji: '🌉',
  },
  {
    id: 11,
    text: "Your sensitivity is not weakness. It's awareness. It's a gift.",
    author: "Wellness Mentor",
    category: 'mental-health',
    emoji: '💝',
  },
  {
    id: 12,
    text: "Healing is not linear. Every day you choose yourself is a victory.",
    author: "Therapist",
    category: 'gbv',
    emoji: '🏆',
  },
  {
    id: 13,
    text: "You survived everything up until today. You are resilient.",
    author: "Strength Coach",
    category: 'stress',
    emoji: '🔥',
  },
  {
    id: 14,
    text: "Self-compassion is the foundation of emotional balance. Be kind to yourself.",
    author: "Mindfulness Coach",
    category: 'emotional-balance',
    emoji: '🤗',
  },
  {
    id: 15,
    text: "Your voice can heal. Your story can inspire. Your presence matters.",
    author: "Community Leader",
    category: 'hope',
    emoji: '⭐',
  },
  {
    id: 16,
    text: "Mental health awareness saves lives. Be someone's light.",
    author: "Health Advocate",
    category: 'mental-health',
    emoji: '💡',
  },
  {
    id: 17,
    text: "No is a complete sentence. Respect yourself first.",
    author: "Empowerment Coach",
    category: 'gbv',
    emoji: '✋',
  },
  {
    id: 18,
    text: "Stress management is self-love in action. Prioritize peace.",
    author: "Wellness Expert",
    category: 'stress',
    emoji: '☮️',
  },
  {
    id: 19,
    text: "You deserve happiness as much as anyone else. Claim it.",
    author: "Life Coach",
    category: 'emotional-balance',
    emoji: '😊',
  },
  {
    id: 20,
    text: "Hope is not naive. It's the anchor that keeps you afloat.",
    author: "Survivor Leader",
    category: 'hope',
    emoji: '⚓',
  },
];

interface MotivationalQuotesProps {
  autoPlay?: boolean;
  interval?: number;
  mode?: 'slideshow' | 'popup';
  onClose?: () => void;
}

export const MotivationalQuotes: React.FC<MotivationalQuotesProps> = ({
  autoPlay = true,
  interval = 8000,
  mode = 'popup',
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused]);

  const currentQuote = quotes[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  if (mode === 'slideshow') {
    return (
      <div className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg overflow-hidden shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8 text-white text-center"
          >
            <div className="text-4xl mb-4">{currentQuote.emoji}</div>
            <h3 className="text-sm md:text-base font-semibold opacity-80 mb-2 uppercase tracking-wider">
              {currentQuote.category.replace('-', ' ')}
            </h3>
            <p className="text-xl md:text-2xl font-bold mb-4 italic">{currentQuote.text}</p>
            <p className="text-sm opacity-75">— {currentQuote.author}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between px-6 py-4 bg-black/20">
          <Button
            onClick={prev}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex gap-1">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={next}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-6 py-2 text-center text-xs text-white/70 bg-black/20">
          {currentIndex + 1} / {quotes.length}
        </div>
      </div>
    );
  }

  // Popup mode
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40"
      >
        <Card className="w-full max-w-lg shadow-2xl border-2 border-purple-200">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8 text-white relative">
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-5xl mb-4">{currentQuote.emoji}</div>
                  <h3 className="text-xs font-semibold opacity-80 mb-4 uppercase tracking-widest">
                    {currentQuote.category.replace('-', ' ')}
                  </h3>
                  <p className="text-2xl font-bold mb-4 italic leading-relaxed">{currentQuote.text}</p>
                  <p className="text-sm opacity-75">— {currentQuote.author}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/30">
                <Button
                  onClick={prev}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-1">
                  {quotes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={next}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center text-xs mt-3 opacity-70">
                {currentIndex + 1} / {quotes.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
