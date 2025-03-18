import config from '../utils/config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check if user exists
  const passwordCorrect = user === null
   ? false
   : await bcrypt.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Generate JWT token
  const userToken = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    isAuthenticated: true
  }
  const token = jwt.sign(
    userToken,
    config.JWT_SECRET,
    { expiresIn: config.TOKEN_VALIDITY }
  );
  res.status(200).json({ 
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name
    }
  });
};