import Notification from "../models/Notification.js";


const saveOfflineNotification = async (user, taskId, message) => {
    try {
      await Notification.create({
        userId: user._id, 
        taskId,
        message,
        isRead: false,
        createdAt: new Date(),
      });
      console.log(`Task Notification saved`);
    } catch (err) {
      console.error("Error saving offline notification:", err.message);
    }
  };

  const sprintNotification = async (userId, sprintId, message) => {
    try {
      await Notification.create({
        userId,
        sprintId,
        message,
        isRead: false,
        createdAt: new Date(),
      });
      console.log(`sprint Notification saved`);
    } catch (err) {
      console.error("Error saving offline notification:", err.message);
    }
  };

  const projecteNotification = async (userId, projectId,message) => {
    try {
      await Notification.create({
        userId,
        projectId,
        //projectName,
        message,
        isRead: false,
        createdAt: new Date(),
      });
      console.log(`project Notification saved`);
    } catch (err) {
      console.error("Error saving offline notification:", err.message);
    }
  };

  const TeamNotification = async (memberIds, message) => {
    try {
        const notifications = memberIds.map(memberId => ({
            userId: memberId,   // The team member who will receive the notification
            message: message,
            isRead: false,       // Mark as unread
            createdAt: new Date() // Timestamp
        }));

        // Save all notifications in bulk
        await Notification.insertMany(notifications); 
        console.log("Notifications stored in the database");
    } catch (err) {
        console.error(`Error saving notifications: ${err.message}`);
    }
};

// Fetch notifications for a user
const getNotificationsForUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).populate("userId", "name");   ;
    res.status(200).json({
      status: "success",
      Data:notifications
      
    });
  } catch (err) {
    res.status(500).json({ status: "false", message: err.message });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    try {
      const updatedNotification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
      if (!updatedNotification) {
        return res.status(404).json({
          status: "false",
          message: "Notification not found",
        });
      }
      res.status(200).json({
        status: "success",
        data: {
          notification: updatedNotification,
        },
      });
    } catch (err) {
      res.status(500).json({ status: "false", message: err.message });
    }
  };
  

// Delete a notification
const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);
    if (!deletedNotification) {
      return res.status(404).json({
        status: "false",
        message: "Notification not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: "false", message: err.message });
  }
};

export { getNotificationsForUser,projecteNotification,sprintNotification, TeamNotification,markNotificationAsRead,saveOfflineNotification, deleteNotification };
