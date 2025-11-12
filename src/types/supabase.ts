export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          anonymous_id: string;
          institution: string | null;
          user_type: string | null;
          age: number | null;
          last_check_in: string | null;
          created_at: string;
          updated_at: string;
          friends: string[] | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          anonymous_id: string;
          institution?: string | null;
          user_type?: string | null;
          age?: number | null;
          last_check_in?: string | null;
          created_at?: string;
          updated_at?: string;
          friends?: string[] | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          anonymous_id?: string;
          institution?: string | null;
          user_type?: string | null;
          age?: number | null;
          last_check_in?: string | null;
          created_at?: string;
          updated_at?: string;
          friends?: string[] | null;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          anonymous_id: string;
          institution: string | null;
          is_crisis_detected: boolean;
          sentiment_score: number | null;
          moderation_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          anonymous_id: string;
          institution?: string | null;
          is_crisis_detected?: boolean;
          sentiment_score?: number | null;
          moderation_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          anonymous_id?: string;
          institution?: string | null;
          is_crisis_detected?: boolean;
          sentiment_score?: number | null;
          moderation_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      evidence_files: {
        Row: {
          id: string;
          report_id: string;
          original_name: string;
          blurred_url: string;
          file_type: string;
          file_size: number;
          is_blurred: boolean;
          has_metadata: boolean;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          original_name: string;
          blurred_url: string;
          file_type: string;
          file_size: number;
          is_blurred?: boolean;
          has_metadata?: boolean;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          original_name?: string;
          blurred_url?: string;
          file_type?: string;
          file_size?: number;
          is_blurred?: boolean;
          has_metadata?: boolean;
          uploaded_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          report_id: string;
          user_id: string;
          content: string;
          anonymous_id: string;
          institution: string | null;
          sentiment_score: number | null;
          moderation_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          user_id: string;
          content: string;
          anonymous_id: string;
          institution?: string | null;
          sentiment_score?: number | null;
          moderation_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          user_id?: string;
          content?: string;
          anonymous_id?: string;
          institution?: string | null;
          sentiment_score?: number | null;
          moderation_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      polls: {
        Row: {
          id: string;
          user_id: string;
          question: string;
          anonymous_id: string;
          institution: string | null;
          total_votes: number;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question: string;
          anonymous_id: string;
          institution?: string | null;
          total_votes?: number;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question?: string;
          anonymous_id?: string;
          institution?: string | null;
          total_votes?: number;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          text: string;
          votes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          text: string;
          votes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          text?: string;
          votes?: number;
          created_at?: string;
        };
      };
      poll_votes: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          anonymous_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          anonymous_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_id?: string;
          user_id?: string;
          anonymous_id?: string;
          created_at?: string;
        };
      };
      chat_groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_by: string;
          category: string;
          is_private: boolean;
          member_limit: number | null;
          last_activity: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_by: string;
          category: string;
          is_private?: boolean;
          member_limit?: number | null;
          last_activity?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_by?: string;
          category?: string;
          is_private?: boolean;
          member_limit?: number | null;
          last_activity?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          is_admin: boolean;
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          is_admin?: boolean;
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          is_admin?: boolean;
          joined_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          sender_id: string;
          sender_anonymous_id: string;
          receiver_id: string | null;
          group_id: string | null;
          content: string;
          message_type: string;
          file_url: string | null;
          is_read: boolean;
          reply_to: string | null;
          edited_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          sender_anonymous_id: string;
          receiver_id?: string | null;
          group_id?: string | null;
          content: string;
          message_type?: string;
          file_url?: string | null;
          is_read?: boolean;
          reply_to?: string | null;
          edited_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          sender_anonymous_id?: string;
          receiver_id?: string | null;
          group_id?: string | null;
          content?: string;
          message_type?: string;
          file_url?: string | null;
          is_read?: boolean;
          reply_to?: string | null;
          edited_at?: string | null;
          created_at?: string;
        };
      };
      friends: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          created_at?: string;
        };
      };
      friend_requests: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          sender_anonymous_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          sender_anonymous_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          sender_anonymous_id?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          description: string;
          read: boolean;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          description: string;
          read?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          description?: string;
          read?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      user_rewards: {
        Row: {
          user_id: string;
          points: number;
          current_level: number;
          streak_days: number;
          last_reward_date: string | null;
          achievements: Json | null;
        };
        Insert: {
          user_id: string;
          points?: number;
          current_level?: number;
          streak_days?: number;
          last_reward_date?: string | null;
          achievements?: Json | null;
        };
        Update: {
          user_id?: string;
          points?: number;
          current_level?: number;
          streak_days?: number;
          last_reward_date?: string | null;
          achievements?: Json | null;
        };
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
};
