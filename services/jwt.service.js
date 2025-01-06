const jwt = require("jsonwebtoken");
const connectRedis = require("../config/redis");

const createAccessToken = async (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
    expiresIn: parseInt(process.env.JWT_ACCESS_TIME, 10),
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  });

  return accessToken;
};

const createRefreshToken = async (payload) => {
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: parseInt(process.env.JWT_REFRESH_TIME, 10),
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  });

  const redis = connectRedis();
  await redis.set(
    `${process.env.APP_NAME}:SESSIONS:${payload.userId}`,
    refreshToken,
    "EX",
    process.env.JWT_REFRESH_TIME
  );

  return refreshToken;
};

const verifyRefreshToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY);

  const redis = connectRedis();
  const storedToken = await redis.get(
    `${process.env.APP_NAME}:SESSIONS:${decoded.userId}`
  );

  if (storedToken !== token) {
    return null;
  }

  return decoded;
};

const deleteRefreshToken = async (userId) => {
  const redis = connectRedis();
  await redis.del(`${process.env.APP_NAME}:SESSIONS:${userId}`);
};

module.exports = {
  createRefreshToken,
  createAccessToken,
  verifyRefreshToken,
  deleteRefreshToken,
};
