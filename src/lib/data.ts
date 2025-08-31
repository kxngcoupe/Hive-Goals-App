import type { User, Goal, Reward, Task } from './types';

export const users: User[] = [
  { id: 'user1', name: 'Alex Queen', email: 'isaiahwcooper@gmail.com', avatarUrl: 'https://picsum.photos/100/100?a', manna: 250, role: 'Admin' },
  { id: 'user2', name: 'Barry King', email: 'barry.king@example.com', avatarUrl: 'https://picsum.photos/100/100?b', manna: 180, role: 'Member' },
  { id: 'user3', name: 'Casey Jack', email: 'casey.jack@example.com', avatarUrl: 'https://picsum.photos/100/100?c', manna: 320, role: 'Member' },
  { id: 'user4', name: 'Drew Ace', email: 'drew.ace@example.com', avatarUrl: 'https://picsum.photos/100/100?d', manna: 150, role: 'Member' },
];

export const goals: Goal[] = [
  {
    id: 'goal1',
    title: 'Q3 Product Launch Campaign',
    description: 'Execute a successful marketing campaign for the new product launch in the third quarter.',
    deadline: '2024-09-30',
    tasks: [
      { id: 't1', description: 'Finalize campaign creative assets', manna: 50, isCompleted: true, assignedTo: 'user1' },
      { id: 't2', description: 'Set up social media advertising', manna: 40, isCompleted: true, assignedTo: 'user2' },
      { id: 't3', description: 'Draft and schedule 5 launch day emails', manna: 30, isCompleted: false, assignedTo: 'user1', quota: 5, progress: 1 },
      { id: 't4', description: 'Coordinate with 10 press and influencers', manna: 60, isCompleted: false, assignedTo: 'user3', quota: 10, progress: 4 },
    ],
  },
  {
    id: 'goal2',
    title: 'Improve Customer Onboarding Flow',
    description: 'Redesign and implement a more intuitive customer onboarding experience to increase user retention.',
    deadline: '2024-08-15',
    tasks: [
      { id: 't5', description: 'Conduct user research on pain points', manna: 40, isCompleted: true, assignedTo: 'user3' },
      { id: 't6', description: 'Create new onboarding wireframes', manna: 50, isCompleted: true, assignedTo: 'user1' },
      { id: 't7', description: 'Develop interactive tutorial components', manna: 80, isCompleted: true, assignedTo: 'user2' },
      { id: 't8', description: 'A/B test new flow against the old one', manna: 70, isCompleted: true, assignedTo: 'user4' },
      { id: 't9', description: 'Analyze A/B test results and report', manna: 30, isCompleted: false, assignedTo: 'user3' },
    ],
  },
  {
    id: 'goal3',
    title: 'Website Performance Optimization',
    description: 'Increase website pagespeed and optimize core web vitals for a better user experience.',
    deadline: '2024-07-20',
    tasks: [
      { id: 't10', description: 'Optimize all marketing images', manna: 30, isCompleted: true, assignedTo: 'user4' },
      { id: 't11', description: 'Implement server-side rendering', manna: 100, isCompleted: false, assignedTo: 'user2' },
      { id: 't12', description: 'Minify CSS and JavaScript files', manna: 20, isCompleted: true, assignedTo: 'user2' },
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
    const effort = goal.tasks.reduce((sum, task) => sum + task.manna, 0);
    return `Goal: "${goal.title}" (Completed ${completedTasks}/${totalTasks} tasks, Total Effort: ${effort} manna)`;
  }).join('\n');
};
