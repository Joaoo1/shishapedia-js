import { Op } from 'sequelize';
import Notification from '../models/Notification';

const NotificationController = {
  async index(req, res) {
    const date = new Date();
    date.setDate(date.getDate() - 7);

    const notifications = await Notification.findAll({
      where: {
        user_id: req.userId,
        read: false,
        created_at: {
          // Get only notifications of the last 7 days
          [Op.gt]: date,
        },
      },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'message', 'read', 'title', 'created_at'],
    });

    return res.json({ notifications: notifications.length });
  },
};

export default NotificationController;
