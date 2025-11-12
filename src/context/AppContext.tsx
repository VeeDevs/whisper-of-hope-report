import React, { useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { User, Report, Poll, EvidenceFile, Comment } from "../types";
import { useToast } from "@/hooks/use-toast";
import { detectCrisisContent } from "@/utils/crisisDetection";
import { supabase } from "@/lib/supabase";
import type { Session } from '@supabase/supabase-js';
import { rewardsService } from '@/services/rewards';
import { UserRewards } from '@/types/rewards';
import { Database, Json } from "@/types/supabase";
import { notificationsService } from '@/services/notifications';

type Notification = Database['public']['Tables']['notifications']['Row'];

import { AppContext, AppContextType, Message } from './appContextCore';

type ProfilesRow = Database['public']['Tables']['profiles']['Row'];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;

      if (profile) {
        const userProfile: ProfilesRow = profile;
        setCurrentUser({
          id: userProfile.id,
          user_id: userProfile.user_id,
          username: userProfile.username,
          anonymous_id: userProfile.anonymous_id,
          created_at: userProfile.created_at,
          institution: userProfile.institution ?? undefined,
          user_type: userProfile.user_type as 'student' | 'working' | 'other',
          age: userProfile.age ?? undefined,
          last_check_in: userProfile.last_check_in ?? undefined
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  const loadUserRewards = useCallback(async (userId: string) => {
    try {
      const rewards = await rewardsService.getUserRewards(userId);
      setUserRewards(rewards as unknown as UserRewards);
    } catch (error) {
      console.error('Error loading user rewards:', error);
    }
  }, []);

  const loadNotifications = useCallback(async (userId: string) => {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(notifications || []);
      setUnreadNotifications((notifications || []).filter((n: any) => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user.id);
          loadUserRewards(session.user.id);
          loadNotifications(session.user.id);
        } else {
          setCurrentUser(null);
          setUserRewards(null);
          setNotifications([]);
          setUnreadNotifications(0);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        loadUserRewards(session.user.id);
        loadNotifications(session.user.id);
      }
      setIsLoading(false);
    });

    loadReports();
    loadPolls();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, loadUserRewards, loadNotifications]);

  const awardPoints = async (points: number, reason: string): Promise<void> => {
    if (!currentUser) return;
    try {
      await rewardsService.awardPoints(currentUser.user_id, points, reason);
      await loadUserRewards(currentUser.user_id);
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const refreshReports = async () => {
    await loadReports();
  };

  const createReport = async (
    title: string,
    content: string,
    evidenceFiles?: EvidenceFile[]
  ): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      const client = supabase as any;
      const reportData = {
        title,
        content,
        user_id: currentUser.user_id,
        anonymous_id: currentUser.anonymous_id,
        is_crisis_detected: detectCrisisContent(content)
      };

      const { error } = await client
        .from('reports')
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;

      await awardPoints(50, 'creating a report');
      await refreshReports();
      return true;
    } catch (error) {
      console.error('Error creating report:', error);
      return false;
    }
  };

  const addCommentToReport = async (reportId: string, content: string): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      const client = supabase as any;
      const commentData = {
        report_id: reportId,
        user_id: currentUser.user_id,
        content,
        anonymous_id: currentUser.anonymous_id
      };

      const { error } = await client
        .from('comments')
        .insert(commentData);

      if (error) throw error;

      await awardPoints(10, 'adding a helpful comment');
      await refreshReports();
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const refreshPolls = async () => {
    await loadPolls();
  };

  const createPoll = async (question: string, options: string[], duration: number): Promise<void> => {
    if (!currentUser) return;

    try {
      const client = supabase as any;
      const pollData = {
        question,
        user_id: currentUser.user_id,
        anonymous_id: currentUser.anonymous_id,
        expires_at: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
        total_votes: 0
      };

      const { data: poll, error: pollError } = await client
        .from('polls')
        .insert(pollData)
        .select()
        .single();

      if (pollError) throw pollError;
      if (!poll) throw new Error("Poll creation failed.");

      const pollOptionsData = options.map((text: string) => ({
        poll_id: poll.id,
        text,
      }));

      const { error: optionsError } = await client
        .from('poll_options')
        .insert(pollOptionsData);

      if (optionsError) throw optionsError;

      const { data: users } = await client
        .from('profiles')
        .select('user_id')
        .neq('user_id', currentUser.user_id);

      if (users) {
        await Promise.all(users.map((user: any) => 
          notificationsService.createNotification({
            user_id: user.user_id,
            type: 'new_poll',
            title: 'New Poll',
            description: `A new poll has been created: "${question}"`,
            metadata: { pollId: poll.id }
          })
        ));
      }

      await refreshPolls();
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const votePoll = async (pollId: string, optionId: string): Promise<void> => {
    if (!currentUser) return;

    try {
      const client = supabase as any;
      const voteData = {
        poll_id: pollId,
        user_id: currentUser.user_id,
        option_id: optionId,
        anonymous_id: currentUser.anonymous_id
      };

      const { error } = await client
        .from('poll_votes')
        .insert(voteData);

      if (error) throw error;

      await awardPoints(15, 'participating in a community poll');
      await refreshPolls();

      const { count } = await supabase
        .from('poll_votes')
        .select('*', { count: 'exact' })
        .eq('user_id', currentUser.user_id);

      if (count === 20) {
        await rewardsService.unlockAchievement(currentUser.user_id, 'poll_master');
      }
    } catch (error) {
      console.error('Error voting on poll:', error);
    }
  };

  const checkDailyStreak = async (): Promise<void> => {
    if (!currentUser) return;
    try {
      await rewardsService.updateStreak(currentUser.user_id);
      await loadUserRewards(currentUser.user_id);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const markNotificationRead = async (notificationId: string): Promise<void> => {
    try {
      const client = supabase as any;
      await client.from('notifications').update({ read: true }).eq('id', notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadNotifications(prev => prev > 0 ? prev - 1 : 0);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, comments(*), evidence_files(*)');

      if (error) throw error;
      if (data) {
        setReports(data as unknown as Report[]);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const loadPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*, poll_options(*)');
      
      if (error) throw error;
      if (data) {
        setPolls(data as unknown as Poll[]);
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

  const scheduleCheckIn = () => {
    toast({
      title: "Check-in scheduled",
      description: "We'll remind you to check in later.",
    });
  };

  const completeCheckIn = (response: 'better' | 'same' | 'worse') => {
    if (!currentUser) return;

    console.log('Check-in response:', response);

    const updatedUser = {
      ...currentUser,
      last_check_in: new Date().toISOString()
    };

    setCurrentUser(updatedUser);

    toast({
      title: "Check-in completed",
      description: "Thank you for letting us know how you're doing.",
    });
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!currentUser) return;
    
    const messageData = {
      content,
      sender_id: currentUser.user_id,
      receiver_id: receiverId,
      sender_anonymous_id: currentUser.anonymous_id,
    };

    const client = supabase as any;
    const { error } = await client.from('chat_messages').insert([messageData]);
    
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
      .or(`and(sender_id.eq.${currentUser.user_id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUser.user_id})`)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return (data || []).map((msg: { id: string; content: string; sender_id: string; receiver_id: string; created_at: string; sender_anonymous_id: string; }) => ({
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
    userRewards,
    notifications,
    unreadNotifications,
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
    refreshPolls,
    sendMessage,
    getMessages,
    awardPoints,
    markNotificationRead,
    checkDailyStreak,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};