const { default: mongoose } = require("mongoose");
const ResponseFormatter = require("../helpers/responseFormatter.helper");
const {
  selectAllFeatures,
  selectFeature,
  createFeature,
  validateFeatureInputs,
  updateFeature,
  deleteFeature,
} = require("../services/feature.service");

class Feature {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const condition = {};
      if (req.query?.module) {
        condition.moduleId = new mongoose.Types.ObjectId(req.query.module);
      }

      const data = await selectAllFeatures(condition);
      if (!data.success) {
        return ResponseFormatter.InternalServerError(res, data.message);
      }
      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const data = await selectFeature(req.params.id);
      if (!data.success) {
        return ResponseFormatter.error404(res, "Data Not Found", data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const inputs = await validateFeatureInputs(req.body);
      if (!inputs.isValid) {
        return ResponseFormatter.error404(
          res,
          "Data Not Found",
          inputs.message
        );
      }

      const data = await createFeature(inputs.form);
      if (!data.success) {
        return ResponseFormatter.InternalServerError(res, data.message);
      }

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const inputs = await validateFeatureInputs(req.body, req.params.id);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(
          res,
          "Data Not Found",
          inputs.message
        );
      }
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, "Bad Request", inputs.message);
      }

      const data = await updateFeature(req.params.id, inputs.form);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, "Data Not Found", data.message);
      }
      if (!data.success) {
        return ResponseFormatter.InternalServerError(res, data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const data = await deleteFeature(req.params.id);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, "Data Not Found", data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Feature;
