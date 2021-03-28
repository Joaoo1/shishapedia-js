import * as Yup from 'yup';
import Brand from '../models/Brand';
import Essence from '../models/Essence';
import EssenceReview from '../models/EssenceReview';
import Image from '../models/Image';

const EssenceController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      brand_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }
    // const { page = 1 } = req.query;

    const essences = await Essence.findAll({
      where: { brand_id: req.params.brand_id },
      order: ['name'],
      attributes: ['id', 'name', 'proposal', 'description', 'release_date'],
      // limit: 30,
      // offset: (page - 1) * 30,
      include: [
        {
          model: Image,
          as: 'image',
          attributes: ['url', 'path'],
        },
        {
          model: Image,
          as: 'icon',
          attributes: ['url', 'path'],
        },
      ],
    });

    // TODO: CHANGE TO DO THIS WHEN OPEN A ESSENCEINFO
    const results = await Promise.all(
      essences.map(async (essence) => {
        const reviews = await EssenceReview.findAll({
          where: { essence_id: essence.id },
        });
        essence.dataValues.reviews = reviews.length;
        if (reviews.length === 0) {
          essence.dataValues.averageRating = '0';
          return essence;
        }

        let allRatings = 0;
        reviews.forEach((r) => {
          allRatings += r.dataValues.rating;
        });
        essence.dataValues.averageRating = (
          allRatings / reviews.length
        ).toFixed(2);
        return essence;
      })
    );
    // TODO: CREATE A FIELD ESSENCES TO SEND RESPONSE
    return res.json(results);
  },

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const essence = await Essence.findByPk(req.params.id, {
      attributes: ['id', 'name', 'proposal', 'description', 'release_date'],
      include: [
        {
          model: Image,
          as: 'image',
          attributes: ['id', 'url', 'path'],
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(essence || {});
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
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const essenceAlreadyExists = await Essence.findOne({
	where: { name: req.body.name, brand_id: req.body.brand_id },
    });

    if (essenceAlreadyExists) {
      return res.status(400).json({ error: 'Essência já existe.' });
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
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const essence = await Essence.findByPk(req.body.id);

    if (req.body.name !== essence.name) {
      const essenceExists = await Essence.findOne({
        where: { name: req.body.name, brand_id: req.body.brand_id },
      });

      if (essenceExists) {
        res.status(401).json({ error: 'Essência já existe.' });
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
