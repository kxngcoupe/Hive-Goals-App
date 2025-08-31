export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  manna: number;
  role: 'Admin' | 'Member';
};

export type Task = {
  id: string;
  description: string;
  manna: number;
  isCompleted: boolean;
  assignedTo: string; // User ID
  quota?: number; // e.g. "make 10 sales calls"
  progress?: number; // e.g. 3 of 10 calls made
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

export type Availability = {
  userId: string;
  times: {
    date: string; // YYYY-MM-DD format
    start: string; // HH:mm format
    end: string;   // HH:mm format
  }[];
};

export type Event = {
    id: string;
    title: string;
    description: string;
    date: string; // YYYY-MM-DD format
};
