import * as Yup from 'yup';

import HelpRequest from '../models/HelpRequest';

const HelpRequestController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      message: Yup.string().required(),
      user_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    await HelpRequest.create(req.body);

    return res.status(200).json();
  },
};

export default HelpRequestController;
