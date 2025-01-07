require('dotenv').config();
const router = require('express').Router();
const authRoutes = require('./auth.routes');
const moduleRoutes = require('./module.routes');
const featureRoutes = require('./feature.routes');
const roleRoutes = require('./role.routes');
const userRoutes = require('./user.routes');
const profileRoutes = require('./profile.routes');

router.use('/auth', authRoutes);
router.use('/modules', moduleRoutes);
router.use('/features', featureRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
