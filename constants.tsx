// FIX: Export User type for use in other files
export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  submittedPrompts?: string[];
  purchasedCollections?: string[];
  savedPrompts?: string[];
  createdCollections?: string[];
  subscriptionTier: 'free' | 'pro';
  role: 'user' | 'admin';
  promptGenerations: number;
  lastGenerationReset: string; // Format 'YYYY-MM'
  promptsSubmittedToday: number;
  lastSubmissionDate: string; // Format 'YYYY-MM-DD'
  hasCompletedTutorial: boolean;
  votes?: { [promptId: string]: 'up' | 'down' };
}

// FIX: Export Comment type for use in other files
export interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: string;
}

// FIX: Export Prompt type for use in other files
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
  comments: Comment[];
  createdAt: string;
  model: AIModel;
  isPublic: boolean;
  status: 'pending' | 'approved' | 'rejected';
  exampleOutput?: string;
}

// FIX: Export Collection type for use in other files
export interface Collection {
  id: string;
  name: string;
  description: string;
  creator: User;
  price: number;
  promptCount: number;
  coverImage: string;
  promptIds: string[];
  status: 'pending' | 'approved' | 'rejected';
}

// FIX: Export HistoryItem type for use in other files
export interface HistoryItem {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  createdAt: string;
}

// FIX: Export AIModel type for use in other files
export type AIModel = 'ChatGPT' | 'Claude' | 'Gemini' | 'MidJourney' | 'DALL-E';
// FIX: Export Category type for use in other files
export type Category = 'Education' | 'Coding' | 'Business' | 'Art' | 'Marketing' | 'Fun';
// FIX: Export Tone type for use in other files
export type Tone = 'Professional' | 'Casual' | 'Creative' | 'Academic' | 'Humorous';

export type FeedbackType = 'Bug Report' | 'Feature Request' | 'General Feedback';

export interface FeedbackItem {
  id: string;
  user: User;
  type: FeedbackType;
  message: string;
  createdAt: string;
  status: 'pending' | 'reviewed';
}