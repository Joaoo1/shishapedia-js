import { Op } from 'sequelize';
import Essence from '../models/Essence';
import EssenceReview from '../models/EssenceReview';
import Image from '../models/Image';

const EssenceSearchController = {
  async index(req, res) {
    const { name = '' } = req.query;
    const { brand_id } = req.params;

    try {
      const essences = await Essence.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
          brand_id,
        },
        attributes: ['id', 'name', 'proposal', 'description', 'release_date'],
        // limit: 30,
        // offset: (page - 1) * 30,
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
        ],
      });

      const results = await Promise.all(
        essences.map(async (essence) => {
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

      return res.json(results);
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro ao carregar essências' });
    }
  },
};

export default EssenceSearchController;
