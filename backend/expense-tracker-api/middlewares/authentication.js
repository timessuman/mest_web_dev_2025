import config from '../utils/config.js';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authorization = req.get("authorization");
  if (!(authorization && authorization.startsWith("Bearer "))) {
    return res.status(401).json({ error: "Access denied. Login required" });
  }
  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, config.JWT_SECRET, (error, user) => {
    if (error) next(error);
    req.user = user;
    next();
  });
  return;
};
 