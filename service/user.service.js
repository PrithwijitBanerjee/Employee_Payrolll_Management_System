const  User = require('../Models/user');
const  Role  = require('../Models/role');

exports.getAllUsers = async () => {
    const users = await User.findAll({
        include: {
            model: Role,
            as : "roleName",
            attributes: ['code', 'roleName'],
        },
        attributes: { exclude: ['password'] },
    });

    return users;
};
