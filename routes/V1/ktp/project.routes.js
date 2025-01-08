const router = require('express').Router();
const { check, query, param } = require('express-validator');
const KTPProjectController = require('../../../controllers/ktp/project.controller');
const ValidateMiddleware = require('../../../middlewares/validate.middleware');
const AuthMiddleware = require('../../../middlewares/auth.middleware');
const features = require('../../../helpers/features.helper');
const { ENUM_DEPARTMENTS } = require('../../../libraries/ktp.lib');

router.get(
    '/',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_project,
                feature.create_project,
                feature.update_project,
                feature.delete_project,
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
    ],
    ValidateMiddleware.result,
    KTPProjectController.getAll
);

router.get(
    '/:id',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [
                feature.read_project,
                feature.create_project,
                feature.update_project,
                feature.delete_project,
                feature.create_respondent,
            ])
        );
    },
    [param('id', 'id attribute must be ObjectId').isMongoId()],
    ValidateMiddleware.result,
    KTPProjectController.getDetail
);

router.post(
    '/',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.create_project])
        );
    },
    [
        check('projectId', 'projectId attribute is required').notEmpty(),
        check('name', 'name attribute is required').notEmpty(),
        check('department', 'department attribute is required')
            .notEmpty()
            .isIn(ENUM_DEPARTMENTS)
            .withMessage(
                'department must be either "QUALITATIVE" or "QUANTITATIVE"'
            ),
        check('study', 'study attribute is required').notEmpty(),
    ],
    ValidateMiddleware.result,
    KTPProjectController.create
);
router.put(
    '/:id',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.update_project])
        );
    },
    [
        check('projectId', 'projectId attribute is required').notEmpty(),
        check('name', 'name attribute is required').notEmpty(),
        check('department', 'department attribute is required')
            .notEmpty()
            .isIn(ENUM_DEPARTMENTS)
            .withMessage(
                'department must be either QUALITATIVE or QUANTITATIVE'
            ),
        check('study', 'study attribute is required').notEmpty(),
        check('isActive', 'isActive attribute is required')
            .notEmpty()
            .isBoolean()
            .withMessage('isActive must be either true or false'),
        param('id', 'id param must be ObjectId').isMongoId(),
    ],
    ValidateMiddleware.result,
    KTPProjectController.update
);

router.patch(
    '/:id',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.update_project])
        );
    },
    [
        param('id', 'id param must be ObjectId').isMongoId(),
        check('isActive', 'isActive must be either true or false').isBoolean(),
    ],
    ValidateMiddleware.result,
    KTPProjectController.updateActivation
);

router.delete(
    '/:id',
    async (req, res, next) => {
        AuthMiddleware.authenticate(
            req,
            res,
            next,
            await features().then(feature => [feature.delete_project])
        );
    },
    [param('id', 'id param must be ObjectId').isMongoId()],
    ValidateMiddleware.result,
    KTPProjectController.delete
);

module.exports = router;
