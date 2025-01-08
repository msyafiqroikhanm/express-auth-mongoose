const ResponseFormatter = require('../../helpers/responseFormatter.helper');
const ResponseHandler = require('../../helpers/responseHandler.helper');
const { getFilterAndPagination } = require('../../helpers/utility.helper');
const { DEFAULT_PAGINATION } = require('../../libraries/general.lib');
const {
    validateVendorInputs,
    createKTPVendor,
    selectAllVendors,
    selectKTPVendor,
    updateKTPVendor,
    deleteKTPVendor,
} = require('../../services/ktp/vendor.service');

class KTPVendorController {
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
            if (req.query?.type) {
                find.type = req.query.type;
            }

            // Service call
            const data = await selectAllVendors(find, page, perPage);

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

            const data = await selectKTPVendor(req.params.id);
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

            const input = await validateVendorInputs(req.body);
            if (!input.isValid) {
                return ResponseHandler.handleError(res, input);
            }

            const data = await createKTPVendor(input.form);

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

            const inputs = await validateVendorInputs(req.body, req.params.id);
            if (!inputs.isValid) {
                return ResponseHandler.handleError(res, inputs);
            }

            const data = await updateKTPVendor(inputs.form, req.params.id);
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

            const data = await deleteKTPVendor(req.params.id);
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

module.exports = KTPVendorController;
