const passport = require("passport");
const ResponseFormatter = require("../helpers/responseFormatter.helper");
require("dotenv").config();

class AuthMiddleware {
  static async authenticate(req, res, next, requiredFeatures) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      passport.authenticate(
        "jwt",
        { session: false },
        (err, userData, info) => {
          // authenticate if user have login or not
          if (err) {
            return next(err);
          }
          if (!userData) {
            console.log(info);

            if (info.name === "TokenExpiredError") {
              return ResponseFormatter.error401(
                res,
                "Login expired, please try to re-login"
              );
            }
            if (info.name === "JsonWebTokenError") {
              return ResponseFormatter.error401(res, "Invalid token");
            }
            return ResponseFormatter.error401(
              res,
              "Please login to access this feature"
            );
          }

          req.user = userData;
          res.userLog = {
            id: userData.id,
            role: userData.role.name,
          };

          // check user access
          if (requiredFeatures) {
            const authorized = req.user.role.roleFeatures.some((feature) =>
              requiredFeatures.includes(String(feature.feature._id))
            );

            if (!authorized) {
              return ResponseFormatter.error401(
                res,
                "You Don't Have Access To This Feature"
              );
            }
          }
          return next();
        }
      )(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  static async xAppKey(req, res, next) {
    try {
      if (!req.headers) {
        throw {
          code: 401,
          status: "Unauthorized Request",
          message: "Anda tidak memiliki akses ke layanan ini",
        };
      }
      if (!req.headers["x-app-key"]) {
        throw {
          code: 401,
          status: "Unauthorized Request",
          message: "Anda tidak memiliki akses ke layanan ini",
        };
      }
      if (req.headers["x-app-key"] !== "PTJAKTOURJXBPTJAKTOURJXBPTJAKTOURJXB") {
        throw {
          code: 401,
          status: "Unauthorized Request",
          message: "Anda tidak memiliki akses ke layanan ini",
        };
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthMiddleware;
