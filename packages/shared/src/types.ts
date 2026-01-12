// Shared TypeScript types for web and mobile

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: number;
}

export interface Task {
  _id: string;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface Message {
  _id: string;
  userId: string;
  text: string;
  createdAt: number;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithTimestamp<T> = T & {
  createdAt: number;
  updatedAt?: number;
};
