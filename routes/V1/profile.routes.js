const router = require('express').Router();
const AuthMiddleware = require('../../middlewares/auth.middleware');
const UserController = require('../../controllers/user.controller');
const { check } = require('express-validator');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.get(
    '/',
    async (req, res, next) => {
        AuthMiddleware.authenticate(req, res, next, null);
    },
    UserController.getProfile
);

router.put(
    '/change-password',
    async (req, res, next) => {
        AuthMiddleware.authenticate(req, res, next, null);
    },
    [
        check(
            'oldPassword',
            'Old Password attribute cannot be empty'
        ).notEmpty(),
        check(
            'newPassword',
            'New Password attribute cannot be empty'
        ).notEmpty(),
        check(
            'newRePassword',
            'New Re-Password attribute cannot be empty'
        ).notEmpty(),
    ],
    ValidateMiddleware.result,
    UserController.changePassword
);

module.exports = router;
