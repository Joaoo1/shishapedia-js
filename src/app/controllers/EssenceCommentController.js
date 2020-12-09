import * as Yup from 'yup';

import EssenceComment from '../models/EssenceComment';
import User from '../models/User';

const EssenceCommentController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const { page = 1 } = req.query;

    const essencesComments = await EssenceComment.findAll({
      where: { essence_id: req.params.id },
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
    const schemaId = Yup.object().shape({
      id: Yup.number().required(),
    });

    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      comment: Yup.string(),
      rate: Yup.number().oneOf([1, 2, 3, 4, 5]).required(),
    });

    if (
      !(await schemaId.isValid(req.params)) ||
      !(await schema.isValid(req.body))
    ) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = await EssenceComment.create({
      ...req.body,
      essence_id: req.params.id,
    });

    const { user, comment, rate } = await EssenceComment.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
    });

    return res.json({ id, user, comment, rate });
  },
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      rate: Yup.number().oneOf([1, 2, 3, 4, 5]).required(),
      comment: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const essenceComment = await EssenceComment.findByPk(req.body.id);
    if (!essenceComment) {
      return res.status(400).json({ error: 'Comment not found' });
    }

    if (essenceComment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot update comments that is not yours!' });
    }
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
  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const essenceComment = await EssenceComment.findByPk(req.body.id);
    if (!essenceComment) {
      return res.status(400).json({ error: 'Comment not found' });
    }

    if (essenceComment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot delete comments that is not yours!' });
    }
    await essenceComment.destroy();

    return res.status(200).json();
  },
};

export default EssenceCommentController;
