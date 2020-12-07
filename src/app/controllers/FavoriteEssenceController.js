import * as Yup from 'yup';

import FavoriteEssence from '../models/FavoriteEssence';

const FavoriteEssenceController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      essence_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const favoritesEssences = await FavoriteEssence.findAll({
      where: { essence_id: req.body.essence_id, user_id: req.body.user_id },
    });

    return res.json(favoritesEssences);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      essence_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    await FavoriteEssence.create(req.body);

    return res.json({ message: 'Sucessfull' });
  },
};

export default FavoriteEssenceController;
