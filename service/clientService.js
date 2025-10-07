const Client = require("../Models/client");
const ProjHelp = require("../Models/projhelp");
const {getNextCode} = require("../utils/codeGenerator");

const getAllClients = async () => {
  return await Client.findAll({
    include: {
      model: ProjHelp,
      as: "status",
      attributes: ["code", "data", "tag"],
    },
  });
};

const getClientByCode = async (clientCode) => {
  return await Client.findByPk(clientCode, {
    include: {
      model: ProjHelp,
      as: "status",
    },
  });
};

const createClient = async (clientData) => {
  if (!clientData.ClientName || !clientData.ClientStatus) {
    throw new Error("ClientName and ClientStatus are required");
  }

  const statusExists = await ProjHelp.findOne({
    where: { code: clientData.ClientStatus },
  });
  if (!statusExists) {
    throw new Error("Invalid ClientStatus: No such code in ProjHelp");
  }

  const newCode = await getNextCode(Client, "ClientCode", 6);

  return await Client.create({
    ClientCode: newCode,
    ClientName: clientData.ClientName,
    ClientStatus: clientData.ClientStatus,
  });
};

const updateClient = async (clientCode, clientData) => {
  const client = await Client.findByPk(clientCode);
  if (!client) {
    throw new Error("Client not found");
  }

  if (clientData.ClientStatus) {
    const statusExists = await ProjHelp.findOne({
      where: { code: clientData.ClientStatus },
    });
    if (!statusExists) {
      throw new Error("Invalid ClientStatus: No such code in ProjHelp");
    }
  }

  return await client.update(clientData);
};

const deleteClient = async (clientCode) => {
  const client = await Client.findByPk(clientCode);
  if (!client) {
    throw new Error("Client not found");
  }

  return await client.destroy();
};

module.exports = {
  getAllClients,
  getClientByCode,
  createClient,
  updateClient,
  deleteClient,
};