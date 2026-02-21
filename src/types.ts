export interface User {
  id: string;
  name: string;
  email?: string | null;
  avatar: string;
  role: string;
  department: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
  };
  resumeUrl?: string;
  createdAt?: string;
}

export interface Post {
  id: string;
  title: string;
  description?: string;
  content: string;
  communityId: string;
  communityName?: string;
  userId?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  members: string[];
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
}