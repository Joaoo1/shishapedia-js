import * as Yup from 'yup';

import EssenceComment from '../models/EssenceComment';
import User from '../models/User';

const EssenceCommentController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      brand_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const { page = 1 } = req.query;

    const essencesComments = await EssenceComment.findAll({
      where: { essence_id: req.body.essence_id },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'comment', 'rate'],
      limit: 30,
      offset: (page - 1) * 30,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(essencesComments);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      essence_id: Yup.number().required(),
      comment: Yup.string(),
      rate: Yup.number().oneOf([1, 2, 3, 4, 5]).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = await EssenceComment.create(req.body);

    const { user, comment, rate } = await EssenceComment.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
    });

    return res.json({ id, user, comment, rate });
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      rate: Yup.number().required(),
      comment: Yup.string(),
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const essenceComment = await EssenceComment.findByPk(req.body.id);
    await essenceComment.update(req.body);

    const { user, comment, rate } = await EssenceComment.findByPk(req.body.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
    });
    return res.json({
      user,
      comment,
      rate,
    });
  },
};

export default EssenceCommentController;
