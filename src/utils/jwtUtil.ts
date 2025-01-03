import jwt from 'jsonwebtoken';
const secretAccessKey = process.env.JWT_ACCESS_SECRET || 'secretKey';
const accessExpiration = Number(process.env.JWT_ACCESS_EXPIRATION || 900);

const generateAccessToken = function (payload: any) {
  const current = new Date();
  const exp = new Date(current.getTime() + accessExpiration * 1000);
  return {
    token: jwt.sign(payload, secretAccessKey, {
      expiresIn: accessExpiration,
    }),
    exp,
  };
};

const secretRefreshKey = process.env.JWT_REFRESH_SECRET || 'secretKey';
const refreshExpiration = Number(process.env.JWT_REFRESH_EXPIRATION || 907200);
const generateRefreshToken = function (payload: any) {
  const current = new Date();
  const exp = new Date(current.getTime() + refreshExpiration * 1000);
  return {
    token: jwt.sign(payload, secretRefreshKey, {
      expiresIn: refreshExpiration,
    }),
    exp,
  };
};

const generateTokens = function (payload: any) {
  return {
    access: generateAccessToken(payload),
    refresh: generateRefreshToken(payload),
  };
};

export default {
  generateAccessToken,
  secretAccessKey,
  generateTokens,
  generateRefreshToken,
  secretRefreshKey,
};
