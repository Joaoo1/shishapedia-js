import * as Yup from 'yup';
import User from '../models/User';

const RemoteNotificationController = {
  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        fcm_token: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validação falhou.' });
      }

      const { fcm_token } = req.body;

      const user = await User.findByPk(req.userId);

      if (user && user.fcm_tokens) {
        if (user.fcm_tokens.findIndex((e) => e === fcm_token) !== -1) {
          return res.status(204).json();
        }

        const fcm_tokens = [];
        fcm_tokens.push(...user.fcm_tokens);
        fcm_tokens.push(fcm_token);
        await user.update({ fcm_tokens });
      } else {
        await user.update({ fcm_tokens: [fcm_token] });
      }

      return res.status(201).json();
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },

  async delete(req, res) {
    const schema = Yup.object().shape({
      fcm_token: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const user = await User.findByPk(req.userId);
    if (user.fcm_tokens) {
      const idx = user.fcm_tokens.findIndex((e) => e === req.body.fcm_token);
      if (idx !== -1) {
        const fcm_tokens = [];
        fcm_tokens.push(...user.fcm_tokens);
        fcm_tokens.splice(idx, 1);
        await user.update({ fcm_tokens });
      }
    }

    return res.status(204).json();
  },
};

export default RemoteNotificationController;
