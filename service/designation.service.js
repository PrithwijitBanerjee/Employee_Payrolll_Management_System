const Designation = require("../Models/designation");
const ProjHelp = require("../Models/projhelp");
const { getNextCode } = require("../utils/codeGenerator");

exports.createDesignation = async (data) => {
  const statusExists = await ProjHelp.findOne({ where: { code: data.DesgStatus } });
  if (!statusExists) {
    throw new Error("Invalid DesgStatus: No such code in ProjHelp");
  }

  const newCode = await getNextCode(Designation, "DesgCode", 3);

  const designation = await Designation.create({
    DesgCode: newCode,
    DesgName: data.DesgName,
    DesgStatus: data.DesgStatus,
  });

  return designation;
};

exports.getAllDesignations = async () => {
  return await Designation.findAll({
    include: [
      {
        model: ProjHelp,
        as: "status",
        attributes: ["code", "data"],
      },
    ],
    order: [["DesgCode", "ASC"]],
  });
};

exports.getDesignationByCode = async (code) => {
  return await Designation.findOne({
    where: { DesgCode: code },
    include: [
      {
        model: ProjHelp,
        as: "status",
        attributes: ["code", "data"],
      },
    ],
  });
};

exports.updateDesignation = async (code, updateData) => {
  const designation = await Designation.findOne({ where: { DesgCode: code } });

  if (!designation) return null;

  if (updateData.DesgStatus) {
    const statusExists = await ProjHelp.findOne({ where: { code: updateData.DesgStatus } });
    if (!statusExists) {
      throw new Error("Invalid DesgStatus: No such code in ProjHelp");
    }
  }

  await designation.update(updateData);
  return designation;
};

exports.deleteDesignation = async (code) => {
  const deletedCount = await Designation.destroy({ where: { DesgCode: code } });
  return deletedCount > 0;
};