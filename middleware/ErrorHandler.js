const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case 400:
            res.json({
                title: "Invalid Input",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        
        case 401:
            res.json({
                title: "Unauthorized",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        
        case 403:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        
        case 404:
            res.json({
                title: "Not Found",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        
        case 422:
            res.json({
                title: "Validation Failed",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        
        case 500:
            res.json({
                title: "Internal Server Error",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        
        case 502:
            res.json({
                title: "Bad Gateway",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        
        case 503:
            res.json({
                title: "Service Unavailable",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        
        default:
            res.json({
                title: "Unexpected Error",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
    }
};

module.exports = errorHandler;