const Task = require("../models/Task");
const mongoose = require("mongoose");

/////////////////////////////////////////s
// Get all tasks for a user (with status filter)
const getTasks = async (req, res) => {
  const userId = req.user._id;
  const { status } = req.query;

  const filter = { userId };

  // Add status filter if provided
  if (status && status !== "All") {
    filter.status = status;
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.status(200).json(tasks);
};
/////////////////////////////////////////e

///////////////////////////////////////s
// Create a new task
const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const userId = req.user._id;

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      userId,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
////////////////////////////////////////e

////////////////////////////////////////s
// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such task" });
  }

  const allowedStatus = ["Pending", "In Progress", "Completed"];
  if (updates.status && !allowedStatus.includes(updates.status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const task = await Task.findByIdAndUpdate(id, updates, { new: true });

  if (!task) {
    return res.status(404).json({ error: "No such task" });
  }

  res.status(200).json(task);
};
/////////////////////////////////////////e

/////////////////////////////////////////s
// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such id" });
  }

  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return res.status(404).json({ error: "No such task" });
  }

  res.status(200).json(task);
};
//////////////////////////////////////////e
module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
