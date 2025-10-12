import { AIModel, Category, Collection, Prompt, User, Tone } from './types';

export const AI_MODELS: AIModel[] = ['ChatGPT', 'Claude', 'Gemini', 'MidJourney', 'DALL-E'];
export const CATEGORIES: Category[] = ['Education', 'Coding', 'Business', 'Art', 'Marketing', 'Fun'];
export const TONES: Tone[] = ['Professional', 'Casual', 'Creative', 'Academic', 'Humorous'];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Doe', avatar: 'https://i.pravatar.cc/150?u=u1', bio: 'Prompt engineering enthusiast.', badges: ['Prompt Master', 'Top Creator'], submittedPrompts: ['p1', 'p3', 'p5'], purchasedCollections: ['c2'], savedPrompts: ['p2'], createdCollections: ['c1', 'c3'] },
  { id: 'u2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=u2', bio: 'AI Artist and developer.', badges: ['Community Star'], submittedPrompts: ['p2', 'p4', 'p6', 'p7'], purchasedCollections: [], savedPrompts: [], createdCollections: ['c2'] },
  { id: 'u3', name: 'Sam Wilson', avatar: 'https://i.pravatar.cc/150?u=u3', submittedPrompts: [], purchasedCollections: [], savedPrompts: [], createdCollections: [] },
];

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'p1',
    title: 'Ultimate Essay Writing Assistant',
    prompt: 'Persona: Act as an expert academic writer with a PhD in literature.\n\nTask: Structure a compelling 5-paragraph argumentative essay based on a topic and 3 key points I will provide.\n\nFormat Requirements:\n1.  **Introduction:** Begin with a compelling hook, provide necessary background information, and end with a clear, debatable thesis statement.\n2.  **Body Paragraphs (3):** Each paragraph must start with a topic sentence that directly supports the thesis. Follow with evidence/explanation and end with a concluding sentence that transitions to the next paragraph.\n3.  **Conclusion:** Restate the thesis in a new way, summarize the main points from the body paragraphs, and offer a final, thought-provoking statement on the topic\'s broader implications.\n\nConstraints: Maintain a formal academic tone throughout. Use sophisticated vocabulary and complex sentence structures appropriately. Ensure seamless transitions between all paragraphs. Use placeholder citations like `(Author, Year)` where evidence would be needed.',
    description: 'A highly structured prompt for generating sophisticated, five-paragraph argumentative essays with a formal academic tone and proper formatting.',
    author: MOCK_USERS[0],
    category: 'Education',
    tags: ['Essay Writing', 'Academic', 'Students', 'Structured'],
    averageRating: 4.8,
    ratingsCount: 130,
    comments: [
      { id: 'c1', author: MOCK_USERS[1], text: 'This prompt is a lifesaver for my college papers!', createdAt: '2023-10-26T12:00:00Z' },
      { id: 'c2', author: MOCK_USERS[2], text: 'Great structure, very easy to use.', createdAt: '2023-10-26T15:00:00Z' }
    ],
    createdAt: '2023-10-26T10:00:00Z',
    model: 'ChatGPT',
    isPublic: true,
    exampleOutput: '### Topic: The Role of Artificial Intelligence in the Future Workforce\n\n**Introduction:**\nThe rapid advancement of artificial intelligence has sparked a crucial debate about its role in the future of the workforce. While some herald AI as a catalyst for unprecedented productivity and innovation, others voice concerns about mass job displacement and economic inequality. This essay argues that while AI will undoubtedly reshape the labor market, its primary effect will be job transformation rather than outright elimination, necessitating a proactive approach to education and reskilling to mitigate potential disruptions.\n\n**Body Paragraph 1:**\nContrary to dystopian fears, historical precedent with technological revolutions suggests that AI is more likely to augment human capabilities than render them obsolete. The introduction of computers, for instance, did not lead to the collapse of the office workforce but rather created new roles centered around information management and digital literacy (Author, Year). Similarly, AI is poised to take over repetitive, data-intensive tasks, freeing human workers to focus on complex problem-solving, creativity, and strategic thinking—skills where human intelligence currently maintains a significant advantage. For example, in the medical field, AI can analyze thousands of scans to detect anomalies far faster than a human radiologist, but the final diagnosis, patient communication, and treatment plan remain firmly in the hands of the human expert (Author, Year). This collaborative model demonstrates a future of human-AI partnership, not replacement.\n\n**Conclusion:**\nIn conclusion, the integration of artificial intelligence into the workforce represents not an end to human labor, but a fundamental evolution of it. By summarizing the key arguments—that AI will transform jobs by augmenting human skills, that it will create new economic sectors, and that the primary challenge lies in societal adaptation—it becomes clear that the narrative of mass unemployment is an oversimplification. The true path forward involves a robust commitment to lifelong learning, developing adaptable education systems, and creating social safety nets to support workers through this transition. Ultimately, the future of work will not be defined by humanity versus machine, but by how effectively humanity works with its new, powerful tools.'
  },
  {
    id: 'p2',
    title: 'Photorealistic Sci-Fi Cityscape',
    prompt: 'Subject: A sprawling cyberpunk megastructure city at twilight, during a gentle rain.\n\nDetails: Intricate layers of architecture, colossal holographic advertisements featuring geishas and dragons, streams of flying vehicles leaving light trails. A lone figure in a trench coat stands on a high-tech balcony overlooking the city.\n\nStyle: Photorealistic, hyper-detailed, cinematic lighting, dramatic atmosphere, inspired by Blade Runner 2049 and Ghost in the Shell.\n\nTechnical Details: octane render, volumetric lighting, god rays, sharp focus, trending on ArtStation, 8k resolution.\n\nParameters: --ar 16:9 --v 5.2 --style raw',
    description: 'Craft breathtaking, hyper-detailed cyberpunk cityscapes inspired by Blade Runner. This prompt is optimized for cinematic lighting and a dramatic, rainy atmosphere.',
    author: MOCK_USERS[1],
    category: 'Art',
    tags: ['MidJourney', 'Sci-Fi', 'Cyberpunk', 'Cinematic'],
    averageRating: 4.9,
    ratingsCount: 233,
    comments: [],
    createdAt: '2023-10-25T14:30:00Z',
    model: 'MidJourney',
    isPublic: true,
    exampleOutput: 'https://picsum.photos/seed/p2-cyberpunk/800/450'
  },
  {
    id: 'p3',
    title: 'Python Code Refactoring Expert',
    prompt: 'Persona: Act as a principal software engineer with 15+ years of experience, specializing in Python and promoting best practices like SOLID, DRY, and KISS. You are a stickler for PEP 8 compliance.\n\nTask: I will provide you with a Python script. Your task is to perform a thorough code review and provide a refactored version.\n\nProcess:\n1.  Analyze the provided script for issues related to readability, efficiency, maintainability, and security vulnerabilities.\n2.  Provide a fully refactored version of the code that addresses these issues. Add comments to the new code to explain key changes and complex logic.\n3.  Provide a summary of your changes as a markdown list, explaining *why* each change was made (e.g., "Replaced for-loop with a list comprehension for improved readability and performance.").\n4.  Offer suggestions for further improvements, such as adding unit tests or type hints if they are missing.',
    description: 'Leverage an expert AI persona to perform a deep code review and refactor your Python scripts, focusing on best practices like SOLID, DRY, and PEP 8.',
    author: MOCK_USERS[0],
    category: 'Coding',
    tags: ['Python', 'Developer', 'Refactoring', 'Clean Code'],
    averageRating: 4.7,
    ratingsCount: 100,
    comments: [
      { id: 'c3', author: MOCK_USERS[2], text: 'Fantastic prompt for improving code quality.', createdAt: '2023-10-24T11:00:00Z' },
    ],
    createdAt: '2023-10-24T09:00:00Z',
    model: 'Gemini',
    isPublic: true,
    exampleOutput: '### Refactored Code:\n```python\n# (Refactored, well-commented Python code appears here...)\n\n# Example: Function to process data\ndef process_data(data_list: list[int]) -> list[int]:\n    """Processes a list of integers, filtering and transforming them."""\n    # Use a list comprehension for conciseness and efficiency.\n    return [x * 2 for x in data_list if x > 10]\n```\n\n### Summary of Changes:\n*   **Replaced for-loop with a list comprehension:** This improves both readability and performance for simple filtering and mapping operations.\n*   **Added Type Hints:** Introduced type hints (`list[int]`) to improve code clarity and allow for static analysis.\n*   **Improved Function Naming:** Renamed `proc_dat` to `process_data` for better readability, following PEP 8 conventions.'
  },
   {
    id: 'p4',
    title: 'Social Media Content Calendar',
    prompt: 'Persona: You are a senior social media strategist for a high-end sustainable fashion brand.\n\nTask: Create a detailed 1-month content calendar for the brand "Aura Threads".\n\nContext:\n- Brand: Aura Threads (sustainable, minimalist, high-quality materials).\n- Target Audience: Environmentally conscious millennials and Gen Z (ages 25-40) with high disposable income.\n- Tone of Voice: Sophisticated, educational, inspiring, and calm.\n\nRequirements:\n- Platforms: Instagram (Feed, Stories, Reels), Pinterest.\n- Content Pillars: 1. Behind the Scenes (craftsmanship), 2. Style Inspiration, 3. Sustainability Education, 4. Community Spotlight.\n- Output Format: A markdown table with columns: `Week`, `Day`, `Platform`, `Content Pillar`, `Post Idea/Concept`, `Caption (including call-to-action)`, and `Hashtags (mix of niche and broad)`.\n- Include at least 4-5 posts per week.',
    description: 'Generate a professional, one-month social media content calendar for a fashion brand, complete with content pillars, post ideas, captions, and hashtags.',
    author: MOCK_USERS[1],
    category: 'Marketing',
    tags: ['Social Media', 'Marketing', 'Content Strategy', 'Fashion'],
    averageRating: 4.6,
    ratingsCount: 157,
    comments: [],
    createdAt: '2023-10-27T11:00:00Z',
    model: 'Claude',
    isPublic: true,
    exampleOutput: '| Week | Day       | Platform         | Content Pillar           | Post Idea/Concept                                     | Caption (including call-to-action)                                                                        | Hashtags                                                              |\n|------|-----------|------------------|--------------------------|-------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|\n| 1    | Monday    | Instagram Feed   | Behind the Scenes        | Carousel: The journey of our organic cotton from farm to fabric. | "Every thread tells a story. ✨ Swipe to see the incredible journey of our GOTS-certified organic cotton..." | #AuraThreads #SustainableFashion #OrganicCotton #BehindTheSeams #EthicalStyle |\n| 1    | Tuesday   | Instagram Story  | Community Spotlight      | Q&A with our lead designer about the new collection.  | "Ask me anything! Our designer is live to answer your questions about sustainable design."               | #AskAura #DesignerQA #SlowFashion                                     |\n| 1    | Wednesday | Instagram Reel   | Style Inspiration        | 3 ways to style our classic Tencel slip dress.        | "One dress, three timeless looks. Which one is your favorite? Let us know below! #AuraStyle"            | #StyleInspiration #CapsuleWardrobe #Tencel #VersatileFashion          |\n| 1    | Friday    | Pinterest        | Sustainability Education | Infographic: "5 Shocking Facts About Fast Fashion".   | "Knowledge is power. Pin this to spread awareness and choose conscious consumption. #FashionRevolution"   | #FastFashionFacts #SustainableLiving #EcoFriendly #ConsciousConsumer    |'
  },
  {
    id: 'p5',
    title: 'Interactive History Lesson Plan',
    prompt: 'Persona: An award-winning curriculum designer specializing in immersive and technology-integrated history education for high school students.\n\nTask: Design a highly interactive 60-minute lesson plan for a 10th-grade World History class on the topic of the cultural and economic impact of the Silk Road.\n\nFormat:\n1.  **Learning Objectives (3):** Clearly state what students should know or be able to do by the end of the lesson.\n2.  **Materials List:** All digital and physical resources needed (e.g., projector, student devices, links to a specific Google My Map).\n3.  **Lesson Procedure (step-by-step):**\n    - **Warm-up (5 min):** A "think-pair-share" activity with a provocative image from the Silk Road.\n    - **Main Activity (40 min):** A "Digital Caravan" simulation. Students are divided into groups (merchants, scholars, monks) and must navigate a virtual map, making decisions at various cities and trading \'goods\' and \'ideas\'. Describe the rules and decision points.\n    - **Assessment/Wrap-up (15 min):** An "exit ticket" where students write a short journal entry from the perspective of their role in the simulation.\n4.  **Differentiation:** Include one suggestion for supporting English language learners and one for challenging advanced students.',
    description: 'Create a complete, engaging, and immersive 60-minute history lesson plan for a 10th-grade class, featuring a \'Digital Caravan\' simulation activity.',
    author: MOCK_USERS[0],
    category: 'Education',
    tags: ['Lesson Plan', 'History', 'Education', 'Interactive'],
    averageRating: 4.9,
    ratingsCount: 89,
    comments: [],
    createdAt: '2023-10-28T09:30:00Z',
    model: 'Gemini',
    isPublic: true,
    exampleOutput: '**1. Learning Objectives:**\nBy the end of this lesson, students will be able to:\n- Identify at least three major goods, ideas, or technologies exchanged along the Silk Road.\n- Explain how geography and trade routes influenced cultural diffusion between Asia and Europe.\n- Analyze the impact of trade on the development of major cities along the Silk Road.\n\n**3. Lesson Procedure (Excerpt):**\n- **Warm-up (5 min):** Project an image of the Bamiyan Buddhas in Afghanistan. Ask students to discuss with a partner: "What might this statue tell us about the people who lived here? How do you think it got there?"\n- **Main Activity (40 min):** "Digital Caravan" Simulation.\n    1. Divide students into groups of 3-4, assigning each a role: Merchant, Scholar, or Monk.\n    2. Provide each group with a starting city (e.g., Chang\'an for Merchants) and a digital map link (Google My Maps).\n    3. Each group receives "trade cards" (e.g., Merchants start with Silk, Scholars with Papermaking techniques, Monks with Buddhist scriptures).\n    4. Groups navigate the map, stopping at major cities like Samarkand or Baghdad. At each stop, they read a short scenario and must make a decision: trade goods, face a challenge (bandits, weather), or establish a connection. This will involve trading cards with other groups to achieve their final goal (e.g., Merchants reaching Rome with valuable goods).\n'
  },
  {
    id: 'p6',
    title: 'Minimalist Logo Design Concepts',
    prompt: 'Task: Generate 5 distinct, minimalist logo concepts for a new tech startup.\n\n- Company Name: "Synapse"\n- Company Mission: We use AI to connect and analyze disparate data sources, revealing hidden patterns for businesses.\n- Keywords: Connection, intelligence, clarity, speed, neural networks.\n\nRequirements:\n- Style: Extremely clean, modern, minimalist, clever. Can be an abstract logomark or a logomark + logotype combination.\n- Color Palette: A strict two-color palette. Suggest one primary (e.g., deep blue #0A2E5B) and one accent (e.g., electric green #00F9B8).\n- Output: For each of the 5 concepts, provide a short description of the visual idea and the rationale behind it (how it connects to the company\'s mission).\n\nNegative Constraint: No brains or literal lightbulb icons.',
    description: 'Brainstorm 5 unique and clever minimalist logo concepts for a tech startup, with specific constraints on style, color, and a focus on conceptual meaning.',
    author: MOCK_USERS[1],
    category: 'Art',
    tags: ['Logo Design', 'Branding', 'Minimalist', 'Startup'],
    averageRating: 4.5,
    ratingsCount: 196,
    comments: [],
    createdAt: '2023-10-29T16:00:00Z',
    model: 'DALL-E',
    isPublic: true,
    exampleOutput: 'https://picsum.photos/seed/p6-logo/800/800'
  },
  {
    id: 'p7',
    title: 'Watercolor Fantasy Landscape',
    prompt: 'Subject: A serene and magical hidden grove deep within an ancient forest, viewed from a low angle. In the center is a crystal-clear pond reflecting a bioluminescent sky filled with two moons.\n\nDetails: Giant, glowing mushrooms cast a soft, ethereal light. Fireflies and sparkling motes of light drift through the air. Ancient, moss-covered trees with twisted roots frame the scene. Tiny, glowing flowers grow along the water\'s edge.\n\nAtmosphere: Dreamy, whimsical, peaceful, enchanting.\n\nStyle: In the style of a Studio Ghibli background painting, with beautiful watercolor textures and vibrant yet soft colors. Detailed, high resolution, award-winning fantasy illustration.',
    description: 'Produce an enchanting and serene fantasy landscape in the beautiful watercolor style of Studio Ghibli, perfect for creating magical worlds.',
    author: MOCK_USERS[1],
    category: 'Art',
    tags: ['Watercolor', 'Fantasy', 'Landscape', 'Studio Ghibli'],
    averageRating: 4.9,
    ratingsCount: 214,
    comments: [],
    createdAt: '2023-10-30T12:00:00Z',
    model: 'MidJourney',
    isPublic: true,
    exampleOutput: 'https://picsum.photos/seed/p7-fantasy/800/450'
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
    {
        id: 'c1',
        name: 'Student Success Pack',
        description: 'A curated collection of essential prompts for academic success, from essay writing to creating engaging lesson plans.',
        creator: MOCK_USERS[0],
        price: 9.99,
        promptCount: 2,
        coverImage: 'https://picsum.photos/seed/c1/600/400',
        promptIds: ['p1', 'p5']
    },
    {
        id: 'c2',
        name: 'AI Artistry Master Pack',
        description: 'Unlock stunning AI art with this pack of 3 advanced prompts for MidJourney & DALL-E, covering various styles from sci-fi to branding and fantasy.',
        creator: MOCK_USERS[1],
        price: 19.99,
        promptCount: 3,
        coverImage: 'https://picsum.photos/seed/c2/600/400',
        promptIds: ['p2', 'p6', 'p7']
    },
    {
        id: 'c3',
        name: 'Developer & Marketing Starter Kit',
        description: 'Supercharge your projects with this diverse kit. Includes prompts for code refactoring and creating a full social media content calendar.',
        creator: MOCK_USERS[0],
        price: 14.99,
        promptCount: 2,
        coverImage: 'https://picsum.photos/seed/c3/600/400',
        promptIds: ['p3', 'p4']
    }
];