import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não informado.' });
  }
  // Authorization comes in format "Bearer token...",
  // so split it to get only the token
  const [, token] = authHeader.split(' ');

  try {
    // Decrypt JWT to get info in payload
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
