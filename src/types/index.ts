
export interface User {
  id: string;
  user_id: string;
  username: string;
  anonymous_id: string;
  created_at: string;
  institution?: string;
  user_type: 'student' | 'working' | 'other';
  age?: number;
  last_check_in?: string;
}

export interface Report {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  anonymous_id: string;
  institution?: string;
  is_crisis_detected: boolean;
  evidence_files: EvidenceFile[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  report_id: string;
  user_id: string;
  content: string;
  created_at: string;
  anonymous_id: string;
}

export interface Poll {
  id: string;
  question: string;
  user_id: string;
  created_at: string;
  expires_at: string;
  anonymous_id: string;
  institution?: string;
  total_votes: number;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_id: string;
  created_at: string;
}

export interface EvidenceFile {
  id: string;
  originalName: string;
  blurredUrl: string;
  type: 'image' | 'document' | 'video';
  uploadedAt: string;
  metadata: {
    size: number;
    isBlurred: boolean;
    hasMetadata: boolean;
  };
}

export interface AgeSpecificResource {
  id: string;
  title: string;
  description: string;
  url: string;
  ageRange: {
    min: number;
    max: number;
  };
  category: 'legal' | 'mental-health' | 'educational' | 'emergency';
  language: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  scheduledDate: string;
  completed: boolean;
  response?: 'better' | 'same' | 'worse';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderAnonymousId: string;
  receiverId?: string; // For direct messages
  groupId?: string; // For group messages
  content: string;
  createdAt: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  editedAt?: string;
  replyTo?: string; // ID of message being replied to
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  members: string[]; // Array of user IDs
  admins: string[]; // Array of user IDs
  category: 'support' | 'study' | 'general' | 'crisis';
  isPrivate: boolean;
  lastActivity: string;
  memberLimit?: number;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderAnonymousId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  message?: string;
}
