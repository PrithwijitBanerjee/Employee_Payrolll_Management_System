const AuthService = require('../service/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

exports.login = async (req, res) => {
    try {
        const data = await AuthService.loginUser(req.body);
        successResponse(res, 'Login successful', data);
    } catch (error) {
        errorResponse(res, error.status || 500, error.message || 'Login failed', error.error);
    }
};
