
export interface User {
  id: string;
  username: string;
  anonymousId: string;
  createdAt: string;
  institution?: string;
  userType?: 'student' | 'working' | 'other';
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
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  anonymousId: string;
  reportId: string;
  institution?: string;
}
