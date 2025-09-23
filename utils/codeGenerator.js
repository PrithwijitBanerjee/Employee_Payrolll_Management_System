const getNextCode = async (model, codeField, codeLength = 3) => {
  const latest = await model.findOne({
    order: [[codeField, "DESC"]],
    attributes: [codeField],
  });

  const lastCode = latest ? latest[codeField] : null;
  const nextNumber = parseInt(lastCode || "0", 10) + 1;

  return nextNumber.toString().padStart(codeLength, "0");
};

module.exports = {
  getNextCode,
};