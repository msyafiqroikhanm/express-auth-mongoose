/* eslint-disable no-unused-vars */
const { relative } = require('path');
const deleteFile = require('./deleteFile.helper');
const responseFormatter = require('./responseFormatter.helper');

module.exports = async (err, req, res, next) => {
  // Delete uploaded file when error happens
  if (req.file && !req.file.buffer) {
    await deleteFile(relative(__dirname, req.file.path));
  }

  console.log(err);
  if (!err.code) {
    return responseFormatter.InternalServerError(res);
  }

  res.status(err.code).json({
    meta: {
      success: false,
      code: err.code,
      status: err.status,
      message: err.message,
    },
  });
};
