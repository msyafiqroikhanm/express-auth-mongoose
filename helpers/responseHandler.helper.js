const ResponseFormatter = require('./responseFormatter.helper');

class ResponseHandler {
    static handleError(res, data) {
        switch (data.code) {
            case 400:
                return ResponseFormatter.error400(
                    res,
                    'Bad Request',
                    data.message
                );
            case 404:
                return ResponseFormatter.error404(
                    res,
                    'Data Not Found',
                    data.message
                );
            default:
                return ResponseFormatter.InternalServerError(
                    res,
                    'An unexpected error occurred.'
                );
        }
    }
}

module.exports = ResponseHandler;
