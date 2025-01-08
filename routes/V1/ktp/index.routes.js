const router = require('express').Router();
const ktpProjectRoutes = require('./project.routes');

router.use('/projects', ktpProjectRoutes);

module.exports = router;
