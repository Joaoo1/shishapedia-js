import * as Yup from 'yup';
import User from '../models/User';
import Image from '../models/Image';

const UserController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    if (req.body.moderator) {
      return res
        .status(400)
        .json({ error: 'Moderator field cannot be informed.' });
    }

    const userAlreadyExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userAlreadyExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, moderator } = await User.create(req.body);

    return res.json({ id, name, email, moderator });
  },
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email().required(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    if (req.body.moderator) {
      return res
        .status(400)
        .json({ error: 'Moderator field cannot be informed.' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        res.status(401).json({ error: 'Email already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    await user.update(req.body);

    const { id, name, image } = await User.findByPk(req.userId, {
      include: [
        { model: Image, as: 'image', attributes: ['id', 'url', 'path'] },
      ],
    });
    return res.json({
      id,
      name,
      email,
      image,
    });
  },
};

export default UserController;
