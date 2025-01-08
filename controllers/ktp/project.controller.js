const ResponseFormatter = require('../../helpers/responseFormatter.helper');
const ResponseHandler = require('../../helpers/responseHandler.helper');
const { getFilterAndPagination } = require('../../helpers/utility.helper');
const { DEFAULT_PAGINATION } = require('../../libraries/general.lib');
const {
    validateProjectInputs,
    createKTPProject,
    selectAllProjects,
    selectProjectDetail,
    updateKTPProject,
    deleteKTPProject,
    updateActivationProject,
} = require('../../services/ktp/project.service');

class KTPProjectController {
    static async getAll(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            // Define fields to search
            const searchFields = ['name', 'projectId'];

            // Get filter and pagination parameters
            const { find, page, perPage } = getFilterAndPagination(
                req.query,
                DEFAULT_PAGINATION,
                searchFields
            );

            // Extra filter
            if (req.query?.active) {
                find.isActive = req.query.active === 'true';
            }

            // Service call
            const data = await selectAllProjects(find, page, perPage);

            // Response
            return ResponseFormatter.success200(
                res,
                data.message,
                data.content,
                data.pagination
            );
        } catch (error) {
            next(error);
        }
    }

    static async getDetail(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const data = await selectProjectDetail(req.params.id);
            if (!data.success) {
                return ResponseHandler.handleError(res, data);
            }

            return ResponseFormatter.success200(
                res,
                data.message,
                data.content
            );
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const inputs = await validateProjectInputs(req.body);
            if (!inputs.isValid) {
                return ResponseHandler.handleError(res, inputs);
            }

            const data = await createKTPProject(inputs.form);

            return ResponseFormatter.success201(
                res,
                data.message,
                data.content
            );
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const inputs = await validateProjectInputs(req.body, req.params.id);
            if (!inputs.isValid) {
                return ResponseHandler.handleError(res, inputs);
            }

            const data = await updateKTPProject(req.params.id, inputs.form);
            if (!data.success) {
                return ResponseHandler.handleError(res, data);
            }

            return ResponseFormatter.success200(
                res,
                data.message,
                data.content
            );
        } catch (error) {
            next(error);
        }
    }

    static async updateActivation(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const inputs = await validateProjectInputs(req.body, req.params.id);
            if (!inputs.isValid) {
                return ResponseHandler.handleError(res, inputs);
            }

            const data = await updateActivationProject(
                req.params.id,
                inputs.form
            );
            if (!data.success) {
                return ResponseHandler.handleError(res, data);
            }

            return ResponseFormatter.success200(
                res,
                data.message,
                data.content
            );
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const data = await deleteKTPProject(req.params.id);
            if (!data.success) {
                return ResponseHandler.handleError(res, data);
            }

            return ResponseFormatter.success200(
                res,
                data.message,
                data.content
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = KTPProjectController;
