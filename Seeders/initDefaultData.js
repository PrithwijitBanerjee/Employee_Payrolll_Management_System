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

const initStatus = async (Status) => {
  const defaultStatus = [
    { code: "001", data: "Active", tag : "01" },
    { code: "002", data: "Inactive", tag : "01" },
    { code: "003", data: "Pending", tag : "02" },
    { code: "004", data: "WIP", tag : "02" },
    { code: "005", data: "Completed", tag : "02" },
    { code: "006", data: "Administrator", tag : "03" },
    { code: "007", data: "Developer", tag : "03" }
  ];

  for (const status of defaultStatus) {
    const [_, created] = await Status.findOrCreate({
      where: { code: status.code },
      defaults: { code : status.code, data: status.data, tag : status.tag },
    });

    if (created) {
      console.log(`✅ Role '${status.data}' inserted.`);
    }
  }
};

module.exports = {
  initRoles,
  initAdmin,
  initStatus
};
