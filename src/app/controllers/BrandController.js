import * as Yup from 'yup';
import Brand from '../models/Brand';
import Image from '../models/Image';

const BrandController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      narguile: Yup.boolean(),
      essence: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { narguile, essence } = req.body;

    if (!narguile && !essence) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const field = narguile ? 'narguile' : 'essence';

    const brands = await Brand.findAll({
      where: { [field]: true },
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

    return res.json(brands);
  },
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      image_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const brandAlreadyExists = await Brand.findOne({
      where: { name: req.body.name },
    });

    if (brandAlreadyExists) {
      return res.status(400).json({ error: 'Brand already exists' });
    }

    const { id, name } = await Brand.create(req.body);

    return res.json({ id, name });
  },
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      image_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const informedName = req.body.name ? req.body.name.trim() : '';

    if (informedName) {
      const brandAlreadyExists = await Brand.findOne({
        where: { name: informedName },
      });

      if (brandAlreadyExists) {
        return res.status(400).json({ error: 'Brand already exists' });
      }
    }

    await Brand.update(req.body, { where: { id: req.body.id } });

    const { id, name, image } = await Brand.findByPk(req.body.id, {
      include: [
        { model: Image, as: 'image', attributes: ['id', 'url', 'path'] },
      ],
    });
    return res.json({
      id,
      name,
      image,
    });
  },
};

export default BrandController;
