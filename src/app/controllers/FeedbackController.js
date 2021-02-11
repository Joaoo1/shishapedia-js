import * as Yup from 'yup';

import Feedback from '../models/Feedback';

const FeedbackController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      message: Yup.string().required(),
      user_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    await Feedback.create(req.body);

    return res.status(200).json();
  },
};

export default FeedbackController;
