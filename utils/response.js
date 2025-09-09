exports.successResponse = (res, message, data = {}) => {
    return res.status(200).json({
        status: true,
        message,
        data
    });
};

exports.errorResponse = (res, statusCode, message, error = null) => {
    return res.status(statusCode).json({
        status: false,
        message,
        error
    });
};