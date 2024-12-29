import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET || 'secretKey';
const expiration = '1h';

const generateToken = function (payload: any) {
  return jwt.sign(payload, secretKey, {
    expiresIn: expiration,
  });
};

export default { generateToken, secretKey };
