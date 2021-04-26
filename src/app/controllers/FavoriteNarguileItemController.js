import * as Yup from 'yup';

import FavoriteNarguileItem from '../models/FavoriteNarguileItem';
import Image from '../models/Image';
import NarguileItem from '../models/NarguileItem';

const FavoriteNarguileItemController = {
  async index(req, res) {
    const favoritesNarguilesItems = await FavoriteNarguileItem.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: NarguileItem,
          as: 'narguile_item',
        },
      ],
    });

    favoritesNarguilesItems.forEach(({ narguile_item }) => {
      const images = narguile_item.images.map(async (imageId) => {
        const image = await Image.findByPk(imageId, {
          attributes: ['path', 'url', 'id'],
        });
        return image;
      });

      narguile_item.images = images;
    });

    return res.json(favoritesNarguilesItems);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      narguile_item_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    await FavoriteNarguileItem.create({
      user_id: req.userId,
      narguile_item_id: req.body.narguile_item_id,
    });

    return res.status(201).json();
  },
};

export default FavoriteNarguileItemController;
