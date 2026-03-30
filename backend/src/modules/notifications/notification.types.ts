export type NotificationType = 
  | 'budget_exceeded'
  | 'budget_warning'
  | 'low_balance'
  | 'new_transaction'
  | 'analytics_insight';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

