const router = require('express').Router();
const { check, query, param } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const UserController = require('../../controllers/user.controller');

router.get(
    '/',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_user,
                feature.create_user,
                feature.update_user,
                feature.delete_user,
                feature.change_password,
            ])
        );
    },
    [
        query('name', 'Name attribute must be string').optional().isString(),
        query('email', 'Email attribute must be string').optional().isString(),
    ],
    ValidateMiddleware.result,
    UserController.getAll
);

router.get(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_user,
                feature.update_user,
                feature.delete_user,
                feature.change_password,
            ])
        );
    },
    [param('id', 'Id attribute must be ObjectId').isMongoId()],
    ValidateMiddleware.result,
    UserController.getDetail
);

router.post(
    '/',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.create_user])
        );
    },
    [
        check('roleId', 'RoleId attribute must be ObjectId').isMongoId(),
        check('name', 'Name attribute cannot be empty').notEmpty(),
        check('email', 'Email attribute must be email format').isEmail(),
        check('password', 'Password attribute cannot be empty').notEmpty(),
    ],
    ValidateMiddleware.result,
    UserController.create
);

router.put(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.update_user])
        );
    },
    [
        check('roleId', 'RoleId attribute must be ObjectId').isMongoId(),
        check('name', 'Name attribute cannot be empty').notEmpty(),
        check('email', 'Email attribute must be email format').isEmail(),
        param('id', 'Id attribute must be ObjectId').isMongoId(),
    ],
    ValidateMiddleware.result,
    UserController.update
);

router.delete(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.delete_user])
        );
    },
    [param('id', 'Id attribute must be ObjectId').isMongoId()],
    ValidateMiddleware.result,
    UserController.delete
);

router.put(
    '/:id/reset-password',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.update_user])
        );
    },
    [
        param('id', 'Id attribute must be ObjectId').isMongoId(),
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
    UserController.resetPassword
);

module.exports = router;
