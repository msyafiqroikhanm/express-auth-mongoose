const LoggerService = require('../services/logger.service');

class ResponseFormatter {
    static async InternalServerError(res, msg) {
        const status = 'Internal Server Error';
        const code = 500;
        if (res.url) {
            const logger = new LoggerService(res.url);
            if (res.userLog) {
                logger.setUserData(res.userLog);
            }
            logger.setLogData(msg);
            logger.error(code, status);
        }
        res.status(code).json({ meta: { success: false, code, status } });
    }

    static async success(res, code, status, message, data) {
        return res.status(code).json({
            meta: {
                success: true,
                code,
                status,
                message,
            },
            data,
        });
    }

    static async success200(res, message, data, pagination) {
        const code = 200;
        const status = 'OK';
        if (res.url) {
            const logger = new LoggerService(res.url);
            if (res.userLog) {
                logger.setUserData(res.userLog);
            }
            if (res.ip) {
                logger.setIP(res.ip);
            }
            logger.info(code, message);
        }
        const meta = {
            success: true,
            code,
            status,
            message,
        };
        if (pagination) {
            meta.pagination = pagination;
        }
        return res.status(code).json({
            meta,
            data,
        });
    }

    static async success201(res, message, data) {
        const code = 201;
        const status = 'Created';
        if (res.url) {
            const logger = new LoggerService(res.url);
            if (res.userLog) {
                logger.setUserData(res.userLog);
            }
            if (res.ip) {
                logger.setIP(res.ip);
            }

            logger.info(code, message);
        }
        return res.status(code).json({
            meta: {
                success: true,
                code,
                status,
                message,
            },
            data,
        });
    }

    static async error400(res, message, data) {
        const code = 400;
        const status = 'Bad Request';
        if (res.url) {
            const logger = new LoggerService(res.url);
            if (res.userLog) {
                logger.setUserData(res.userLog);
            }
            if (res.ip) {
                logger.setIP(res.ip);
            }
            logger.warn(code, message);
        }
        return res.status(code).json({
            meta: {
                success: false,
                code,
                status,
                message,
            },
            data,
        });
    }

    static async error401(res, message, data) {
        const code = 401;
        const status = 'Unauthorized';
        if (res.url) {
            const logger = new LoggerService(res.url);
            if (res.userLog) {
                logger.setUserData(res.userLog);
            }
            if (res.ip) {
                logger.setIP(res.ip);
            }
            logger.warn(code, message);
        }
        return res.status(code).json({
            meta: {
                success: false,
                code,
                status,
                message,
            },
            data,
        });
    }

    static async error404(res, message, data) {
        const code = 404;
        const status = 'Not Found';
        if (res.url) {
            const logger = new LoggerService(res.url);
            if (res.userLog) {
                logger.setUserData(res.userLog);
            }
            if (res.ip) {
                logger.setIP(res.ip);
            }
            logger.warn(code, message);
        }
        return res.status(code).json({
            meta: {
                success: false,
                code,
                status,
                message,
            },
            data,
        });
    }

    static async error406(res, message, data) {
        const code = 406;
        const status = 'Not Acceptable';
        if (res.url) {
            const logger = new LoggerService(res.url);
            if (res.userLog) {
                logger.setUserData(res.userLog);
            }
            if (res.ip) {
                logger.setIP(res.ip);
            }
            logger.warn(code, message);
        }
        return res.status(code).json({
            meta: {
                success: false,
                code,
                status,
                message,
            },
            data,
        });
    }

    static async error409(res, message, data) {
        const code = 409;
        const status = 'Conflict';
        if (res.url) {
            const logger = new LoggerService(res.url);
            if (res.userLog) {
                logger.setUserData(res.userLog);
            }
            if (res.ip) {
                logger.setIP(res.ip);
            }
            logger.warn(code, message);
        }
        return res.status(code).json({
            meta: {
                success: false,
                code,
                status,
                message,
            },
            data,
        });
    }
}
module.exports = ResponseFormatter;
