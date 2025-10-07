const clientService = require('../service/clientService');
const { successResponse, errorResponse } = require('../utils/response');

const getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    return successResponse(res, "Clients retrieved successfully", clients);
  } catch (err) {
    return errorResponse(res, 500, "Failed to fetch clients", err.message);
  }
};

const getClientByCode = async (req, res) => {
  try {
    const client = await clientService.getClientByCode(req.params.clientCode);
    if (!client) {
      return errorResponse(res, 404, "Client not found");
    }
    return successResponse(res, "Client retrieved successfully", client);
  } catch (err) {
    return errorResponse(res, 500, "Failed to fetch client", err.message);
  }
};

const createClient = async (req, res) => {
  try {
    const newClient = await clientService.createClient(req.body);
    return successResponse(res, "Client created successfully", newClient);
  } catch (err) {
    return errorResponse(res, 400, "Failed to create client", err.message);
  }
};

const updateClient = async (req, res) => {
  try {
    const updatedClient = await clientService.updateClient(req.params.clientCode, req.body);
    return successResponse(res, "Client updated successfully", updatedClient);
  } catch (err) {
    return errorResponse(res, 400, "Failed to update client", err.message);
  }
};

const deleteClient = async (req, res) => {
  try {
    await clientService.deleteClient(req.params.clientCode);
    return successResponse(res, "Client deleted successfully");
  } catch (err) {
    return errorResponse(res, 400, "Failed to delete client", err.message);
  }
};

module.exports = {
  getAllClients,
  getClientByCode,
  createClient,
  updateClient,
  deleteClient
};