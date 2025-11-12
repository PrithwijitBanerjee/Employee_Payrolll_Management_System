const initRoles = async (Role) => {
  const defaultRoles = [
    { code: "001", roleName: "Admin" },
    { code: "002", roleName: "Employee" },
  ];

  for (const role of defaultRoles) {
    const [_, created] = await Role.findOrCreate({
      where: { code: role.code },
      defaults: { roleName: role.roleName },
    });

    if (created) {
      console.log(`✅ Role '${role.roleName}' inserted.`);
    }
  }
};

const { getNextCode } = require("../utils/codeGenerator");
const Employee = require("../Models/employee");
const initAdmin = async (Employees) => {
  try {
    const defaultAdmin = {
      EmplCode: await getNextCode(Employee, "EmplCode", 5),
      EmplName: "Admin",
      Email: "admin@gmail.com",
      Password: "123456",
      role: "001",
      DeptCode: null,
      DesgCode: null,
      EmplType: null,
      EmplStatus: null,
    };

    const [admin, created] = await Employees.findOrCreate({
      where: { Email: defaultAdmin.Email },
      defaults: defaultAdmin,
    });
    // console.log("created: ", created);
    

    if (created) {
      console.log("✅ Default admin account created successfully.");
    } else {
      console.log("ℹ️ Default admin already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};

module.exports = {
  initRoles,
  initAdmin,
};
