const User  = require('../Models/user');
const role  = require('../Models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getNextCode } = require("../utils/codeGenerator");

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async ({ name, email, password, role }) => {
    if (!name || !email || !password) {
        throw { status: 400, message: 'Name, email, and password are required' };
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw { status: 409, message: 'Email already in use' };
    }

    const code = await getNextCode(User, 'code', 5)
    const user = await User.create({ code, name, email, password, role });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '1d',
    });

    const { password: _, ...userData } = user.toJSON();

    return { user: userData, token };
};

exports.loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw { status: 400, message: 'Email and password are required' };
    }

    const user = await User.findOne({ where: { email },
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

    // Correct way to access the password - use get() method or direct property access
    const hashedPassword = user.get('password');
    console.log("hashedPassword: ", hashedPassword);
    console.log("password: ", password);
    

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
        throw { status: 401, message: 'Invalid password' };
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '1d',
    });

    const { password: _, ...userData } = user.toJSON();

    return { user: userData, token };
};