const ResponseFormatter = require("../helpers/responseFormatter.helper");
const {
  selectAllRoles,
  selectRole,
  validateRoleInputs,
  createRole,
  updateRole,
  deleteRole,
} = require("../services/role.service");

class RoleController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const data = await selectAllRoles();

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const data = await selectRole(req.params.id);
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

      const inputs = await validateRoleInputs(req.body);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, "Bad Request", inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(
          res,
          "Data Not Found",
          inputs.message
        );
      }

      const data = await createRole(inputs.form);

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const inputs = await validateRoleInputs(req.body, req.params.id);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, "Bad Request", inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(
          res,
          "Data Not Found",
          inputs.message
        );
      }

      const data = await updateRole(req.params.id, inputs.form);
      if (!data.succcess) {
        return ResponseFormatter.error404(res, "Data Not Found", data.message);
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

      const data = await deleteRole(req.params.id);
      if (!data.isValid && data.code === 400) {
        return ResponseFormatter.error400(res, "Bad Request", data.message);
      }
      if (!data.isValid && data.code === 404) {
        return ResponseFormatter.error404(res, "Data Not Found", data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoleController;
