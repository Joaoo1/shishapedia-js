import Brand from '../models/Brand';
import Essence from '../models/Essence';
import Image from '../models/Image';

const EssenceBrandController = {
  async index(req, res) {
    const brands = await Brand.findAll({
      where: { essence: true },
      order: [['name', 'ASC']],
      attributes: ['id', 'name'],
      include: [
        {
          model: Image,
          as: 'image',
          attributes: ['id', 'url', 'path'],
        },
        {
          model: Image,
          as: 'icon',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    const results = await Promise.all(
      brands.map(async (brand) => {
        const essences = await Essence.findAll({
          where: { brand_id: brand.id },
        });
        brand.dataValues.totalEssences = essences.length;
        return brand;
      })
    );

    return res.json(results);
  },
};

export default EssenceBrandController;
