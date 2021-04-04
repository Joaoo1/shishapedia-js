import * as Yup from 'yup';

import EssenceReview from '../models/EssenceReview';
import User from '../models/User';

const EssenceReviewController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }
    const { page = 1 } = req.query;

    const essenceReviews = await EssenceReview.findAll({
      where: { essence_id: req.params.id },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'comment', 'rating', ['created_at', 'date']],
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

    const response = { reviews: essenceReviews, averageRating: 0 };
    let allRatings = 0;
    essenceReviews.forEach((r) => {
      allRatings += r.dataValues.rating;
    });
    if (allRatings > 0) {
      response.averageRating = (allRatings / essenceReviews.length).toFixed(2);
    } else {
      response.averageRating = 0;
    }

    return res.json(response);
  },

  async store(req, res) {
    const schemaId = Yup.object().shape({
      id: Yup.number().required(),
    });

    const schema = Yup.object().shape({
      comment: Yup.string(),
      rating: Yup.number().oneOf([1, 2, 3, 4, 5]).required(),
    });

    if (
      !(await schemaId.isValid(req.params)) ||
      !(await schema.isValid(req.body))
    ) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const reviewAlreadyExists = await EssenceReview.findOne({
      where: { user_id: req.userId, essence_id: req.params.id },
    });

    if (reviewAlreadyExists) {
      return res
        .status(400)
        .json({ error: 'Você já possui uma avaliação para esta essência' });
    }

    const { id } = await EssenceReview.create({
      user_id: req.userId,
      rating: req.body.rating,
      comment: req.body.comment,
      essence_id: req.params.id,
    });

    const { user, comment, rating } = await EssenceReview.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
    });

    return res.json({ id, user, comment, rating });
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      rating: Yup.number().oneOf([1, 2, 3, 4, 5]).required(),
      comment: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const essenceReview = await EssenceReview.findByPk(req.body.id);
    if (!essenceReview) {
      return res.status(400).json({ error: 'Comentário não encontrado.' });
    }

    if (essenceReview.user_id !== req.userId) {
      return res.status(401).json({
        error: 'Sem permissão para alterar o comentário!',
      });
    }
    await essenceReview.update(req.body);

    const { user, comment, rating } = await EssenceReview.findByPk(
      req.body.id,
      {
        include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      }
    );

    return res.json({
      user,
      comment,
      rating,
    });
  },

  async destroy(req, res) {
    const schema = Yup.object().shape({
      reviewId: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const essenceReview = await EssenceReview.findByPk(req.params.reviewId);
    if (!essenceReview) {
      return res.status(400).json({ error: 'Comentário não encontrado.' });
    }

    if (essenceReview.user_id !== req.userId) {
      return res.status(401).json({
        error: 'Sem permissão para excluir o comentário de outas pessoas!',
      });
    }
    await essenceReview.destroy();

    return res.status(200).json();
  },
};

export default EssenceReviewController;
