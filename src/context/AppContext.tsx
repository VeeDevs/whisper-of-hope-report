import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User, Report, Poll, PollVote, EvidenceFile } from "../types";
import { 
  getCurrentUser, 
  getReports, 
  saveReport, 
  addComment,
  logoutUser
} from "../services/storage";
import { useToast } from "@/hooks/use-toast";
import { detectCrisisContent } from "@/utils/crisisDetection";

interface AppContextType {
  currentUser: User | null;
  reports: Report[];
  polls: Poll[];
  isLoading: boolean;
  setCurrentUser: (user: User) => void;
  logout: () => void;
  createReport: (title: string, content: string, evidenceFiles?: EvidenceFile[]) => boolean;
  addCommentToReport: (reportId: string, content: string) => boolean;
  createPoll: (question: string, options: string[], duration: number) => void;
  votePoll: (pollId: string, optionId: string) => void;
  scheduleCheckIn: () => void;
  completeCheckIn: (response: 'better' | 'same' | 'worse') => void;
  refreshReports: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load user and reports from storage on initial render
    const user = getCurrentUser();
    setCurrentUser(user);
    refreshReports();
    setIsLoading(false);
  }, []);

  const refreshReports = () => {
    const loadedReports = getReports();
    setReports(loadedReports);
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const createReport = (title: string, content: string, evidenceFiles?: EvidenceFile[]): boolean => {
    if (!currentUser) return false;

    const isCrisisDetected = detectCrisisContent(title + " " + content);

    const newReport: Report = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      anonymousId: currentUser.anonymousId,
      institution: currentUser.institution,
      comments: [],
      isCrisisDetected,
      evidenceFiles: evidenceFiles || [],
    };

    saveReport(newReport);
    refreshReports();
    toast({
      title: "Report submitted",
      description: "Your anonymous report has been submitted successfully.",
    });

    return isCrisisDetected;
  };

  const addCommentToReport = (reportId: string, content: string): boolean => {
    if (!currentUser) return false;

    const isCrisisDetected = detectCrisisContent(content);

    const newComment = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      anonymousId: currentUser.anonymousId,
      institution: currentUser.institution,
      reportId,
    };

    addComment(reportId, newComment);
    refreshReports();
    toast({
      title: "Comment added",
      description: "Your anonymous comment has been added.",
    });

    return isCrisisDetected;
  };

  const createPoll = (question: string, options: string[], duration: number) => {
    if (!currentUser) return;

    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options: options.map((text, index) => ({
        id: `option_${index}`,
        text,
        votes: 0
      })),
      createdAt: new Date().toISOString(),
      anonymousId: currentUser.anonymousId,
      institution: currentUser.institution,
      expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      totalVotes: 0
    };

    // Save to localStorage (you'll want to update storage.ts)
    const existingPolls = JSON.parse(localStorage.getItem('whisper_polls') || '[]');
    existingPolls.unshift(newPoll);
    localStorage.setItem('whisper_polls', JSON.stringify(existingPolls));
    
    setPolls(prev => [newPoll, ...prev]);
    
    toast({
      title: "Poll created",
      description: "Your anonymous poll has been created successfully.",
    });
  };

  const votePoll = (pollId: string, optionId: string) => {
    if (!currentUser) return;

    // Check if user already voted
    const existingVotes = JSON.parse(localStorage.getItem('whisper_poll_votes') || '[]');
    const hasVoted = existingVotes.some((vote: PollVote) => 
      vote.pollId === pollId && vote.anonymousId === currentUser.anonymousId
    );

    if (hasVoted) {
      toast({
        title: "Already voted",
        description: "You have already voted on this poll.",
        variant: "destructive",
      });
      return;
    }

    // Record vote
    const newVote: PollVote = {
      pollId,
      optionId,
      anonymousId: currentUser.anonymousId,
      createdAt: new Date().toISOString()
    };

    existingVotes.push(newVote);
    localStorage.setItem('whisper_poll_votes', JSON.stringify(existingVotes));

    // Update poll counts
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => 
            option.id === optionId 
              ? { ...option, votes: option.votes + 1 }
              : option
          ),
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    }));

    // Update localStorage
    const existingPolls = JSON.parse(localStorage.getItem('whisper_polls') || '[]');
    const updatedPolls = existingPolls.map((poll: Poll) => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => 
            option.id === optionId 
              ? { ...option, votes: option.votes + 1 }
              : option
          ),
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    });
    localStorage.setItem('whisper_polls', JSON.stringify(updatedPolls));

    toast({
      title: "Vote recorded",
      description: "Thank you for participating in the poll.",
    });
  };

  const scheduleCheckIn = () => {
    // Implementation for scheduling check-ins
  };

  const completeCheckIn = (response: 'better' | 'same' | 'worse') => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      lastCheckIn: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('whisper_current_user', JSON.stringify(updatedUser));

    toast({
      title: "Check-in completed",
      description: "Thank you for letting us know how you're doing.",
    });
  };

  // Load polls on mount
  useEffect(() => {
    const loadedPolls = JSON.parse(localStorage.getItem('whisper_polls') || '[]');
    setPolls(loadedPolls);
  }, []);

  const value = {
    currentUser,
    reports,
    polls,
    isLoading,
    setCurrentUser,
    logout,
    createReport,
    addCommentToReport,
    createPoll,
    votePoll,
    scheduleCheckIn,
    completeCheckIn,
    refreshReports,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
