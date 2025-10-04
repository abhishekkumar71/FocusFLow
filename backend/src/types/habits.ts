// src/types/habit.ts
export interface Habit {
  id?: number;
  user_id: number;
  title: string;
  description?: string;
  frequency?: string;
  streak?: number;
  last_completed?: Date;
  created_at?: Date;
  updated_at?: Date;
}
