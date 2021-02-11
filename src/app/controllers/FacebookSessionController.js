import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

const FacebookSessionController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      facebook_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.user))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const { email, facebook_id } = req.user;

    const user = await User.findOne({
      where: { facebook_id, email },
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não existe.' });
    }

    const jwtToken = jwt.sign({ id: req.user.id }, authConfig.secret);

    return res.redirect(
      `shishapedia://shishapedia.io?id=${user.id}&token=${jwtToken}`
    );
  },
};

export default FacebookSessionController;
