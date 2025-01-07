const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
    selectAllModules,
    selectModule,
    createMainModule,
    createSubModule,
    updateMainModule,
    updateSubModule,
    deleteModule,
    validateModuleQuery,
} = require('../services/module.service');

class ModuleController {
    static async getAll(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const query = await validateModuleQuery(req.query);

            const data = await selectAllModules(query);
            if (!data.success) {
                return ResponseFormatter.InternalServerError(res, data.message);
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

    static async getDetail(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const data = await selectModule(req.params.id);
            if (!data.success) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    data.message
                );
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

    static async createMain(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const data = await createMainModule(req.body);
            if (!data.success && data.code === 400) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
                    data.message
                );
            }
            if (!data.success && data.code === 404) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    data.message
                );
            }

            return ResponseFormatter.success201(
                res,
                data.message,
                data.content
            );
        } catch (error) {
            next(error);
        }
    }

    static async createSub(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const data = await createSubModule(req.body);
            if (!data.success && data.code === 400) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
                    data.message
                );
            }
            if (!data.success && data.code === 404) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    data.message
                );
            }

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

            const data = await updateMainModule(req.params.id, req.body);
            if (!data.success && data.code === 400) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
                    data.message
                );
            }
            if (!data.success && data.code === 404) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    data.message
                );
            }
            if (!data.success) {
                return ResponseFormatter.InternalServerError(res, data.message);
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

    static async updateSub(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const data = await updateSubModule(req.params.id, req.body);
            if (!data.success && data.code === 400) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
                    data.message
                );
            }
            if (!data.success && data.code === 404) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    data.message
                );
            }
            if (!data.success) {
                return ResponseFormatter.InternalServerError(res, data.message);
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

            const data = await deleteModule(req.params.id);
            if (!data.success && data.code === 404) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    data.message
                );
            }
            if (!data.success) {
                return ResponseFormatter.InternalServerError(res, data.message);
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

module.exports = ModuleController;
