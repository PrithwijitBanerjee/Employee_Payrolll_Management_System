const taskService = require("../service/task.Service");

exports.createTask = async (req, res) => {
  try {
    const loggedUser = req.user;
    const task = await taskService.createTask(req.body, loggedUser);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};