import * as Yup from 'yup';

import FlavorCategory from '../models/FlavorCategory';
import Image from '../models/Image';

const FlavorCategoryController = {
  async index(_req, res) {
    const categories = await FlavorCategory.findAll({
      order: ['name'],
      attributes: ['id', 'name'],
      include: [
        {
          model: Image,
          as: 'icon',
          attributes: ['url', 'path'],
        },
      ],
    });

    return res.json(categories);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const flavorAlreadyExists = await FlavorCategory.findOne({
      where: { name: req.body.name },
    });

    if (flavorAlreadyExists) {
      return res.status(400).json({ error: 'Categoria já existe.' });
    }

    const { id, name } = await FlavorCategory.create(req.body);

    return res.json({ id, name });
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const flavorCategoryAlreadyExists = await FlavorCategory.findOne({
      where: { name: req.body.name },
    });

    if (flavorCategoryAlreadyExists) {
      return res.status(400).json({ error: 'Categoria já existe.' });
    }

    await FlavorCategory.update(req.body, { where: { id: req.body.id } });

    const { id, name } = await FlavorCategory.findByPk(req.body.id);
    return res.json({
      id,
      name,
    });
  },
};

export default FlavorCategoryController;
