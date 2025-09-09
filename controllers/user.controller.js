const UserService = require('../service/user.service');
const { successResponse, errorResponse } = require('../utils/response');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        successResponse(res, 'Users retrieved successfully', users);
    } catch (error) {
        errorResponse(res, error.status || 500, error.message || 'Error retrieving users', error.error);
    }
};
