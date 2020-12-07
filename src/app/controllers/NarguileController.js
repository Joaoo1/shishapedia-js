import * as Yup from 'yup';
import Narguile from '../models/Narguile';
import Image from '../models/Image';

const NarguileController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      brand_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const { page = 1 } = req.query;

    const essences = await Narguile.findAll({
      where: { brand_id: req.body.brand_id },
      order: ['name'],
      attributes: ['id', 'name'],
      limit: 30,
      offset: (page - 1) * 30,
      include: [
        {
          model: Image,
          as: 'image',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    return res.json(essences);
  },
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      size: Yup.string().oneOf(['P', 'M', 'G']),
      description: Yup.string(),
      photo_id: Yup.number(),
      release_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const narguileAlreadyExists = await Narguile.findOne({
      where: { name: req.body.name },
    });

    if (narguileAlreadyExists) {
      return res.status(400).json({ error: 'Narguile already exists' });
    }

    const { id, name } = await Narguile.create(req.body);

    return res.json({ id, name });
  },
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      size: Yup.string().oneOf(['P', 'M', 'G']),
      description: Yup.string(),
      photo_id: Yup.number(),
      release_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const narguile = await Narguile.findByPk(req.body.id);

    if (req.body.name && req.body.name !== narguile.name) {
      const narguileExists = await Narguile.findOne({
        where: { name: req.body.name },
      });

      if (narguileExists) {
        res.status(401).json({ error: 'Narguile already exists' });
      }
    }

    await narguile.update(req.body);

    const { id, name, image } = await Narguile.findByPk(req.body.id, {
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

export default NarguileController;
