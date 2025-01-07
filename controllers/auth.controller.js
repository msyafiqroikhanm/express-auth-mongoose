const bcryptjs = require('bcryptjs');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
    selectUser,
    updateLastLoginUser,
    getAccessUserById,
} = require('../services/user.service');
const {
    createAccessToken,
    createRefreshToken,
    verifyRefreshToken,
    deleteRefreshToken,
} = require('../services/jwt.service');

class AuthController {
    static async login(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const user = await selectUser({
                email: req.body.email,
            });

            if (!user) {
                return ResponseFormatter.error401(
                    res,
                    'Invalid user or password'
                );
            }

            if (!bcryptjs.compareSync(req.body.password, user.password)) {
                return ResponseFormatter.error401(
                    res,
                    'Invalid user or password'
                );
            }

            const payload = {
                userId: user.id,
                roleId: user.roleId,
            };

            const accessToken = await createAccessToken(payload);
            const refreshToken = await createRefreshToken(payload);

            const userPermissions = await getAccessUserById(user.id);
            await updateLastLoginUser(user.id);
            const message = 'Login Successfully';

            return ResponseFormatter.success200(res, message, {
                name: user.name,
                role: userPermissions.role.name,
                access_token: `Bearer ${accessToken}`,
                refresh_token: `Bearer ${refreshToken}`,
                modules: userPermissions.modules,
            });
        } catch (error) {
            next(error);
        }
    }

    static async refreshToken(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const payload = await verifyRefreshToken(
                req.body.token.split(' ')[1]
            );
            if (!payload) {
                return ResponseFormatter.error401(res, 'Invalid refresh token');
            }

            const accessToken = await createAccessToken({
                userId: payload.userId,
                roleId: payload.roleId,
            });

            return ResponseFormatter.success200(
                res,
                'Refresh token successfully',
                {
                    access_token: `Bearer ${accessToken}`,
                }
            );
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            res.url = `${req.method} ${req.originalUrl}`;
            res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const payload = await verifyRefreshToken(
                req.body.token.split(' ')[1]
            );
            if (!payload) {
                return ResponseFormatter.error401(res, 'Invalid refresh token');
            }

            await deleteRefreshToken(payload.userId);

            return ResponseFormatter.success200(res, 'Logout successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
