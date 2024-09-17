import express from 'express';
import { getNotificationsForUser, markNotificationAsRead, deleteNotification } from '../controllers/notificationController.js';

const notificationRouter = express.Router();

// Route to get all notifications for a user
notificationRouter.get('/:userId', getNotificationsForUser);

// Route to mark a notification as read
notificationRouter.patch('/:notificationId/read', markNotificationAsRead);

// Route to delete a notification
notificationRouter.delete('/:notificationId', deleteNotification);

export default notificationRouter;
