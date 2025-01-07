const router = require('express').Router();
const { check } = require('express-validator');
const AuthController = require('../../controllers/auth.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.post(
    '/login',
    [
        check('email', 'Invalid email format').isEmail(),
        check('password', 'Password is required').notEmpty(),
    ],
    ValidateMiddleware.result,
    AuthController.login
);

router.get(
    '/refresh-token',
    check('token', 'Refresh token is required').notEmpty(),
    ValidateMiddleware.result,
    AuthController.refreshToken
);

router.post(
    '/logout',
    check('token', 'Refresh token is required').notEmpty(),
    ValidateMiddleware.result,
    AuthController.logout
);

module.exports = router;
