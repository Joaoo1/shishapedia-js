import * as Yup from 'yup';
import User from '../models/User';
import Image from '../models/Image';

const UserController = {
  async show(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: [
        'id',
        'name',
        'email',
        'moderator',
        'google_id',
        'facebook_id',
      ],
      include: [
        {
          model: Image,
          as: 'image',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    if (!user) {
      res.status(401).json({ error: 'Usuário não existe.' });
    }

    user.setDataValue('oauth', !!user.google_id || !!user.facebook_id);

    return res.json(user);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    if (req.body.moderator) {
      return res.status(400).json({ error: 'Erro de permissão.' });
    }

    const userAlreadyExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userAlreadyExists) {
      return res.status(400).json({ error: 'Usuário já existe.' });
    }

    const { id, name, email, moderator } = await User.create(req.body);

    return res.json({ id, name, email, moderator });
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email().required(),
      old_password: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('old_password', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirm_password: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    if (req.body.moderator) {
      return res.status(400).json({ error: 'Erro de permissão.' });
    }

    const { email, old_password } = req.body;
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        res.status(401).json({ error: 'Este email já está em uso' });
      }
    }

    if (old_password && !(await user.checkPassword(old_password))) {
      return res.status(401).json({ error: 'Senhas não conferem.' });
    }

    await user.update(req.body);

    const { id, name, image, google_id, facebook_id } = await User.findByPk(
      req.userId,
      {
        include: [
          { model: Image, as: 'image', attributes: ['id', 'url', 'path'] },
        ],
      }
    );

    return res.json({
      id,
      name,
      email,
      image,
      oauth: !!google_id || !!facebook_id,
    });
  },
};

export default UserController;
