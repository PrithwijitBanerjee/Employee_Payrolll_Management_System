const ProjHelp = require('../Models/projhelp');
const { getNextCode } = require('../utils/codeGenerator');

exports.findByCode = async (code) => {
  return await ProjHelp.findByPk(code);
};

exports.create = async (data) => {
  const newCode = await getNextCode(ProjHelp, "code", 3);
  return await ProjHelp.create({data : data.data, code : newCode, tag : data.tag});
};

exports.findAll = async () => {
  return await ProjHelp.findAll();
};

exports.update = async (code, data) => {
  const entry = await ProjHelp.findByPk(code);
  if (!entry) return null;
  return await entry.update(data);
};

exports.delete = async (code) => {
  const entry = await ProjHelp.findByPk(code);
  if (!entry) return null;
  await entry.destroy();
  return entry;
};

exports.findByTag = async (tag) => {
  return await ProjHelp.findAll({where : {tag}});
};