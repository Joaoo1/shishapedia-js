import * as Yup from 'yup';
import Brand from '../models/Brand';
import Image from '../models/Image';

const BrandController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      image_id: Yup.number().required(),
      icon_id: Yup.number().required(),
      essence: Yup.bool(),
      narguile: Yup.bool(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const brandAlreadyExists = await Brand.findOne({
      where: { name: req.body.name },
    });

    if (brandAlreadyExists) {
      return res.status(400).json({ error: 'A marca já está cadastrada.' });
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
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const informedName = req.body.name ? req.body.name.trim() : '';

    if (informedName) {
      const brandAlreadyExists = await Brand.findOne({
        where: { name: informedName },
      });

      if (brandAlreadyExists) {
        return res.status(400).json({ error: 'A marca já está cadastrada.' });
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
