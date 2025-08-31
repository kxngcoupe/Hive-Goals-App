import type { User, Goal, Reward, Task } from './types';

export const users: User[] = [
  { id: 'user1', name: 'Alex Queen', avatarUrl: 'https://picsum.photos/100/100?a', points: 250 },
  { id: 'user2', name: 'Barry King', avatarUrl: 'https://picsum.photos/100/100?b', points: 180 },
  { id: 'user3', name: 'Casey Jack', avatarUrl: 'https://picsum.photos/100/100?c', points: 320 },
  { id: 'user4', name: 'Drew Ace', avatarUrl: 'https://picsum.photos/100/100?d', points: 150 },
];

export const goals: Goal[] = [
  {
    id: 'goal1',
    title: 'Q3 Product Launch Campaign',
    description: 'Execute a successful marketing campaign for the new product launch in the third quarter.',
    deadline: '2024-09-30',
    tasks: [
      { id: 't1', description: 'Finalize campaign creative assets', points: 50, isCompleted: true, assignedTo: 'user1' },
      { id: 't2', description: 'Set up social media advertising', points: 40, isCompleted: true, assignedTo: 'user2' },
      { id: 't3', description: 'Draft and schedule launch day emails', points: 30, isCompleted: false, assignedTo: 'user1' },
      { id: 't4', description: 'Coordinate with press and influencers', points: 60, isCompleted: false, assignedTo: 'user3' },
    ],
  },
  {
    id: 'goal2',
    title: 'Improve Customer Onboarding Flow',
    description: 'Redesign and implement a more intuitive customer onboarding experience to increase user retention.',
    deadline: '2024-08-15',
    tasks: [
      { id: 't5', description: 'Conduct user research on pain points', points: 40, isCompleted: true, assignedTo: 'user3' },
      { id: 't6', description: 'Create new onboarding wireframes', points: 50, isCompleted: true, assignedTo: 'user1' },
      { id: 't7', description: 'Develop interactive tutorial components', points: 80, isCompleted: true, assignedTo: 'user2' },
      { id: 't8', description: 'A/B test new flow against the old one', points: 70, isCompleted: true, assignedTo: 'user4' },
      { id: 't9', description: 'Analyze A/B test results and report', points: 30, isCompleted: false, assignedTo: 'user3' },
    ],
  },
  {
    id: 'goal3',
    title: 'Website Performance Optimization',
    description: 'Increase website pagespeed and optimize core web vitals for a better user experience.',
    deadline: '2024-07-20',
    tasks: [
      { id: 't10', description: 'Optimize all marketing images', points: 30, isCompleted: true, assignedTo: 'user4' },
      { id: 't11', description: 'Implement server-side rendering', points: 100, isCompleted: false, assignedTo: 'user2' },
      { id: 't12', description: 'Minify CSS and JavaScript files', points: 20, isCompleted: true, assignedTo: 'user2' },
    ]
  },
];

export const rewards: Reward[] = [
    { id: 'reward1', name: 'Premium Coffee Voucher', description: 'A $10 voucher for your favorite local coffee shop.', cost: 100 },
    { id: 'reward2', name: 'Half-Day Off', description: 'Enjoy a relaxing afternoon off, on the house.', cost: 500 },
    { id: 'reward3', name: 'Company Swag Box', description: 'A box of exclusive company-branded merchandise.', cost: 250 },
    { id: 'reward4', name: 'Lunch on the Company', description: 'Get a free lunch delivered to the office.', cost: 150 },
];

export const getGoalHistorySummary = (): string => {
  return goals.map(goal => {
    const completedTasks = goal.tasks.filter(t => t.isCompleted).length;
    const totalTasks = goal.tasks.length;
    const effort = goal.tasks.reduce((sum, task) => sum + task.points, 0);
    return `Goal: "${goal.title}" (Completed ${completedTasks}/${totalTasks} tasks, Total Effort: ${effort} points)`;
  }).join('\n');
};
