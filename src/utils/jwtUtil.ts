import jwt from 'jsonwebtoken';
const secretAccessKey = process.env.JWT_ACCESS_SECRET || 'secretKey';
const accessExpiration = Number(process.env.JWT_ACCESS_EXPIRATION || 900);

const generateAccessToken = function (payload: any) {
  const exp = accessExpiration * 1000;
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
  const exp = refreshExpiration * 1000;
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
const verify = function (token: string, tokenType: 'access' | 'refresh') {
  try {
    const decoded = jwt.verify(
      token,
      tokenType === 'access' ? secretAccessKey : secretRefreshKey
    );
    return decoded;
  } catch (e) {
    throw e;
  }
};
export default {
  generateAccessToken,
  generateTokens,
  generateRefreshToken,
  verify,
};
