const Task = require("../models/Task");
const mongoose = require("mongoose");

// Get all tasks for a user
const getTasks = async (req, res) => {
    const userId = req.user._id;
        const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
}

// Create a new task
const createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;
    const userId = req.user._id;

    try {
        const task = await Task.create({ title, description, dueDate, userId });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such task" });
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!task) {
        return res.status(404).json({ error: "No such task" });
    }

    res.status(200).json(task);
}

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
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
}
    