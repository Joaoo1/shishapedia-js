import * as Yup from 'yup';

import FlavorCategory from '../models/FlavorCategory';

const FlavorCategoryController = {
  async index(_req, res) {
    const categories = await FlavorCategory.findAll({
      order: ['name'],
      attributes: ['id', 'name'],
    });

    return res.json(categories);
  },
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const flavorAlreadyExists = await FlavorCategory.findOne({
      where: { name: req.body.name },
    });

    if (flavorAlreadyExists) {
      return res.status(400).json({ error: 'Flavor category already exists' });
    }

    const { id, name } = await FlavorCategory.create(req.body);

    return res.json({ id, name });
  },
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const flavorCategoryAlreadyExists = await FlavorCategory.findOne({
      where: { name: req.body.name },
    });

    if (flavorCategoryAlreadyExists) {
      return res.status(400).json({ error: 'Flavor category already exists' });
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
