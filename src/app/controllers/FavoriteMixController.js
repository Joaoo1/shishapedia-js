import * as Yup from 'yup';
import Brand from '../models/Brand';
import Essence from '../models/Essence';

import FavoriteMix from '../models/FavoriteMix';
import Image from '../models/Image';
import Mix from '../models/Mix';
import User from '../models/User';

const FavoriteMixController = {
  async index(req, res) {
    const favorites = await FavoriteMix.findAll({
      where: { user_id: req.userId },
      attributes: ['user_id'],
      include: [
        {
          model: Mix,
          as: 'mix',
          include: [
            {
              model: Essence,
              as: 'essence1',
              include: [
                {
                  model: Image,
                  as: 'image',
                  attributes: ['url', 'path'],
                },
                {
                  model: Image,
                  as: 'icon',
                  attributes: ['url', 'path'],
                },
                {
                  model: Brand,
                  as: 'brand',
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              model: Essence,
              as: 'essence2',
              include: [
                {
                  model: Image,
                  as: 'image',
                  attributes: ['url', 'path'],
                },
                {
                  model: Image,
                  as: 'icon',
                  attributes: ['url', 'path'],
                },
                {
                  model: Brand,
                  as: 'brand',
                  attributes: ['id', 'name'],
                },
              ],
            },
            { model: Image, as: 'icon', attributes: ['url', 'path'] },
            { model: Image, as: 'image', attributes: ['url', 'path'] },
            { model: User, as: 'author', attributes: ['name'] },
          ],
        },
      ],
    });

    const formattedFavorites = favorites.map((fvt) => fvt.mix);

    return res.json({ favorites: formattedFavorites });
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      mix_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    await FavoriteMix.create({
      mix_id: req.body.mix_id,
      user_id: req.userId,
    });

    return res.status(200).json();
  },

  async show(req, res) {
    const schema = Yup.object().shape({
      mix_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const favoriteMix = await FavoriteMix.findOne({
      where: { mix_id: req.params.mix_id, user_id: req.userId },
    });

    return res.json({ favorite: !!favoriteMix });
  },

  async destroy(req, res) {
    const schema = Yup.object().shape({
      mix_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const deletedRows = await FavoriteMix.destroy({
      where: {
        mix_id: req.params.mix_id,
        user_id: req.userId,
      },
    });

    if (deletedRows > 0) {
      return res.status(204).json();
    }

    return res.status(404).json({ error: 'Favorito não encontrado.' });
  },
};

export default FavoriteMixController;
