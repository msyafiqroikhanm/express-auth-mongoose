const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ModuleController = require('../../controllers/module.controller');
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
                feature.read_module,
                feature.create_module,
                feature.update_module,
                feature.delete_module,
                feature.create_feature,
                feature.update_feature,
            ])
        );
    },
    ModuleController.getAll
);

router.get(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_module,
                feature.update_module,
                feature.delete_module,
                feature.create_feature,
                feature.update_feature,
            ])
        );
    },
    ModuleController.getDetail
);

router.post(
    '/',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.create_module])
        );
    },
    [check('name', 'Name attribute cannot be empty').notEmpty()],
    ValidateMiddleware.result,
    ModuleController.createMain
);

router.post(
    '/sub',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.create_module])
        );
    },
    [
        check(
            'parentModuleId',
            'Parent Module Id attribute must be ObjectId'
        ).isMongoId(),
        check('name', 'Name attribute cannot be empty').notEmpty(),
    ],
    ValidateMiddleware.result,
    ModuleController.createSub
);

router.put(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.update_module])
        );
    },
    [check('name', 'Name attribute cannot be empty').notEmpty()],
    ValidateMiddleware.result,
    ModuleController.update
);

router.put(
    '/sub/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.update_module])
        );
    },
    [
        check(
            'parentModuleId',
            'Parent Module Id attribute must be ObjectId'
        ).isMongoId(),
        check('name', 'Name attribute cannot be empty').notEmpty(),
    ],
    ValidateMiddleware.result,
    ModuleController.updateSub
);

router.delete(
    '/:id',
    async (req, res, next) => {
        Authentication.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.delete_module])
        );
    },
    ModuleController.delete
);

module.exports = router;
