import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User, Report, Poll, EvidenceFile } from "../types";
import { useToast } from "@/hooks/use-toast";
import { detectCrisisContent } from "@/utils/crisisDetection";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from '@supabase/supabase-js';

interface AppContextType {
  currentUser: User | null;
  reports: Report[];
  polls: Poll[];
  isLoading: boolean;
  session: Session | null;
  setCurrentUser: (user: User) => void;
  logout: () => void;
  createReport: (title: string, content: string, evidenceFiles?: EvidenceFile[]) => Promise<boolean>;
  addCommentToReport: (reportId: string, content: string) => Promise<boolean>;
  createPoll: (question: string, options: string[], duration: number) => Promise<void>;
  votePoll: (pollId: string, optionId: string) => Promise<void>;
  scheduleCheckIn: () => void;
  completeCheckIn: (response: 'better' | 'same' | 'worse') => void;
  refreshReports: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          // Defer user profile fetching to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Load initial data
    loadReports();
    loadPolls();

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profile) {
        setCurrentUser({
          id: profile.user_id,
          username: profile.username,
          anonymousId: profile.anonymous_id,
          createdAt: profile.created_at,
          institution: profile.institution,
          userType: profile.user_type as 'student' | 'working' | 'other',
          age: profile.age,
          lastCheckIn: profile.last_check_in
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const loadReports = async () => {
    try {
      const { data: reports } = await supabase
        .from('reports')
        .select(`
          *,
          comments (
            id,
            content,
            created_at,
            anonymous_id,
            institution,
            sentiment_score,
            moderation_status,
            report_id,
            user_id
          ),
          evidence_files (
            id,
            original_name,
            blurred_url,
            file_type,
            file_size,
            is_blurred,
            has_metadata,
            uploaded_at
          )
        `)
        .order('created_at', { ascending: false });

      if (reports) {
        const formattedReports: Report[] = reports.map(report => ({
          id: report.id,
          title: report.title,
          content: report.content,
          createdAt: report.created_at,
          anonymousId: report.anonymous_id,
          institution: report.institution,
          isCrisisDetected: report.is_crisis_detected,
          sentimentScore: report.sentiment_score,
          moderationStatus: report.moderation_status as 'pending' | 'approved' | 'flagged' | 'rejected',
          comments: report.comments.map((comment: any) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.created_at,
            anonymousId: comment.anonymous_id,
            reportId: comment.report_id,
            institution: comment.institution,
            sentimentScore: comment.sentiment_score,
            moderationStatus: comment.moderation_status as 'pending' | 'approved' | 'flagged' | 'rejected'
          })),
          evidenceFiles: report.evidence_files.map((file: any) => ({
            id: file.id,
            originalName: file.original_name,
            blurredUrl: file.blurred_url,
            type: file.file_type,
            uploadedAt: file.uploaded_at,
            metadata: {
              size: file.file_size,
              isBlurred: file.is_blurred,
              hasMetadata: file.has_metadata
            }
          }))
        }));
        setReports(formattedReports);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const loadPolls = async () => {
    try {
      const { data: polls } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options (
            id,
            text,
            votes
          )
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (polls) {
        const formattedPolls: Poll[] = polls.map(poll => ({
          id: poll.id,
          question: poll.question,
          createdAt: poll.created_at,
          anonymousId: poll.anonymous_id,
          institution: poll.institution,
          expiresAt: poll.expires_at,
          totalVotes: poll.total_votes,
          options: poll.poll_options.map((option: any) => ({
            id: option.id,
            text: option.text,
            votes: option.votes
          }))
        }));
        setPolls(formattedPolls);
      }
    } catch (error) {
      console.error('Error loading polls:', error);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const createReport = async (title: string, content: string, evidenceFiles?: EvidenceFile[]): Promise<boolean> => {
    if (!currentUser || !session?.user) return false;

    try {
      const isCrisisDetected = detectCrisisContent(title + " " + content);
      
      const { data: report, error } = await supabase
        .from('reports')
        .insert({
          user_id: session.user.id,
          title,
          content,
          anonymous_id: currentUser.anonymousId,
          institution: currentUser.institution,
          is_crisis_detected: isCrisisDetected
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create report. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (isCrisisDetected) {
        toast({
          title: "Crisis Detected",
          description: "Your report indicates a crisis situation. Please reach out for immediate help if needed.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Report submitted",
          description: "Your anonymous report has been submitted successfully.",
        });
      }

      await loadReports();
      return isCrisisDetected;
    } catch (error) {
      console.error('Error creating report:', error);
      return false;
    }
  };

  const addCommentToReport = async (reportId: string, content: string): Promise<boolean> => {
    if (!currentUser || !session?.user) return false;

    try {
      const isCrisisDetected = detectCrisisContent(content);

      const { error } = await supabase
        .from('comments')
        .insert({
          report_id: reportId,
          user_id: session.user.id,
          content,
          anonymous_id: currentUser.anonymousId,
          institution: currentUser.institution
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Comment added",
        description: "Your anonymous comment has been added.",
      });

      await loadReports();
      return isCrisisDetected;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const createPoll = async (question: string, options: string[], duration: number): Promise<void> => {
    if (!currentUser || !session?.user) return;

    try {
      const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();

      const { data: poll, error } = await supabase
        .from('polls')
        .insert({
          user_id: session.user.id,
          question,
          anonymous_id: currentUser.anonymousId,
          institution: currentUser.institution,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create poll. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Insert poll options
      const pollOptionsData = options.map(option => ({
        poll_id: poll.id,
        text: option
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(pollOptionsData);

      if (optionsError) {
        toast({
          title: "Error",
          description: "Failed to create poll options. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Poll created",
        description: "Your anonymous poll has been created successfully.",
      });

      await loadPolls();
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const votePoll = async (pollId: string, optionId: string): Promise<void> => {
    if (!currentUser || !session?.user) return;

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('poll_votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', session.user.id)
        .single();

      if (existingVote) {
        toast({
          title: "Already voted",
          description: "You have already voted on this poll.",
          variant: "destructive",
        });
        return;
      }

      // Insert vote
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: session.user.id,
          anonymous_id: currentUser.anonymousId
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to vote. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update option vote count and poll total votes
      await supabase.rpc('increment_poll_option_votes', { option_id: optionId });
      await supabase.rpc('increment_poll_total_votes', { poll_id: pollId });

      toast({
        title: "Vote recorded",
        description: "Thank you for participating in the poll.",
      });
      
      await loadPolls();
    } catch (error) {
      console.error('Error voting on poll:', error);
    }
  };

  const scheduleCheckIn = () => {
    // Implementation for scheduling check-ins
    toast({
      title: "Check-in scheduled",
      description: "We'll remind you to check in later.",
    });
  };

  const completeCheckIn = (response: 'better' | 'same' | 'worse') => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      lastCheckIn: new Date().toISOString()
    };

    setCurrentUser(updatedUser);

    toast({
      title: "Check-in completed",
      description: "Thank you for letting us know how you're doing.",
    });
  };

  const refreshReports = async () => {
    await loadReports();
  };

  const value = {
    currentUser,
    session,
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