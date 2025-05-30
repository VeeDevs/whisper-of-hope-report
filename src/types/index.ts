
export interface User {
  id: string;
  username: string;
  anonymousId: string;
  createdAt: string;
  institution?: string;
  userType?: 'student' | 'working' | 'other';
  age?: number;
  lastCheckIn?: string;
  friends?: string[]; // Array of user IDs
  blockedUsers?: string[]; // Array of user IDs
}

export interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  anonymousId: string;
  institution?: string;
  comments: Comment[];
  isCrisisDetected?: boolean;
  sentimentScore?: number;
  moderationStatus?: 'pending' | 'approved' | 'flagged' | 'rejected';
  evidenceFiles?: EvidenceFile[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  anonymousId: string;
  reportId: string;
  institution?: string;
  sentimentScore?: number;
  moderationStatus?: 'pending' | 'approved' | 'flagged' | 'rejected';
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: string;
  anonymousId: string;
  institution?: string;
  expiresAt: string;
  totalVotes: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollVote {
  pollId: string;
  optionId: string;
  anonymousId: string;
  createdAt: string;
}

export interface EvidenceFile {
  id: string;
  originalName: string;
  blurredUrl: string;
  type: 'image' | 'document';
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
