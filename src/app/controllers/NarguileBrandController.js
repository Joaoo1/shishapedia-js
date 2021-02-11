import Brand from '../models/Brand';
import Narguile from '../models/Narguile';
import Image from '../models/Image';

const NarguileBrandController = {
  async index(req, res) {
    const brands = await Brand.findAll({
      where: { narguile: true },
      order: [['name', 'ASC']],
      attributes: ['id', 'name'],
      include: [
        {
          model: Image,
          as: 'image',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    brands.map(async (brand) => {
      const narguiles = await Narguile.findAll({
        where: { brand_id: brand.id },
      });
      brand.totalNarguiles = narguiles.length;
      return brand;
    });

    return res.json(brands);
  },
};

export default NarguileBrandController;
