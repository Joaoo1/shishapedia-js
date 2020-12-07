import * as Yup from 'yup';

import FavoriteNarguile from '../models/FavoriteNarguile';

const FavoriteNarguileController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      narguile_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const favoritesNarguiles = await FavoriteNarguile.findAll({
      where: { narguile_id: req.body.narguile_id, user_id: req.body.user_id },
    });

    return res.json(favoritesNarguiles);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      narguile_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    await FavoriteNarguile.create(req.body);

    return res.json({ message: 'Sucessfull' });
  },
};

export default FavoriteNarguileController;
