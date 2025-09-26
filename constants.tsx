import { AIModel, Category, Collection, Prompt, User } from './types';

export const AI_MODELS: AIModel[] = ['ChatGPT', 'Claude', 'Gemini', 'MidJourney', 'DALL-E'];
export const CATEGORIES: Category[] = ['Education', 'Coding', 'Business', 'Art', 'Marketing', 'Fun'];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Doe', avatar: 'https://i.pravatar.cc/150?u=u1', bio: 'Prompt engineering enthusiast.', badges: ['Prompt Master', 'Top Creator'], submittedPrompts: ['p1', 'p3'], purchasedCollections: ['c2'], savedPrompts: ['p2'] },
  { id: 'u2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=u2', bio: 'AI Artist and developer.', badges: ['Community Star'], submittedPrompts: ['p2'], purchasedCollections: [], savedPrompts: [] },
  { id: 'u3', name: 'Sam Wilson', avatar: 'https://i.pravatar.cc/150?u=u3', submittedPrompts: [], purchasedCollections: [], savedPrompts: [] },
];

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'p1',
    title: 'Ultimate Essay Writing Assistant',
    prompt: 'Act as an expert academic writer. I will provide you with a topic and key points. Your task is to structure a compelling five-paragraph essay with a clear introduction, three supporting body paragraphs, and a strong conclusion. Ensure smooth transitions and sophisticated vocabulary.',
    description: 'A powerful prompt to generate well-structured essays on any topic. Perfect for students and researchers.',
    author: MOCK_USERS[0],
    category: 'Education',
    tags: ['Essay Writing', 'Academic', 'Students'],
    upvotes: 125,
    downvotes: 5,
    createdAt: '2023-10-26T10:00:00Z',
    model: 'ChatGPT',
  },
  {
    id: 'p2',
    title: 'Photorealistic Sci-Fi Cityscape',
    prompt: 'cinematic still of a sprawling cyberpunk cityscape at night, neon signs reflecting on wet asphalt, flying vehicles whizzing by, towering holographic advertisements, volumetric lighting, photorealistic, octane render, trending on artstation --ar 16:9 --v 5.2',
    description: 'Generate breathtaking, detailed sci-fi cityscapes with a cinematic feel using MidJourney.',
    author: MOCK_USERS[1],
    category: 'Art',
    tags: ['MidJourney', 'Sci-Fi', 'Art'],
    upvotes: 230,
    downvotes: 3,
    createdAt: '2023-10-25T14:30:00Z',
    model: 'MidJourney',
  },
  {
    id: 'p3',
    title: 'Python Code Refactoring Expert',
    prompt: 'You are a senior Python developer specializing in clean code and refactoring. I will provide a Python script. Your task is to analyze it, identify areas for improvement, and provide a refactored version. Explain the changes you made and why they improve the code\'s readability, performance, and maintainability.',
    description: 'Submit your Python scripts to get expert feedback and refactoring suggestions to improve your code quality.',
    author: MOCK_USERS[0],
    category: 'Coding',
    tags: ['Python', 'Developer', 'Refactoring'],
    upvotes: 98,
    downvotes: 2,
    createdAt: '2023-10-24T09:00:00Z',
    model: 'Gemini',
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
    {
        id: 'c1',
        name: 'Top 10 Student Prompts',
        description: 'A curated collection of essential prompts for academic success, from essay writing to research assistance.',
        creator: MOCK_USERS[0],
        price: 9.99,
        promptCount: 1,
        coverImage: 'https://picsum.photos/seed/c1/600/400',
        promptIds: ['p1']
    },
    {
        id: 'c2',
        name: 'MidJourney Master Pack',
        description: 'Unlock stunning AI art with this pack of 25 advanced prompts for MidJourney, covering various styles.',
        creator: MOCK_USERS[1],
        price: 19.99,
        promptCount: 1,
        coverImage: 'https://picsum.photos/seed/c2/600/400',
        promptIds: ['p2']
    },
    {
        id: 'c3',
        name: 'Business Growth Toolkit',
        description: 'Supercharge your marketing and business strategy with these 15 powerful prompts for entrepreneurs.',
        creator: MOCK_USERS[0],
        price: 14.99,
        promptCount: 1,
        coverImage: 'https://picsum.photos/seed/c3/600/400',
        promptIds: ['p3']
    }
];