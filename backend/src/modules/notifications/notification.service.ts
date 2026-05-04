import prisma from '../../config/db';
import { io } from '../../app/server';
import type { CreateNotificationInput, NotificationType, Notification } from './notification.types';
import { logger } from '../../config/logger';

export const createNotification = async (input: CreateNotificationInput): Promise<Notification> => {
  const notification = await prisma.notification.create({
    data: input,
  });

  // 🔥 Real-time push
  io.to(`user_${input.userId}`).emit('notification', notification);
  
  logger.info(`🔔 Notification created for user ${input.userId}: ${input.type}`);
  
  return notification as Notification;
};

export const getNotifications = async (userId: string, limit = 50): Promise<Notification[]> => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return notifications as Notification[];
};

export const markAsRead = async (id: string, userId: string): Promise<void> => {
  await prisma.notification.updateMany({
    where: { 
      id, 
      userId 
    },
    data: { read: true },
  });
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: { read: true },
  });
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  const count = await prisma.notification.count({
    where: { 
      userId,
      read: false,
    },
  });
  return count;
};
