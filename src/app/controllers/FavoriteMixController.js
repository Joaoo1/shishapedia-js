import * as Yup from 'yup';

import FavoriteMix from '../models/FavoriteMix';

const FavoriteMixController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      mix_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const favoritesMixs = await FavoriteMix.findAll({
      where: { mix_id: req.body.mix_id, user_id: req.body.user_id },
    });

    return res.json(favoritesMixs);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      mix_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    await FavoriteMix.create(req.body);

    return res.json({ message: 'Sucessfull' });
  },
};

export default FavoriteMixController;
