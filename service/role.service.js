const { Op } = require("sequelize");
const Role = require("../Models/role");

exports.createRole = async (roleName) => {
    if (!roleName) throw { status: 400, message: "Role is invalid!" };

    const existData = await Role.findOne({ where: { roleName } });
    if (existData) throw { status: 400, message: "This role already exists!" };

    return await Role.create({ roleName });
};

exports.getAllRoles = async () => {
    const roles = await Role.findAll();
    if (roles.length === 0) throw { status: 404, message: "No data found" };
    return roles;
};

exports.getRoleById = async (id) => {
    const role = await Role.findByPk(id);
    if (!role) throw { status: 404, message: "Role not found" };
    return role;
};

exports.updateRole = async (id, roleName) => {
    if (!roleName) throw { status: 400, message: "Role is invalid!" };

    const existingRole = await Role.findByPk(id);
    if (!existingRole) throw { status: 404, message: "Role not found!" };

    const duplicate = await Role.findOne({
        where: {
            roleName,
            id: { [Op.ne]: id }
        }
    });
    if (duplicate) throw { status: 400, message: "This role already exists!" };

    existingRole.roleName = roleName;
    await existingRole.save();
    return existingRole;
};

exports.deleteRole = async (id) => {
    const role = await Role.findByPk(id);
    if (!role) throw { status: 404, message: "Role not found" };

    await role.destroy();
    return role;
};