const router = require('express').Router();
const { check, query, param } = require('express-validator');
const features = require('../../helpers/features.helper');
const featureController = require('../../controllers/feature.controller');
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
                feature.read_feature,
                feature.create_feature,
                feature.update_feature,
                feature.delete_feature,
                feature.create_role,
                feature.update_role,
            ])
        );
    },
    query('module', 'module attribute must be a valid ObjectId')
        .optional()
        .isMongoId(),
    ValidateMiddleware.result,
    featureController.getAll
);

router.get(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_feature,
                feature.update_feature,
                feature.delete_feature,
                feature.create_role,
                feature.update_role,
            ])
        );
    },
    featureController.getDetail
);

router.post(
    '/',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.create_feature])
        );
    },
    [
        check('moduleId', 'moduleId attribute cannot be empty').isMongoId(),
        check('name', 'Name attribute cannot be empty').notEmpty(),
    ],
    ValidateMiddleware.result,
    featureController.create
);

router.put(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.update_feature])
        );
    },
    [
        check('moduleId', 'moduleId attribute cannot be empty').isMongoId(),
        check('name', 'Name attribute cannot be empty').notEmpty(),
        param('id', 'id attribute must be ObjectId').isMongoId(),
    ],
    ValidateMiddleware.result,
    featureController.update
);

router.delete(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.delete_feature])
        );
    },
    [param('id', 'id param must be ObjectId').isMongoId()],
    ValidateMiddleware.result,
    featureController.delete
);

module.exports = router;
