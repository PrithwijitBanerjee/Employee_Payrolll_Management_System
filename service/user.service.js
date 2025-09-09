const { User, Role } = require('../Models');

exports.getAllUsers = async () => {
    const users = await User.findAll({
        include: {
            model: Role,
            attributes: ['id', 'roleName'],
        },
        attributes: { exclude: ['password'] },
    });

    return users;
};
