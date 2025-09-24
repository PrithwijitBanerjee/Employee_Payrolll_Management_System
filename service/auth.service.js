const User  = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async ({ name, email, password, role }) => {
    if (!name || !email || !password) {
        throw { status: 400, message: 'Name, email, and password are required' };
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw { status: 409, message: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, role });

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

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw { status: 401, message: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("isMatch: ", isMatch);
    console.log("password: ", password);
    
    
    if (!isMatch) {
        throw { status: 401, message: 'Invalid email or password' };
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '1d',
    });

    const { password: _, ...userData } = user.toJSON();

    return { user: userData, token };
};