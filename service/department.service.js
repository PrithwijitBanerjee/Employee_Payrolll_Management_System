const Department = require("../Models/department.model");
const ProjHelp = require("../Models/projhelp");
const { Op } = require("sequelize");

class DepartmentService {
  async createDepartment(data) {
    const { DeptName, DeptStatus } = data;

    const statusExists = await ProjHelp.findOne({
      where: { code: DeptStatus },
    });
    if (!statusExists) {
      throw new Error("Invalid DeptStatus. Status not found in ProjHelp");
    }

    const latest = await Department.findOne({
      order: [["DeptCode", "DESC"]],
    });

    let nextCode = "001";
    if (latest && latest.DeptCode) {
      const latestNum = parseInt(latest.DeptCode, 10);
      nextCode = (latestNum + 1).toString().padStart(3, "0");
    }

    const department = await Department.create({
      DeptCode: nextCode,
      DeptName,
      DeptStatus,
    });

    return department;
  }

  async getAllDepartments() {
    return await Department.findAll({
      include: [
        {
          model: ProjHelp,
          as: "status",
          attributes: ["code", "data"],
        },
      ],
    });
  }

  async getDepartmentByCode(DeptCode) {
    const department = await Department.findByPk(DeptCode, {
      include: [
        {
          model: ProjHelp,
          as: "status",
          attributes: ["code", "data"],
        },
      ],
    });

    if (!department) {
      throw new Error("Department not found");
    }

    return department;
  }

  async updateDepartment(DeptCode, updateData) {
    const department = await Department.findByPk(DeptCode);
    if (!department) {
      throw new Error("Department not found");
    }

    if (updateData.DeptStatus) {
      const statusExists = await ProjHelp.findOne({
        where: { code: updateData.DeptStatus },
      });
      if (!statusExists) {
        throw new Error("Invalid DeptStatus. Status not found in ProjHelp");
      }
    }

    await department.update(updateData);
    return department;
  }

  async deleteDepartment(DeptCode) {
    const department = await Department.findByPk(DeptCode);
    if (!department) {
      throw new Error("Department not found");
    }

    await department.destroy();
    return { message: "Department deleted successfully" };
  }
}

module.exports = new DepartmentService();
