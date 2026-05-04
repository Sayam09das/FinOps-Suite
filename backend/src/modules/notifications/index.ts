import { Router } from 'express';
import { protect } from '../../common/middleware/auth.middleware';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from './notification.service';

const router = Router();

// 📧 Notification API
router.get('/', protect, async (req, res) => {
  const userId = (req as any).user.id;
  const notifications = await getNotifications(userId);
  const unreadCount = await getUnreadCount(userId);
  res.json({ success: true, data: { notifications, unreadCount } });
});

router.patch('/:id/read', protect, async (req, res) => {
  const userId = (req as any).user.id;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    res.status(400).json({ success: false, message: 'Notification id is required' });
    return;
  }

  await markAsRead(id, userId);
  res.json({ success: true, message: 'Marked as read' });
});

router.patch('/read-all', protect, async (req, res) => {
  const userId = (req as any).user.id;
  await markAllAsRead(userId);
  res.json({ success: true, message: 'All notifications marked as read' });
});

export { createNotification, getNotifications, markAsRead, markAllAsRead, getUnreadCount } from './notification.service';
export { startNotificationWorker, stopNotificationWorker } from './notification.worker';
export type { NotificationType, CreateNotificationInput, Notification } from './notification.types';

export default router;
