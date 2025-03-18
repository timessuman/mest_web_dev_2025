const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

const JWT_SECRET = process.env.JWT_SECRET;

const TOKEN_VALIDITY = process.env.TOKEN_VALIDITY;

const NODE_ENV = process.env.NODE_ENV;


export default {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  TOKEN_VALIDITY,
  NODE_ENV
};