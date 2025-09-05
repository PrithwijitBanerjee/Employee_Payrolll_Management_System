const {User, Role} = require('../Models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    const { password: _, ...userData } = user.toJSON();

    res.status(201).json({ user: userData, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    const { password: _, ...userData } = user.toJSON();

    res.status(200).json({ user: userData, token });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
                model: Role,
                attributes: ['id', 'roleName']
            },
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            status: true,
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Server error',
            error: err.message
        });
    }
};