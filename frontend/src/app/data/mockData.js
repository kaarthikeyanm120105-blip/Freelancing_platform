// Mock Data for Student Freelance Connect Platform























// Mock Current User
export const currentUser = {
  id: 'S001',
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  role: 'student',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  verified: true,
  university: 'Stanford University',
  major: 'Computer Science',
  graduationYear: 2025,
  skills: ['React', 'Node.js', 'Python', 'UI/UX Design', 'Data Analysis'],
  employabilityScore: 87,
  completedJobs: 12,
  earnings: 8450,
  rating: 4.8,
  bio: 'Passionate full-stack developer and designer with experience in web applications.',
  certifications: [
    { id: 'C1', name: 'AWS Cloud Practitioner', issuer: 'Amazon', date: '2024-01', verified: true },
    { id: 'C2', name: 'Google UX Design', issuer: 'Google', date: '2023-11', verified: true },
  ],
  portfolio: [
    {
      id: 'P1',
      title: 'E-commerce Dashboard',
      description: 'Modern admin dashboard for online store management',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
      tags: ['React', 'TypeScript', 'Tailwind'],
    },
    {
      id: 'P2',
      title: 'Mobile Banking App UI',
      description: 'Clean and intuitive banking interface design',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600',
      tags: ['Figma', 'UI/UX', 'Mobile'],
    },
  ],
};

// Mock Jobs
export const mockJobs = [
  {
    id: 'J001',
    title: 'Build a React Dashboard for Analytics',
    description: 'Need a modern, responsive dashboard to visualize business analytics data. Should include charts, tables, and real-time updates.',
    clientId: 'C001',
    clientName: 'Sarah Chen',
    clientCompany: 'DataViz Inc.',
    category: 'Web Development',
    skills: ['React', 'TypeScript', 'Charts', 'UI/UX'],
    budget: 800,
    duration: '2 weeks',
    difficulty: 'Intermediate',
    status: 'open',
    applicants: 12,
    postedDate: '2026-02-10',
    deadline: '2026-02-25',
    matchScore: 95,
  },
  {
    id: 'J002',
    title: 'Python Data Analysis Script',
    description: 'Create a Python script to analyze sales data and generate reports with visualizations.',
    clientId: 'C002',
    clientName: 'Michael Torres',
    clientCompany: 'RetailAnalytics Co.',
    category: 'Data Science',
    skills: ['Python', 'Pandas', 'Data Analysis', 'Visualization'],
    budget: 450,
    duration: '1 week',
    difficulty: 'Beginner',
    status: 'open',
    applicants: 8,
    postedDate: '2026-02-11',
    deadline: '2026-02-20',
    matchScore: 82,
  },
  {
    id: 'J003',
    title: 'Mobile App UI/UX Design',
    description: 'Design user interface and user experience for a new fitness tracking mobile application.',
    clientId: 'C003',
    clientName: 'Emma Wilson',
    clientCompany: 'FitTech Startup',
    category: 'Design',
    skills: ['Figma', 'UI/UX', 'Mobile Design', 'Prototyping'],
    budget: 650,
    duration: '10 days',
    difficulty: 'Intermediate',
    status: 'open',
    applicants: 15,
    postedDate: '2026-02-09',
    deadline: '2026-02-22',
    matchScore: 88,
  },
  {
    id: 'J004',
    title: 'WordPress Website Customization',
    description: 'Customize existing WordPress theme and add new features to small business website.',
    clientId: 'C004',
    clientName: 'David Park',
    clientCompany: 'Local Bakery',
    category: 'Web Development',
    skills: ['WordPress', 'PHP', 'CSS', 'JavaScript'],
    budget: 300,
    duration: '5 days',
    difficulty: 'Beginner',
    status: 'open',
    applicants: 6,
    postedDate: '2026-02-12',
    deadline: '2026-02-19',
    matchScore: 65,
  },
  {
    id: 'J005',
    title: 'Machine Learning Model Development',
    description: 'Develop ML model for predicting customer churn based on historical data.',
    clientId: 'C005',
    clientName: 'Lisa Anderson',
    clientCompany: 'TechCorp',
    category: 'AI/ML',
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Science'],
    budget: 1200,
    duration: '3 weeks',
    difficulty: 'Advanced',
    status: 'open',
    applicants: 5,
    postedDate: '2026-02-08',
    deadline: '2026-03-01',
    matchScore: 58,
  },
  {
    id: 'J006',
    title: 'Social Media Content Calendar',
    description: 'Create a 30-day social media content calendar with engaging posts and graphics.',
    clientId: 'C006',
    clientName: 'James Lee',
    clientCompany: 'Marketing Agency',
    category: 'Marketing',
    skills: ['Content Creation', 'Social Media', 'Graphic Design'],
    budget: 400,
    duration: '1 week',
    difficulty: 'Beginner',
    status: 'open',
    applicants: 20,
    postedDate: '2026-02-11',
    deadline: '2026-02-18',
    matchScore: 45,
  },
];

// Mock Applications
export const mockApplications = [
  {
    id: 'A001',
    jobId: 'J001',
    jobTitle: 'Build a React Dashboard for Analytics',
    studentId: 'S001',
    studentName: 'Alex Johnson',
    coverLetter: 'I have extensive experience building React dashboards with real-time data visualization...',
    proposedRate: 800,
    status: 'pending',
    appliedDate: '2026-02-11',
    matchScore: 95,
  },
  {
    id: 'A002',
    jobId: 'J003',
    jobTitle: 'Mobile App UI/UX Design',
    studentId: 'S001',
    studentName: 'Alex Johnson',
    coverLetter: 'I specialize in mobile UI/UX design and have completed several fitness app projects...',
    proposedRate: 650,
    status: 'accepted',
    appliedDate: '2026-02-10',
    matchScore: 88,
  },
  {
    id: 'A003',
    jobId: 'J002',
    jobTitle: 'Python Data Analysis Script',
    studentId: 'S001',
    studentName: 'Alex Johnson',
    coverLetter: 'I can efficiently create Python scripts for data analysis using Pandas and Matplotlib...',
    proposedRate: 450,
    status: 'rejected',
    appliedDate: '2026-02-12',
    matchScore: 82,
  },
];

// Mock Transactions
export const mockTransactions = [
  {
    id: 'T001',
    type: 'credit',
    amount: 650,
    description: 'Payment for Mobile App UI/UX Design',
    date: '2026-02-10',
    status: 'completed',
    jobId: 'J003',
  },
  {
    id: 'T002',
    type: 'credit',
    amount: 550,
    description: 'Payment for E-commerce Website',
    date: '2026-02-05',
    status: 'completed',
    jobId: 'J007',
  },
  {
    id: 'T003',
    type: 'debit',
    amount: 50,
    description: 'Withdrawal to Bank Account',
    date: '2026-02-08',
    status: 'completed',
  },
  {
    id: 'T004',
    type: 'credit',
    amount: 800,
    description: 'Payment for React Dashboard (Escrow)',
    date: '2026-02-12',
    status: 'escrow',
    jobId: 'J001',
  },
];

// Mock Messages
export const mockMessages = [
  {
    id: 'M001',
    senderId: 'C001',
    senderName: 'Sarah Chen',
    receiverId: 'S001',
    content: 'Hi Alex, I reviewed your proposal for the dashboard project. When can you start?',
    timestamp: '2026-02-12T10:30:00',
    read: true,
  },
  {
    id: 'M002',
    senderId: 'C003',
    senderName: 'Emma Wilson',
    receiverId: 'S001',
    content: 'Great work on the mockups! Can you add dark mode variants?',
    timestamp: '2026-02-11T14:20:00',
    read: true,
  },
];

// Mock Courses
export const mockCourses = [
  {
    id: 'CR001',
    title: 'Advanced React Patterns',
    provider: 'Udemy',
    category: 'Web Development',
    duration: '12 hours',
    level: 'Advanced',
    rating: 4.7,
    recommended: true,
    skillsGained: ['React', 'Design Patterns', 'Performance'],
  },
  {
    id: 'CR002',
    title: 'Machine Learning Fundamentals',
    provider: 'Coursera',
    category: 'AI/ML',
    duration: '6 weeks',
    level: 'Intermediate',
    rating: 4.9,
    recommended: true,
    skillsGained: ['Python', 'TensorFlow', 'ML Algorithms'],
  },
  {
    id: 'CR003',
    title: 'UI/UX Design Masterclass',
    provider: 'Skillshare',
    category: 'Design',
    duration: '8 hours',
    level: 'All Levels',
    rating: 4.8,
    recommended: true,
    skillsGained: ['Figma', 'User Research', 'Prototyping'],
  },
];

// Mock Admin Statistics
export const mockAdminStats = {
  totalUsers: 2847,
  totalStudents: 2145,
  totalClients: 698,
  totalJobs: 1254,
  activeJobs: 342,
  completedJobs: 856,
  totalRevenue: 458900,
  averageJobValue: 536,
  sdgImpact: {
    studentsEmployed: 1823,
    totalEarnings: 892450,
    skillsDeveloped: 4567,
  },
};

// Mock Skill Gap Data
export const mockSkillGap = {
  current: {
    'React': 85,
    'Node.js': 70,
    'Python': 75,
    'UI/UX Design': 80,
    'Data Analysis': 65,
  },
  market: {
    'React': 85,
    'Node.js': 85,
    'Python': 80,
    'UI/UX Design': 80,
    'Data Analysis': 75,
    'TypeScript': 70,
    'AWS': 60,
  },
};

// Mock Growth Timeline
export const mockGrowthTimeline = [
  { month: 'Aug', score: 65, jobs: 2 },
  { month: 'Sep', score: 70, jobs: 3 },
  { month: 'Oct', score: 75, jobs: 4 },
  { month: 'Nov', score: 78, jobs: 5 },
  { month: 'Dec', score: 82, jobs: 6 },
  { month: 'Jan', score: 85, jobs: 8 },
  { month: 'Feb', score: 87, jobs: 10 },
];

// Mock Job Categories
export const jobCategories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'AI/ML',
  'Design',
  'Marketing',
  'Content Writing',
  'Video Editing',
  'Photography',
  'Business',
];

// Mock Skills
export const popularSkills = [
  'React',
  'Node.js',
  'Python',
  'JavaScript',
  'TypeScript',
  'UI/UX Design',
  'Figma',
  'Data Analysis',
  'Machine Learning',
  'AWS',
  'MongoDB',
  'PostgreSQL',
  'Docker',
  'Git',
  'Photoshop',
];





