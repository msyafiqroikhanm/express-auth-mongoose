const router = require('express').Router();
const ktpProjectRoutes = require('./project.routes');
const ktpVendorRoutes = require('./vendor.routes');

router.use('/projects', ktpProjectRoutes);
router.use('/vendors', ktpVendorRoutes);

module.exports = router;
