import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Star, Trophy, Award } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface RewardNotificationProps {
  title: string;
  description: string;
  points?: number;
  achievement?: boolean;
  levelUp?: boolean;
}

const RewardNotification = ({ 
  title, 
  description, 
  points, 
  achievement, 
  levelUp 
}: RewardNotificationProps) => {
  const [show, setShow] = useState(true);

  const launchConfetti = useCallback(() => {
    const duration = 1500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (show && (achievement || levelUp)) {
      launchConfetti();
    }
  }, [show, achievement, levelUp, launchConfetti]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={cn(
            "fixed bottom-4 right-4 z-50 flex items-center gap-4 p-4 rounded-lg shadow-lg",
            levelUp ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" :
            achievement ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
            "bg-gradient-to-r from-green-400 to-emerald-500"
          )}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
            {levelUp ? (
              <Trophy className="w-6 h-6 text-white" />
            ) : achievement ? (
              <Award className="w-6 h-6 text-white" />
            ) : (
              <Star className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/90">{description}</p>
            {points && (
              <p className="text-sm font-semibold text-white/90">+{points} points</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80 hover:bg-white/10"
            onClick={() => setShow(false)}
          >
            ×
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardNotification;