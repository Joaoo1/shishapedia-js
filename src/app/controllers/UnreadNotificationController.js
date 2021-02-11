import Notification from '../models/Notification';

const NotificationController = {
  async index(req, res) {
    const notifications = await Notification.findAll({
      where: { user_id: req.userId, read: false },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'message', 'read', 'title', 'created_at'],
    });

    return res.json({ notifications: notifications.length });
  },
};

export default NotificationController;
