/* eslint-disable no-param-reassign */
require("dotenv").config();

const passport = require("passport");
const passportJWT = require("passport-jwt");
const { getAccessUserById } = require("../services/user.service");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_KEY,
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
};

passport.use(
  new JWTStrategy(opts, async (jwtPayload, done) => {
    try {
      const userData = await getAccessUserById(jwtPayload.userId);
      if (!userData) {
        return done(null, false, { message: "User not found!" });
      }
      return done(null, userData);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;
