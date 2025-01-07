const router = require('express').Router();
const { check, param } = require('express-validator');
const features = require('../../helpers/features.helper');
const RoleController = require('../../controllers/role.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');

router.get(
    '/',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_role,
                feature.create_role,
                feature.update_role,
                feature.delete_role,
                feature.create_user,
                feature.update_user,
            ])
        );
    },
    RoleController.getAll
);

router.get(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_role,
                feature.update_role,
                feature.delete_role,
                feature.create_user,
                feature.update_user,
            ])
        );
    },
    [param('id', 'id param must be ObjectId').isMongoId()],
    ValidateMiddleware.result,
    RoleController.getDetail
);

router.post(
    '/',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.create_role])
        );
    },
    [
        check('name', 'Name attribute cannot be empty').notEmpty(),
        check(
            'isAdministrative',
            'Administrative attribute cannot be empty'
        ).notEmpty(),
        check('features', 'Feature attribute cannot be empty').notEmpty(),
    ],
    ValidateMiddleware.result,
    RoleController.create
);

router.put(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.update_role])
        );
    },
    [
        check('name', 'Name attribute cannot be empty').notEmpty(),
        check(
            'isAdministrative',
            'Administrative attribute cannot be empty'
        ).notEmpty(),
        check('features', 'Feature attribute cannot be empty').notEmpty(),
        param('id', 'id param must be ObjectId').isMongoId(),
    ],
    ValidateMiddleware.result,
    RoleController.update
);

router.delete(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.delete_role])
        );
    },
    [param('id', 'id param must be ObjectId').isMongoId()],
    ValidateMiddleware.result,
    RoleController.delete
);

module.exports = router;
