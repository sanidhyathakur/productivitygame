export interface UserProfile {
  id: string;
  user_id: string;
  energy: number;
  candy_points: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  energy_reward: number;
  candy_reward: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface CustomAction {
  id: string;
  user_id: string;
  name: string;
  energy_change: number;
  candy_change: number;
  duration_minutes?: number;
  created_at: string;
}

export interface DailyStat {
  id: string;
  user_id: string;
  date: string;
  tasks_completed: number;
  energy_earned: number;
  candy_earned: number;
  streak_maintained: boolean;
  mood_rating?: number;
}

export interface Reward {
  id: string;
  user_id: string;
  name: string;
  description: string;
  candy_cost: number;
  redeemed: boolean;
  redeemed_at?: string;
  created_at: string;
}

export type TaskCategory = 'Work' | 'Study' | 'Health' | 'Personal' | 'Exercise' | 'Social';