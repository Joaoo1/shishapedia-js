import * as Yup from 'yup';

import FavoriteNarguile from '../models/FavoriteNarguile';

const FavoriteNarguileController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      narguile_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const favoritesNarguiles = await FavoriteNarguile.findAll({
      where: { narguile_id: req.body.narguile_id, user_id: req.userId },
    });

    return res.json(favoritesNarguiles);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      narguile_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    await FavoriteNarguile.create({
      user_id: req.userId,
      narguile_id: req.body.narguile_id,
    });

    return res.status(200).json();
  },
};

export default FavoriteNarguileController;
