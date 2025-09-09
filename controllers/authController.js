const AuthService = require('../service/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

exports.register = async (req, res) => {
    try {
        const data = await AuthService.registerUser(req.body);
        successResponse(res, 'User registered successfully', data);
    } catch (error) {
        errorResponse(res, error.status || 500, error.message || 'Registration failed', error.error);
    }
};

exports.login = async (req, res) => {
    try {
        const data = await AuthService.loginUser(req.body);
        successResponse(res, 'Login successful', data);
    } catch (error) {
        errorResponse(res, error.status || 500, error.message || 'Login failed', error.error);
    }
};
