import * as Yup from 'yup';
import { Op } from 'sequelize';

import Mix from '../models/Mix';
import Image from '../models/Image';
import Essence from '../models/Essence';

const MixController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      essence_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { page = 1 } = req.query;

    const mixes = await Mix.findAll({
      where: {
        [Op.or]: [
          { essence1_id: req.body.essence_id },
          { essence2_id: req.body.essence_id },
        ],
      },
      order: [['updated_at', 'DESC']],
      attributes: ['id'],
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

  async store(req, res) {
    const schema = Yup.object().shape({
      author_id: Yup.number().required(),
      essence1_proportion: Yup.number().required(),
      essence2_proportion: Yup.number().required(),
      essence1_id: Yup.number().required(),
      essence2_id: Yup.number().required(),
      category_id: Yup.number(),
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const {
      essence1_id,
      essence2_id,
      essence1_proportion,
      essence2_proportion,
    } = req.body;

    if (essence1_id === essence2_id) {
      return res
        .status(400)
        .json({ error: 'The first and second essences cannot be the same.' });
    }

    const totalProportion = essence1_proportion + essence2_proportion;
    if (totalProportion !== 100) {
      return res.status(400).json({ error: 'Proportion need to be 100%.' });
    }

    const mixAlreadyExists = await Mix.findOne({
      where: { essence1_id, essence2_id },
    });

    if (mixAlreadyExists) {
      return res.status(400).json({ error: 'Mix already exists' });
    }

    const { id } = await Mix.create(req.body);

    return res.json({ id });
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      author_id: Yup.number(),
      essence1_id: Yup.number().required(),
      essence2_id: Yup.number().required(),
      essence1_proportion: Yup.number().required(),
      essence2_proportion: Yup.number().required(),
      category_id: Yup.number(),
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const mix = await Mix.findByPk(req.body.id);

    const {
      essence1_id,
      essence2_id,
      essence1_proportion,
      essence2_proportion,
    } = req.body;

    if (essence1_id === essence2_id) {
      return res
        .status(400)
        .json({ error: 'The first and second essences cannot be the same.' });
    }

    if (essence1_id !== mix.essence1_id || essence2_id !== mix.essence2_id) {
      const mixAlreadyExists = await Mix.findOne({
        where: { essence1_id, essence2_id },
      });

      if (mixAlreadyExists) {
        return res.status(400).json({ error: 'Mix already exists' });
      }
    }

    const totalProportion = essence1_proportion + essence2_proportion;
    if (totalProportion !== 100) {
      return res.status(400).json({ error: 'Proportion need to be 100%.' });
    }

    await mix.update(req.body);

    const { id } = await Mix.findByPk(req.body.id);

    return res.json({ id });
  },
};

export default MixController;
