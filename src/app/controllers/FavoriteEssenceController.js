import * as Yup from 'yup';
import Essence from '../models/Essence';
import Image from '../models/Image';
import Brand from '../models/Brand';

import FavoriteEssence from '../models/FavoriteEssence';
import EssenceReview from '../models/EssenceReview';

const FavoriteEssenceController = {
  async index(req, res) {
    const favoritesEssences = await FavoriteEssence.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Essence,
          as: 'essence',
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
      ],
    });
    const favorites = favoritesEssences.map((value) => value.essence);

    const results = await Promise.all(
      favorites.map(async (essence) => {
        const reviews = await EssenceReview.findAll({
          where: { essence_id: essence.id },
        });
        essence.dataValues.reviews = reviews.length;
        if (reviews.length === 0) {
          essence.dataValues.averageRating = '0';
          return essence;
        }

        let allRatings = 0;
        reviews.forEach((r) => {
          allRatings += r.dataValues.rating;
        });
        essence.dataValues.averageRating = (
          allRatings / reviews.length
        ).toFixed(2);
        return essence;
      })
    );

    return res.json({ favorites: results });
  },

  async show(req, res) {
    const schema = Yup.object().shape({
      essence_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const favoriteEssence = await FavoriteEssence.findOne({
      where: { essence_id: req.params.essence_id, user_id: req.userId },
    });

    return res.json({ favorite: !!favoriteEssence });
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      essence_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    await FavoriteEssence.create({
      user_id: req.userId,
      essence_id: req.body.essence_id,
    });

    return res.status(200).json();
  },

  async destroy(req, res) {
    const schema = Yup.object().shape({
      essence_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const deletedRows = await FavoriteEssence.destroy({
      where: {
        essence_id: req.params.essence_id,
        user_id: req.userId,
      },
    });

    if (deletedRows > 0) {
      return res.status(204).json();
    }

    return res.status(404).json({ error: 'Favorite não encontrado' });
  },
};

export default FavoriteEssenceController;
