import { createContext } from 'react';
import { User, Report, Poll, EvidenceFile } from '../types';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  senderAnonymousId: string;
}

export interface AppContextType {
  currentUser: User | null;
  reports: Report[];
  polls: Poll[];
  isLoading: boolean;
  session: Session | null;
  supabase: typeof supabase;
  setCurrentUser: (user: User) => void;
  logout: () => void;
  createReport: (title: string, content: string, evidenceFiles?: EvidenceFile[]) => Promise<boolean>;
  addCommentToReport: (reportId: string, content: string) => Promise<boolean>;
  createPoll: (question: string, options: string[], duration: number) => Promise<void>;
  votePoll: (pollId: string, optionId: string) => Promise<void>;
  scheduleCheckIn: () => void;
  completeCheckIn: (response: 'better' | 'same' | 'worse') => void;
  refreshReports: () => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  getMessages: (otherUserId: string) => Promise<Message[]>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
