import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { User, Report, Poll, EvidenceFile } from '../types';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  senderAnonymousId: string;
}

import { UserRewards } from '@/types/rewards';

type Notification = any;

export interface AppContextType {
  currentUser: User | null;
  reports: Report[];
  polls: Poll[];
  isLoading: boolean;
  session: Session | null;
  userRewards: UserRewards | null;
  notifications: Notification[];
  unreadNotifications: number;
  supabase: typeof supabase;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  logout: () => void;
  createReport: (title: string, content: string, evidenceFiles?: EvidenceFile[]) => Promise<boolean>;
  addCommentToReport: (reportId: string, content: string) => Promise<boolean>;
  createPoll: (question: string, options: string[], duration: number) => Promise<void>;
  votePoll: (pollId: string, optionId: string) => Promise<void>;
  scheduleCheckIn: () => void;
  completeCheckIn: (response: 'better' | 'same' | 'worse') => void;
  refreshReports: () => Promise<void>;
  refreshPolls: () => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  getMessages: (otherUserId: string) => Promise<Message[]>;
  awardPoints: (points: number, reason: string) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  checkDailyStreak: () => Promise<void>;
  likeReport: (reportId: string) => Promise<void>;
  unlikeReport: (reportId: string) => Promise<void>;
  shareReport: (reportId: string) => Promise<void>;
  userLikedReports: Set<string>;
}

export const AppContext = createContext<AppContextType>({
  currentUser: null,
  reports: [],
  polls: [],
  isLoading: true,
  session: null,
  userRewards: null,
  notifications: [],
  unreadNotifications: 0,
  supabase,
  setCurrentUser: () => {},
  logout: async () => {},
  createReport: async () => false,
  addCommentToReport: async () => false,
  createPoll: async () => {},
  votePoll: async () => {},
  scheduleCheckIn: () => {},
  completeCheckIn: () => {},
  refreshReports: async () => {},
  sendMessage: async () => {},
  getMessages: async () => [],
  refreshPolls: async () => {},
  markNotificationRead: async () => {},
  checkDailyStreak: async () => {},
  awardPoints: async () => {},
  likeReport: async () => {},
  unlikeReport: async () => {},
  shareReport: async () => {},
  userLikedReports: new Set<string>()
});
