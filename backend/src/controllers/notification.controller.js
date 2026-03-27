import * as NotificationService from "../service/notification.service.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getNotifications(req.userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
