import * as Yup from 'yup';
import { Op } from 'sequelize';

import Image from '../models/Image';
import Essence from '../models/Essence';
import Mix from '../models/Mix';

const EssenceMixController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      essence_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const { page = 1 } = req.query;

    const mixes = await Mix.findAll({
      where: {
        [Op.or]: [
          { essence1_id: req.params.essence_id },
          { essence2_id: req.params.essence_id },
        ],
      },
      order: [['updated_at', 'DESC']],
      attributes: ['id', 'essence1_proportion', 'essence2_proportion'],
      limit: 20,
      offset: (page - 1) * 20,
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
      ],
    });

    return res.json(mixes);
  },
};

export default EssenceMixController;
