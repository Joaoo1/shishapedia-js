import * as Yup from 'yup';

import Mix from '../models/Mix';
import Image from '../models/Image';
import Essence from '../models/Essence';
import User from '../models/User';
import FlavorCategory from '../models/FlavorCategory';

const MixController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      category_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    // const { page = 1 } = req.query;

    const mixes = await Mix.findAll({
      where: { category_id: req.params.category_id },
      order: [['updated_at', 'DESC']],
      attributes: ['id', 'essence1_proportion', 'essence2_proportion'],
      // limit: 20,
      // offset: (page - 1) * 20,
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

    return res.json({ mixes });
  },

  async show(req, res) {
    const schema = Yup.object().shape({
      category_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const mix = await Mix.findByPk(req.params.id, {
      attributes: [
        'description',
        'essence1_proportion',
        'essence2_proportion',
        'created_at',
      ],
      include: [
        {
          foreignKey: 'essence1_id',
          model: Essence,
          as: 'essence1',
          attributes: ['id', 'name'],
        },
        {
          foreignKey: 'essence2_id',
          model: Essence,
          as: 'essence2',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
        {
          model: FlavorCategory,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    return res.json(mix || {});
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      author_id: Yup.number().required(),
      essence1_proportion: Yup.number().required(),
      essence2_proportion: Yup.number().required(),
      essence1_id: Yup.number().required(),
      essence2_id: Yup.number().required(),
      category_id: Yup.number().required(),
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const {
      essence1_id,
      essence2_id,
      essence1_proportion,
      essence2_proportion,
    } = req.body;

    if (essence1_id === essence2_id) {
      return res.status(400).json({
        error: 'A primeira e a segunda essência precisam ser diferentes.',
      });
    }

    const totalProportion = essence1_proportion + essence2_proportion;
    if (totalProportion !== 100) {
      return res.status(400).json({ error: 'Proporção precisa ter 100%.' });
    }

    const mixAlreadyExists = await Mix.findOne({
      where: { essence1_id, essence2_id },
    });

    if (mixAlreadyExists) {
      return res.status(400).json({ error: 'Mix já existe.' });
    }

    const { id: image_id } = await Image.create({
      name: req.file.originalname,
      path: req.file.filename,
    });

    const { id: icon_id } = await Image.create({
      name: req.iconFile.originalname,
      path: req.iconFile.filename,
    });

    const { id } = await Mix.create({
      ...req.body,
      image_id,
      icon_id,
    });

    return res.status(201).json({ id });
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
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const mix = await Mix.findByPk(req.body.id);

    const {
      essence1_id,
      essence2_id,
      essence1_proportion,
      essence2_proportion,
    } = req.body;

    if (essence1_id === essence2_id) {
      return res.status(400).json({
        error: 'A primeira e a segunda essência precisam ser diferentes.',
      });
    }

    if (essence1_id !== mix.essence1_id || essence2_id !== mix.essence2_id) {
      const mixAlreadyExists = await Mix.findOne({
        where: { essence1_id, essence2_id },
      });

      if (mixAlreadyExists) {
        return res.status(400).json({ error: 'Mix já existe.' });
      }
    }

    const totalProportion = essence1_proportion + essence2_proportion;
    if (totalProportion !== 100) {
      return res.status(400).json({ error: 'Proporção precisa ter 100%.' });
    }

    await mix.update(req.body);

    const { id } = await Mix.findByPk(req.body.id);

    return res.status(204).json({ id });
  },
};

export default MixController;
