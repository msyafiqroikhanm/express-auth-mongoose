const router = require('express').Router();
const { check, query, param } = require('express-validator');
const KTPVendorController = require('../../../controllers/ktp/vendor.controller');
const features = require('../../../helpers/features.helper');
const AuthMiddleware = require('../../../middlewares/auth.middleware');
const { ENUM_VENDOR_TYPES } = require('../../../libraries/ktp.lib');
const ValidateMiddleware = require('../../../middlewares/validate.middleware');

router.get(
    '/',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_vendor,
                feature.create_vendor,
                feature.update_vendor,
                feature.delete_vendor,
                feature.create_respondent,
            ])
        );
    },
    [
        query('search', 'Search attribute must be string')
            .optional()
            .isString(),
        query('page', 'Page number must be integer').optional().isInt(),
        query('perPage', 'Page number must be integer').optional().isInt(),
        query('type', 'Type must be either INTERNAL or EXTERNAL')
            .optional()
            .isIn(ENUM_VENDOR_TYPES),
    ],
    ValidateMiddleware.result,
    KTPVendorController.getAll
);
router.get(
    '/:id',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_vendor,
                feature.create_vendor,
                feature.update_vendor,
                feature.delete_vendor,
                feature.create_respondent,
            ])
        );
    },
    [param('id', 'id attribute must be ObjectId').isMongoId()],
    ValidateMiddleware.result,
    KTPVendorController.getDetail
);

router.post(
    '/',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.create_vendor])
        );
    },
    [
        check('name', 'Name attribute is required').isString(),
        check('type', 'Type must be either INTERNAL or EXTERNAL').isIn(
            ENUM_VENDOR_TYPES
        ),
    ],
    ValidateMiddleware.result,
    KTPVendorController.create
);

router.put(
    '/:id',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.update_vendor])
        );
    },
    [
        check('name', 'Name attribute is required').isString(),
        check('type', 'Type must be either INTERNAL or EXTERNAL').isIn(
            ENUM_VENDOR_TYPES
        ),
        param('id', 'id attribute must be ObjectId').isMongoId(),
    ],
    ValidateMiddleware.result,
    KTPVendorController.update
);
router.delete(
    '/:id',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.delete_vendor])
        );
    },
    [param('id', 'id attribute must be ObjectId').isMongoId()],
    ValidateMiddleware.result,
    KTPVendorController.delete
);

module.exports = router;
