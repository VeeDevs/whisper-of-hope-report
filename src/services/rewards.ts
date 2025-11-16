import { supabase } from '@/lib/supabase';
import { ACHIEVEMENTS, UserAchievement, UserLevel, USER_LEVELS } from '@/types/rewards';

export const rewardsService = {
  async getUserRewards(userId: string) {
    const client = supabase as any;
    const { data, error } = await client
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async awardPoints(userId: string, points: number, reason: string) {
    // This function is now a placeholder as the logic is handled by a database trigger
    // associated with the 'award_points' RPC call.
    // We keep the notification part.
    console.log(`Awarding ${points} points to ${userId} for ${reason}.`);

    // Create notification for points earned
    const client = supabase as any;
    await client.from('notifications').insert({
      user_id: userId,
      type: 'points',
      title: 'Points Earned',
      description: `You earned ${points} points for ${reason}`,
      read: false,
    });
  },

  async updateStreak(userId: string) {
    const client = supabase as any;
    const { data: rewards, error } = await client
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    const lastCheckIn = rewards?.last_reward_date ? new Date(rewards.last_reward_date) : null;
    const now = new Date();
    const isNewDay = !lastCheckIn || 
      (now.getDate() !== lastCheckIn.getDate() || 
       now.getMonth() !== lastCheckIn.getMonth() || 
       now.getFullYear() !== lastCheckIn.getFullYear());

    if (isNewDay) {
      const isConsecutiveDay = lastCheckIn && 
        (now.getTime() - lastCheckIn.getTime()) < (24 * 60 * 60 * 1000);

      const newStreakDays = isConsecutiveDay ? ((rewards?.streak_days ?? 0) + 1) : 1;
      
      const { error: updateError } = await client
        .from('user_rewards')
        .update({
          streak_days: newStreakDays,
          last_reward_date: now.toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Award streak points
      if (newStreakDays > 0) {
        const streakPoints = Math.min(newStreakDays * 10, 100); // Cap at 100 points per day
        await this.awardPoints(userId, streakPoints, 'maintaining your daily streak');
      }

      // Check for streak achievement
      if (newStreakDays >= 7) {
        await this.unlockAchievement(userId, 'streak_warrior');
      }
    }
  },

  async unlockAchievement(userId: string, achievementId: string) {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;

    const client = supabase as any;
    const { data: rewards } = await client
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .single();

    const currentAchievements = (rewards?.achievements || []) as unknown as UserAchievement[];
    
    if (!currentAchievements.some(a => a.id === achievementId)) {
      const newAchievement = {
        ...achievement,
        unlockedAt: new Date().toISOString()
      };

      await client
        .from('user_rewards')
        .update({
          achievements: [...currentAchievements, newAchievement] as any
        })
        .eq('user_id', userId);

      // Create achievement notification
      await client.from('notifications').insert({
        user_id: userId,
        type: 'achievement',
        title: 'Achievement Unlocked',
        description: achievement.description,
        metadata: { achievement: achievement.id }
      });

      // Award points for achievement
      await this.awardPoints(userId, 100, `unlocking the ${achievement.title} achievement`);
    }
  },

  getUserLevel(points: number): UserLevel {
    return USER_LEVELS.reduce((highest, level) => {
      if (points >= level.requiredPoints && level.level > highest.level) {
        return level;
      }
      return highest;
    }, USER_LEVELS[0]);
  },

  getNextLevel(currentLevel: number): UserLevel | undefined {
    return USER_LEVELS.find(level => level.level === currentLevel + 1);
  }
};