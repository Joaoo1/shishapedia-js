import { Op } from 'sequelize';
import Essence from '../models/Essence';
import Image from '../models/Image';
import Mix from '../models/Mix';
import User from '../models/User';

const MixSearchController = {
  async index(req, res) {
    const { name = '', category } = req.query;

    try {
      const essences = await Essence.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
        attributes: ['id'],
      });

      let allMixes = [];
      const promises = essences.map(async (essence) => {
        const whereStatement = {};

        if (category) whereStatement.category_id = category;

        const mixes = await Mix.findAll({
          where: {
            [Op.or]: [{ essence1_id: essence.id }, { essence2_id: essence.id }],
            ...whereStatement,
          },
          attributes: ['id', 'essence1_proportion', 'essence2_proportion'],
          include: [
            {
              model: Essence,
              as: 'essence1',
              attributes: ['id', 'name'],
              include: [
                {
                  model: Image,
                  as: 'image',
                  attributes: ['id', 'path', 'url'],
                },
              ],
            },
            {
              model: Essence,
              as: 'essence2',
              attributes: ['id', 'name'],
              include: [
                {
                  model: Image,
                  as: 'image',
                  attributes: ['id', 'path', 'url'],
                },
              ],
            },
            { model: Image, as: 'icon', attributes: ['url', 'path'] },
            { model: Image, as: 'image', attributes: ['url', 'path'] },
            { model: User, as: 'author', attributes: ['name'] },
          ],
        });
        allMixes = allMixes.concat(mixes);
      });

      await Promise.all(promises);

      return res.json({ mixes: allMixes });
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro ao carregar essências.' });
    }
  },
};

export default MixSearchController;
