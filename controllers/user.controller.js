const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
    selectAllUsers,
    createUser,
    validateUserInputs,
    updateUser,
    deleteUser,
    validatePasswordInputs,
    updateUserPassword,
    selectDetailUser,
    validateResetPassword,
} = require('../services/user.service');

class UserController {
    static async getAll(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const find = {};
            if (req.query) {
                req.query.email
                    ? (find.email = { $regex: req.query.email, $options: 'i' })
                    : null;
                req.query.name
                    ? (find.name = { $regex: req.query.name, $options: 'i' })
                    : null;
            }
            const data = await selectAllUsers(find);

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

            const data = await selectDetailUser(req.params.id);
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

    static async getProfile(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const data = await selectDetailUser(req.user._id);
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

    static async create(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const inputs = await validateUserInputs(req.body);
            if (!inputs.isValid && inputs.code === 404) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    inputs.message
                );
            }
            if (!inputs.isValid && inputs.code === 400) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
                    inputs.message
                );
            }

            const data = await createUser(inputs.form);

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

            const inputs = await validateUserInputs(req.body, req.params.id);
            if (!inputs.isValid && inputs.code === 404) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    inputs.message
                );
            }
            if (!inputs.isValid && inputs.code === 400) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
                    inputs.message
                );
            }

            const data = await updateUser(req.params.id, inputs.form);
            if (!data.success && data.code === 404) {
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

    static async delete(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const data = await deleteUser(req.params.id);
            if (!data.success && data.code === 404) {
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

    static async changePassword(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const inputs = await validatePasswordInputs(req.user._id, req.body);
            if (!inputs.isValid && inputs.code === 400) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
                    inputs.message
                );
            }
            if (!inputs.isValid && inputs.code === 404) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    inputs.message
                );
            }

            const data = await updateUserPassword(inputs.form);
            if (!data.success) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
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

    static async resetPassword(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const inputs = await validateResetPassword(req.body, req.params.id);
            if (!inputs.isValid && inputs.code === 400) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
                    inputs.message
                );
            }
            if (!inputs.isValid && inputs.code === 404) {
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    inputs.message
                );
            }

            const data = await updateUserPassword(inputs.form);
            if (!data.success) {
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
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
}

module.exports = UserController;
