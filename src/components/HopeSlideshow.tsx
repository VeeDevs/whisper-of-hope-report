import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from './ui/button';

interface HopeMessage {
  id: number;
  message: string;
  author?: string;
  category: 'recovery' | 'support' | 'resilience' | 'hope';
}

const HOPE_MESSAGES: HopeMessage[] = [
  {
    id: 1,
    message: "You are not alone in this journey. Millions have survived and thrived after trauma.",
    category: 'hope',
    author: 'Survivor Network'
  },
  {
    id: 2,
    message: "Recovery is not linear, but it is possible. Every small step is progress.",
    category: 'recovery'
  },
  {
    id: 3,
    message: "Your voice matters. Sharing your story helps others heal.",
    category: 'support'
  },
  {
    id: 4,
    message: "The pain you feel today will be the strength you feel tomorrow.",
    category: 'resilience'
  },
  {
    id: 5,
    message: "You deserve to feel safe, respected, and valued. Always.",
    category: 'hope'
  },
  {
    id: 6,
    message: "Asking for help is not weakness—it is courage.",
    category: 'support'
  },
  {
    id: 7,
    message: "You survived what tried to destroy you. That makes you strong.",
    category: 'resilience'
  },
  {
    id: 8,
    message: "Healing is not about forgetting. It's about moving forward.",
    category: 'recovery'
  },
  {
    id: 9,
    message: "Your past does not define your future. You have the power to write your story.",
    category: 'hope'
  },
  {
    id: 10,
    message: "It's okay to feel your emotions. Healing requires feeling.",
    category: 'support'
  },
  {
    id: 11,
    message: "You are worthy of love, respect, and safety. Always remember that.",
    category: 'hope'
  },
  {
    id: 12,
    message: "Reaching out today is the first step to a better tomorrow.",
    category: 'recovery'
  },
];

export function HopeSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const currentMessage = HOPE_MESSAGES[currentIndex];

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HOPE_MESSAGES.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? HOPE_MESSAGES.length - 1 : prev - 1
    );
    setIsAutoplay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HOPE_MESSAGES.length);
    setIsAutoplay(false);
  };

  const getCategoryColor = (category: HopeMessage['category']) => {
    switch (category) {
      case 'recovery':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'support':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'resilience':
        return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      case 'hope':
        return 'from-pink-500/20 to-pink-600/20 border-pink-500/30';
    }
  };

  const getCategoryTextColor = (category: HopeMessage['category']) => {
    switch (category) {
      case 'recovery':
        return 'text-blue-600 dark:text-blue-400';
      case 'support':
        return 'text-purple-600 dark:text-purple-400';
      case 'resilience':
        return 'text-orange-600 dark:text-orange-400';
      case 'hope':
        return 'text-pink-600 dark:text-pink-400';
    }
  };

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Main Slide */}
        <div className={`bg-gradient-to-br ${getCategoryColor(currentMessage.category)} border rounded-lg p-8 md:p-12 min-h-64 flex flex-col justify-center relative overflow-hidden`}>
          {/* Decorative Quote Icon */}
          <div className="absolute top-4 right-4 opacity-10">
            <Quote className="w-24 h-24" />
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getCategoryTextColor(currentMessage.category)}`}>
              {currentMessage.category}
            </span>
          </div>

          {/* Message */}
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight relative z-10">
            "{currentMessage.message}"
          </p>

          {/* Author if available */}
          {currentMessage.author && (
            <p className="text-gray-600 dark:text-gray-400 italic text-lg">
              — {currentMessage.author}
            </p>
          )}

          {/* Progress Indicator */}
          <div className="mt-8 flex gap-2">
            {HOPE_MESSAGES.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-gray-900 dark:bg-white' 
                    : 'w-2 bg-gray-400 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={handlePrev}
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
            aria-label="Previous message"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Slide Counter */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {currentIndex + 1} / {HOPE_MESSAGES.length}
            </p>
            {isAutoplay && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Auto-playing • Click to pause
              </p>
            )}
          </div>

          <Button
            onClick={handleNext}
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
            aria-label="Next message"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Autoplay Toggle */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => setIsAutoplay(!isAutoplay)}
            variant={isAutoplay ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
          >
            {isAutoplay ? '⏸ Pause Auto-play' : '▶ Resume Auto-play'}
          </Button>
        </div>
      </div>
    </div>
  );
}
