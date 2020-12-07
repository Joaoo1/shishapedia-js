import * as Yup from 'yup';
import Essence from '../models/Essence';
import Image from '../models/Image';

const EssenceController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      brand_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const { page = 1 } = req.query;

    const essences = await Essence.findAll({
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
      brand_id: Yup.number().required(),
      proposal: Yup.string(),
      description: Yup.string(),
      photo_id: Yup.number(),
      release_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const essenceAlreadyExists = await Essence.findOne({
      where: { name: req.body.name },
    });

    if (essenceAlreadyExists) {
      return res.status(400).json({ error: 'Essence already exists' });
    }

    const { id, name } = await Essence.create(req.body);

    return res.json({ id, name });
  },
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      brand_id: Yup.number(),
      proposal: Yup.string(),
      description: Yup.string(),
      photo_id: Yup.number(),
      release_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const essence = await Essence.findByPk(req.body.id);

    if (req.body.name !== essence.name) {
      const essenceExists = await Essence.findOne({
        where: { name: req.body.name },
      });

      if (essenceExists) {
        res.status(401).json({ error: 'Essence already exists' });
      }
    }

    await essence.update(req.body);

    const { id, name, image } = await Essence.findByPk(req.body.id, {
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

export default EssenceController;
