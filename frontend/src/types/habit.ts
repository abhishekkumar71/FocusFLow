export interface Habit {
  id?: number;
  user_id?: number;
  title: string;
  description?: string;
  frequency?: string;
  streak?: number;
  last_completed?: string | null;
  created_at?: string;
  updated_at?: string;
}
