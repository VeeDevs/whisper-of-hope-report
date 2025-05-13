
export interface User {
  id: string;
  username: string;
  anonymousId: string;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  anonymousId: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  anonymousId: string;
  reportId: string;
}
