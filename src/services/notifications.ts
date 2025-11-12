import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export const notificationsService = {
  async createNotification(data: {
    user_id: string;
    type: string;
    title: string;
    description: string;
    metadata?: Record<string, unknown>;
  }) {
    try {
      const client = supabase as any;
      const notificationData: NotificationInsert = {
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        description: data.description,
        read: false,
        metadata: data.metadata as unknown as any,
      };

      const { error } = await client
        .from('notifications')
        .insert(notificationData);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  },

  async markAsRead(notificationId: string) {
    try {
      const client = supabase as any;
      const { error } = await client
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  async getNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
};
