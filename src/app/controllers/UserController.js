import * as Yup from 'yup';
import crypto from 'crypto';
import User from '../models/User';
import Image from '../models/Image';
import Notification from '../models/Notification';

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
      name: Yup.string().required('Insira um nome'),
      email: Yup.string()
        .email('Insira um email válido')
        .required('Insira um email'),
      password: Yup.string()
        .required('Insira uma senha')
        .min(8, 'Digite uma senha com no minímo 8 dígitos')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
          'Senha precisa conter letras maiúsculas, minúsculas e números.'
        ),
      confirm_password: Yup.string().required('Insira a confirmação da senha'),
      image_id: Yup.number(),
      icon_id: Yup.number(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        return res.status(500).json({ errors: validationErrors });
      }
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro na validação dos dados' });
    }

    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).json({ error: 'Senhas não conferem.' });
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

    const welcomeMessage =
      'Seja bem-vindo ao Shishapedia!\n\nEste é um aplicativo desenvolvido com a intenção de ' +
      'distribuir informação do mundo do narguilé de forma rápida e limpa. \n' +
      'O app ainda está em fase de desenvolvimento e vamos tentar continuar ' +
      'adicionando novas coisas sempre que possível. Então pedimos a sua paciência ' +
      'e colaboração. \nCaso queira nos ajudar, quando encontrar qualquer ' +
      'problema ou ter uma ideia para o app, entre em contato conosco pela ' +
      'aba Feedback ou pela aba Ajuda. \n\n Obrigado.';

    Notification.create({
      title: `Olá, ${name}`,
      message: welcomeMessage,
      user_id: id,
    });

    return res.json({ id, name, email, moderator });
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      old_password: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .matches(
          /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})$/
        )
        .when('old_password', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirm_password: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação de dados falhou.' });
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

  async delete(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      // Delete the files from server
      if (user.image_id) {
        Image.destroy({ where: { id: user.image_id } });
      }

      if (user.icon_id) {
        Image.destroy({ where: { id: user.icon_id } });
      }

      await user.update({
        reset_password_expires: null,
        reset_password_token: null,
        image_id: null,
        facebook_id: null,
        google_id: null,
        password: crypto.randomBytes(10).toString('hex'),
        name: 'Usuário excluido',
        email: crypto.randomBytes(10).toString('hex'),
      });

      return res.status(204).json({});
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro ao excluir usuário' });
    }
  },
};

export default UserController;
