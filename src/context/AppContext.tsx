import React, { useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { User, Report, Poll, EvidenceFile, Comment } from "../types";
import { useToast } from "@/hooks/use-toast";
import { detectCrisisContent } from "@/utils/crisisDetection";
import { supabase, supabaseError } from "@/lib/supabase";
import type { Session } from '@supabase/supabase-js';
import { rewardsService } from '@/services/rewards';
import { UserRewards } from '@/types/rewards';

import { AppContext, AppContextType, Message } from './appContextCore';

// Type definitions for DB rows
type Notification = any;
type ProfilesRow = any;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userLikedReports, setUserLikedReports] = useState<Set<string>>(new Set());
  const [sharesCountMap, setSharesCountMap] = useState<Map<string, number>>(new Map());
  const [likesCountMap, setLikesCountMap] = useState<Map<string, number>>(new Map());
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!supabase) {
      console.warn('⚠️ Supabase not available - skipping profile fetch');
      return;
    }
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
    if (!supabase) {
      console.warn('⚠️ Supabase not available - skipping notifications fetch');
      return;
    }
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

  const loadLikes = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await (supabase as any)
        .from('likes')
        .select('id, report_id, user_id');
      if (error) throw error;
      const counts = new Map<string, number>();
      const userLiked = new Set<string>();
      (data || []).forEach((row: { id: string; report_id: string; user_id: string }) => {
        counts.set(row.report_id, (counts.get(row.report_id) || 0) + 1);
        if (currentUser && row.user_id === currentUser.user_id) {
          userLiked.add(row.report_id);
        }
      });
      setLikesCountMap(counts);
      setUserLikedReports(userLiked);
      setReports(prev => prev.map(r => ({ ...r, likes_count: counts.get(r.id) || 0 })));
    } catch (err) {
      console.error('Error loading likes:', err);
    }
  }, [currentUser]);

  const loadShares = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await (supabase as any)
        .from('shares')
        .select('id, report_id');
      if (error) throw error;
      const counts = new Map<string, number>();
      (data || []).forEach((row: { id: string; report_id: string }) => {
        counts.set(row.report_id, (counts.get(row.report_id) || 0) + 1);
      });
      setSharesCountMap(counts);
    } catch (err) {
      console.error('Error loading shares:', err);
    }
  }, []);

  

  const loadReports = useCallback(async () => {
    if (!supabase) {
      console.warn('⚠️ Supabase not available - skipping reports fetch');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, comments(*), evidence_files(*)');

      if (error) throw error;
      if (data) {
        const baseReports = data as unknown as Report[];
        const withCounts = baseReports.map((r: Report) => ({
          ...r,
          likes_count: likesCountMap.get(r.id) || 0,
          shares_count: sharesCountMap.get(r.id) || 0,
        }));
        setReports(withCounts);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  }, [likesCountMap, sharesCountMap]);

  const refreshReports = useCallback(async () => {
    await loadReports();
  }, [loadReports]);

  const loadPolls = useCallback(async () => {
    if (!supabase) {
      console.warn('⚠️ Supabase not available - skipping polls fetch');
      return;
    }
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
  }, []);

  const sendQuoteOfDayNotification = async (userId: string) => {
    if (!supabase) return;
    try {
      const today = new Date().toISOString().slice(0, 10);
      const key = `qod_sent_${userId}`;
      const last = localStorage.getItem(key);
      if (last === today) return;
      const res = await fetch('https://zenquotes.io/api/today');
      if (res.ok) {
        const data = await res.json();
        const item = Array.isArray(data) ? data[0] : data;
        const content = item?.q ? `${item.q} — ${item.a || 'Unknown'}` : '';
        if (content) {
          const client = supabase as any;
          await client.from('notifications').insert({ user_id: userId, content, type: 'qod', read: false });
          localStorage.setItem(key, today);
        }
      }
    } catch (_) { void 0 }
  };

  useEffect(() => {
    if (!supabase) {
      console.warn('⚠️ Supabase client not available - skipping auth initialization');
      setIsLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user.id);
          loadUserRewards(session.user.id);
          loadNotifications(session.user.id);
          await sendQuoteOfDayNotification(session.user.id);
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
        sendQuoteOfDayNotification(session.user.id);
      }
      setIsLoading(false);
    });


    // Realtime subscriptions for comments, likes, and shares
    if (supabase) {
      const channel = (supabase as any).channel('realtime-reports');

      channel
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'comments' },
          (_payload: any) => {
            refreshReports();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'likes' },
          async (_payload: any) => {
            await loadLikes();
            refreshReports();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'shares' },
          async (_payload: any) => {
            await loadShares();
            refreshReports();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
        channel.unsubscribe();
      };
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, loadUserRewards, loadNotifications, refreshReports, loadLikes, loadShares]);

  useEffect(() => {
    if (session) {
      loadReports();
      loadPolls();
    }
  }, [session, loadReports, loadPolls]);

  const awardPoints = async (points: number, reason: string): Promise<void> => {
    if (!currentUser) return;
    try {
      await rewardsService.awardPoints(currentUser.user_id, points, reason);
      await loadUserRewards(currentUser.user_id);
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  

  const createReport = async (
    title: string,
    content: string,
    evidenceFiles?: EvidenceFile[]
  ): Promise<boolean> => {
    if (!currentUser) return false;
    if (!supabase) {
      console.warn('⚠️ Supabase not available - cannot create report');
      return false;
    }

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
    if (!supabase) {
      console.warn('⚠️ Supabase not available - cannot add comment');
      return false;
    }

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
        // Notification creation would go here
        // Currently handled through Supabase triggers
      }

      await refreshPolls();
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const votePoll = async (pollId: string, optionId: string): Promise<void> => {
    if (!currentUser) return;
    if (!supabase) {
      console.warn('⚠️ Supabase not available - cannot vote on poll');
      return;
    }

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
    if (!supabase) {
      console.warn('⚠️ Supabase not available - cannot mark notification as read');
      return;
    }
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

  

  

  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
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

  

  useEffect(() => {
    loadLikes();
    loadShares();
  }, [loadLikes, loadShares]);

  const likeReport = async (reportId: string): Promise<void> => {
    if (!currentUser || !supabase) return;
    try {
      const client = supabase as any;
      const { error } = await client
        .from('likes')
        .insert({ report_id: reportId, user_id: currentUser.user_id });
      if (error) throw error;
      await loadLikes();
    } catch (err) {
      console.error('Error liking report:', err);
      toast({ title: 'Error', description: 'Could not like the report', variant: 'destructive' });
    }
  };

  const unlikeReport = async (reportId: string): Promise<void> => {
    if (!currentUser || !supabase) return;
    try {
      const client = supabase as any;
      const { error } = await client
        .from('likes')
        .delete()
        .eq('report_id', reportId)
        .eq('user_id', currentUser.user_id);
      if (error) throw error;
      await loadLikes();
    } catch (err) {
      console.error('Error unliking report:', err);
      toast({ title: 'Error', description: 'Could not unlike the report', variant: 'destructive' });
    }
  };

  

  const shareReport = async (reportId: string): Promise<void> => {
    if (!currentUser || !supabase) return;
    try {
      const client = supabase as any;
      const { error } = await client
        .from('shares')
        .insert({ report_id: reportId, user_id: currentUser.user_id });
      if (error) throw error;
      await loadShares();
    } catch (err) {
      console.error('Error sharing report:', err);
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
    if (!supabase) {
      console.warn('⚠️ Supabase not available - cannot send message');
      return;
    }
    
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

    if (!supabase) {
      console.warn('⚠️ Supabase not available - cannot fetch messages');
      return [];
    }

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
    likeReport,
    unlikeReport,
    shareReport,
    userLikedReports,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
