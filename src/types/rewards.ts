export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface UserLevel {
  level: number;
  title: string;
  requiredPoints: number;
  perks: string[];
}

export interface UserRewards {
  user_id: string;
  points: number;
  current_level: number;
  streak_days: number;
  last_check_in: string | null;
  achievements: UserAchievement[];
}

export const ACHIEVEMENTS: UserAchievement[] = [
  {
    id: 'first_report',
    title: 'First Steps',
    description: 'Submit your first report',
    icon: 'flag'
  },
  {
    id: 'helpful_member',
    title: 'Helpful Member',
    description: 'Receive 10 helpful votes on your comments',
    icon: 'heart'
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Maintain a 7-day check-in streak',
    icon: 'flame'
  },
  {
    id: 'poll_master',
    title: 'Poll Master',
    description: 'Participate in 20 community polls',
    icon: 'vote'
  }
];

export const USER_LEVELS: UserLevel[] = [
  {
    level: 1,
    title: 'Newcomer',
    requiredPoints: 0,
    perks: ['Basic profile features']
  },
  {
    level: 2,
    title: 'Active Member',
    requiredPoints: 100,
    perks: ['Custom profile badge', 'Anonymous messaging']
  },
  {
    level: 3,
    title: 'Trusted Advisor',
    requiredPoints: 500,
    perks: ['Create polls', 'Priority support']
  },
  {
    level: 4,
    title: 'Community Guardian',
    requiredPoints: 1000,
    perks: ['Moderation tools', 'Special profile themes']
  },
  {
    level: 5,
    title: 'Hope Champion',
    requiredPoints: 2500,
    perks: ['Create private groups', 'Advanced analytics']
  }
];