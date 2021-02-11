import * as Yup from 'yup';
import Notification from '../models/Notification';

const NotificationController = {
  async index(req, res) {
    const notifications = await Notification.findAll({
      where: { user_id: req.userId },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'message', 'read', 'title', 'created_at'],
    });

    return res.json({ notifications });
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      read: Yup.bool().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const notification = await Notification.findByPk(req.body.id);

    if (req.userId !== notification.user_id) {
      return res
        .status(401)
        .json({ error: 'A notificação não pertence ao seu usuário.' });
    }

    await notification.update({ read: req.body.read });

    return res.status(200).json({});
  },
};

export default NotificationController;
