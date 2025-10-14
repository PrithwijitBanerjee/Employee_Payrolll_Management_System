const initRoles = async (Role) => {
  const defaultRoles = [
    { code: '001', roleName: 'Admin' },
    { code: '002', roleName: 'Employee' }
  ];

  for (const role of defaultRoles) {
    const [_, created] = await Role.findOrCreate({
      where: { code: role.code },
      defaults: { roleName: role.roleName }
    });

    if (created) {
      console.log(`✅ Role '${role.roleName}' inserted.`);
    }
  }
};

module.exports = {
  initRoles
};