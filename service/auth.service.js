const User  = require('../Models/employee');
const role  = require('../Models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getNextCode } = require("../utils/codeGenerator");

const JWT_SECRET = process.env.JWT_SECRET;


exports.loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw { status: 400, message: 'Email and password are required' };
    }

    const user = await User.findOne({ where: { Email : email },
    include : [
        {
            model : role,
            as : "roleName",
            attributes: ["code", "roleName"]
        }
    ] });
    if (!user) {
        throw { status: 401, message: 'Invalid email' };
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
        throw { status: 401, message: 'Invalid password' };
    }


    const token = jwt.sign({ id: user.id, email: user.Email, role: user.role, code : user.EmplCode }, JWT_SECRET, {
        expiresIn: '1d',
    });

    const { password: _, ...userData } = user.toJSON();

    return { user: userData, token };
};