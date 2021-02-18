import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

const SessionController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Senhas não conferem.' });
    }

    return res.status(200).json({
      id: user.id,
      token: jwt.sign({ id: user.id }, authConfig.secret),
    });
  },
};

export default SessionController;
