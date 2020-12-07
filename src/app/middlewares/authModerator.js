import User from '../models/User';

export default async (req, res, next) => {
  const { moderator } = await User.findByPk(req.userId);

  if (moderator) {
    return next();
  }

  return res.status(401).json({ error: 'User is not a moderator' });
};
