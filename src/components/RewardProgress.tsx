import { motion } from 'framer-motion';
import { Progress } from './ui/progress';
import { UserLevel } from '@/types/rewards';
import { cn } from '@/lib/utils';

interface RewardProgressProps {
  currentPoints: number;
  currentLevel: UserLevel;
  nextLevel?: UserLevel;
}

const RewardProgress = ({
  currentPoints,
  currentLevel,
  nextLevel
}: RewardProgressProps) => {
  const progress = nextLevel 
    ? ((currentPoints - currentLevel.requiredPoints) / 
       (nextLevel.requiredPoints - currentLevel.requiredPoints)) * 100
    : 100;

  return (
    <div className="p-4 rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{currentLevel.title}</h3>
          <p className="text-sm text-muted-foreground">Level {currentLevel.level}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{currentPoints} points</p>
          {nextLevel && (
            <p className="text-xs text-muted-foreground">
              Next level at {nextLevel.requiredPoints}
            </p>
          )}
        </div>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-2" />
        {progress >= 100 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute -right-1 -top-1 w-4 h-4 bg-primary rounded-full"
          />
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Level Perks</h4>
        <ul className="space-y-1">
          {currentLevel.perks.map((perk, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "text-sm flex items-center space-x-2",
                index === currentLevel.perks.length - 1 && "text-primary font-medium"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{perk}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RewardProgress;