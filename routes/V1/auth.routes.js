/* eslint-disable comma-dangle */
const router = require("express").Router();
const { check } = require("express-validator");
const AuthController = require("../../controllers/auth.controller");
const ValidateMiddleware = require("../../middlewares/validate.middleware");
const Authentication = require("../../middlewares/auth.middleware");
const ResponseFormatter = require("../../helpers/responseFormatter.helper");

router.post(
  "/login",
  [
    check("email", "Invalid email format").isEmail(),
    check("password", "Password is required").notEmpty(),
  ],
  ValidateMiddleware.result,
  AuthController.login
);

router.get(
  "/accesses",
  async (req, res, next) => {
    Authentication.authenticate(req, res, next, null);
  },
  (req, res) => ResponseFormatter.success200(res, "Token Verified")
);

router.get(
  "/refresh-token",
  check("token", "Refresh token is required").notEmpty(),
  ValidateMiddleware.result,
  AuthController.refreshToken
);

router.post(
  "/logout",
  check("token", "Refresh token is required").notEmpty(),
  ValidateMiddleware.result,
  AuthController.logout
);

module.exports = router;
