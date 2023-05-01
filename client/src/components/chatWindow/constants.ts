import { ReactNode } from 'react';

export interface MessageItem {
  question?: string;
  reply?: ReactNode;
  cost?: number;
  sources?: any[];
  error?: boolean;
}
