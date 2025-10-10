import React, { useContext, ReactNode, useState, useEffect } from "react";
import { User, Report, Poll, EvidenceFile } from "../types";
import { useToast } from "@/hooks/use-toast";
import { detectCrisisContent } from "@/utils/crisisDetection";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from '@supabase/supabase-js';

import { AppContext as CoreAppContext, AppContextType, Message } from './appContextCore';

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
        type DBReport = {
          id: string;
          title: string;
          content: string;
          created_at: string;
          anonymous_id?: string;
          user_id?: string;
          institution?: string;
          is_crisis_detected?: boolean;
          sentiment_score?: number;
          moderation_status?: string;
          comments?: DBComment[];
          evidence_files?: DBFile[];
        };

        type DBComment = {
          id: string;
          content: string;
          created_at: string;
          user_id?: string;
          anonymous_id?: string;
          report_id?: string;
          institution?: string;
          sentiment_score?: number;
          moderation_status?: string;
        };

        type DBFile = {
          id: string;
          original_name?: string;
          blurred_url?: string;
          file_type?: string;
          file_size?: number;
          is_blurred?: boolean;
          has_metadata?: boolean;
          uploaded_at?: string;
        };

  const formattedReports: Report[] = (reports as DBReport[]).map(report => ({
          id: report.id,
          title: report.title,
          content: report.content,
          createdAt: report.created_at,
          anonymousId: report.anonymous_id,
          userId: report.user_id,
          institution: report.institution,
          isCrisisDetected: !!report.is_crisis_detected,
          sentimentScore: report.sentiment_score ?? 0,
          moderationStatus: (report.moderation_status as 'pending' | 'approved' | 'flagged' | 'rejected') ?? 'pending',
          comments: (report.comments || []).map((comment: DBComment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.created_at,
            anonymousId: comment.anonymous_id || '',
            reportId: comment.report_id || report.id,
            institution: comment.institution || '',
            sentimentScore: comment.sentiment_score ?? 0,
            moderationStatus: (comment.moderation_status as 'pending' | 'approved' | 'flagged' | 'rejected') ?? 'pending'
          })),
          evidenceFiles: (report.evidence_files || []).map((file: DBFile) => {
            const t = file.file_type === 'image' ? 'image' : 'document';
            return {
              id: file.id,
              originalName: file.original_name || '',
              blurredUrl: file.blurred_url || '',
              type: t as 'image' | 'document',
              uploadedAt: file.uploaded_at || '',
              metadata: {
                size: file.file_size ?? 0,
                isBlurred: !!file.is_blurred,
                hasMetadata: !!file.has_metadata
              }
            } as EvidenceFile;
          })
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
          options: poll.poll_options.map((option: { id: string; text: string; votes: number }) => ({
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

  const sendMessage = async (receiverId: string, content: string) => {
    if (!currentUser) return;
    
    const message = {
      content,
      senderId: currentUser.id,
      receiverId,
      senderAnonymousId: currentUser.anonymousId,
      createdAt: new Date().toISOString(),
    };

    const { error } = await supabase.from('chat_messages').insert([{
      content: message.content,
      sender_id: message.senderId,
      receiver_id: message.receiverId,
      sender_anonymous_id: message.senderAnonymousId,
      created_at: message.createdAt
    }]);
    
    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getMessages = async (otherUserId: string): Promise<Message[]> => {
    if (!currentUser) return [];

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // Transform the data to match our Message interface
    type DBMessage = {
      id: string;
      content: string;
      sender_id: string;
      receiver_id: string;
      created_at: string;
      sender_anonymous_id?: string;
    };

    return (data || []).map((msg: DBMessage) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      createdAt: msg.created_at,
      senderAnonymousId: msg.sender_anonymous_id
    }));
  };

  const value: AppContextType = {
    currentUser,
    reports,
    polls,
    isLoading,
    session,
    supabase,
    setCurrentUser,
    logout,
    createReport,
    addCommentToReport,
    createPoll,
    votePoll,
    scheduleCheckIn,
    completeCheckIn,
    refreshReports,
    sendMessage,
    getMessages,
  };
  return <CoreAppContext.Provider value={value}>{children}</CoreAppContext.Provider>;
};
// Note: useApp hook is provided from hooks/use-app.ts to avoid exporting non-component helpers from this file.