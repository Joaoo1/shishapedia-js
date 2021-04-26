import * as Yup from 'yup';
import Image from '../models/Image';
import NarguileItem from '../models/NarguileItem';

const NarguileItemsController = {
  async index(req, res) {
    const items = await NarguileItem.findAll({
      where: { type_id: req.params.typeId },
      include: [
        {
          model: Image,
          as: 'icon',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    return res.json(items);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      size: Yup.string().oneOf(['P', 'M', 'G', 'U']),
      name: Yup.string(),
      description: Yup.string(),
      type_id: Yup.number().required(),
      icon_id: Yup.number().required(),
      brand_id: Yup.number(),
      release_date: Yup.date(),
      images: Yup.array(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    await NarguileItem.create(req.body);

    return res.status(201).json({});
  },
};

export default NarguileItemsController;
