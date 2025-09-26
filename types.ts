export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  description: string;
  author: User;
  category: Category;
  tags: string[];
  upvotes: number;
  downvotes: number;
  createdAt: string;
  model: AIModel;
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