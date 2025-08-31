export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  points: number;
};

export type Task = {
  id: string;
  description: string;
  points: number;
  isCompleted: boolean;
  assignedTo: string; // User ID
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  tasks: Task[];
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  cost: number;
};
