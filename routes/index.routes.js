require('dotenv').config();
const router = require('express').Router();
const AuthMiddleware = require('../middlewares/auth.middleware');
const v1Routes = require('./V1/index.routes');

router.get('/', (_req, res) =>
    res.send({ app: `${process.env.APP_NAME} App ` })
);

router.use('/v1', AuthMiddleware.xAPIKey, v1Routes);

module.exports = router;
