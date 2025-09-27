export interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  description: string;
  author: User;
  category: Category;
  tags: string[];
  averageRating: number;
  ratingsCount: number;
  comments: Comment[];
  createdAt: string;
  model: AIModel;
  isPublic: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  badges?: string[];
  submittedPrompts?: string[];
  purchasedCollections?: string[];
  savedPrompts?: string[];
  createdCollections?: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  creator: User;
  price: number;
  promptCount: number;
  coverImage: string;
  promptIds: string[];
}

export type AIModel = 'ChatGPT' | 'Claude' | 'Gemini' | 'MidJourney' | 'DALL-E';
export type Category = 'Education' | 'Coding' | 'Business' | 'Art' | 'Marketing' | 'Fun';