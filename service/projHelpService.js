const ProjHelp = require('../Models/projhelp');

exports.findByCode = async (code) => {
  return await ProjHelp.findByPk(code);
};

exports.create = async (data) => {
  return await ProjHelp.create(data);
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
