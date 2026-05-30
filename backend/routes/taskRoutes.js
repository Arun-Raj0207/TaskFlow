const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/", protect, async (req, res) => {
    try {
        // normalize and validate priority
        const allowedPriorities = ["low", "medium", "high"];
        let priority;
        if (req.body.priority !== undefined) {
            priority = String(req.body.priority).toLowerCase();
            if (!allowedPriorities.includes(priority)) {
                return res.status(400).json({ message: `Invalid priority. Allowed: ${allowedPriorities.join(", ")}` });
            }
        }

        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            priority,
            user: req.user._id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.get("/", protect, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user._id
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.put("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        task.title = req.body.title || task.title;
        task.completed = req.body.completed ?? task.completed;
        task.description = req.body.description ?? task.description;
        task.dueDate = req.body.dueDate ?? task.dueDate;
        if (req.body.priority !== undefined) {
            const allowedPriorities = ["low", "medium", "high"];
            const normalized = String(req.body.priority).toLowerCase();
            if (!allowedPriorities.includes(normalized)) {
                return res.status(400).json({ message: `Invalid priority. Allowed: ${allowedPriorities.join(", ")}` });
            }
            task.priority = normalized;
        }
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.patch("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        // Only update fields that are provided in the body
        if (req.body.title !== undefined) task.title = req.body.title;
        if (req.body.completed !== undefined) task.completed = req.body.completed;
        if (req.body.description !== undefined) task.description = req.body.description;
        if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
        if (req.body.priority !== undefined) {
            const allowedPriorities = ["low", "medium", "high"];
            const normalized = String(req.body.priority).toLowerCase();
            if (!allowedPriorities.includes(normalized)) {
                return res.status(400).json({ message: `Invalid priority. Allowed: ${allowedPriorities.join(", ")}` });
            }
            task.priority = normalized;
        }
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.delete("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        await task.deleteOne();
        res.json({
            message: "Task removed"
        });
    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});
module.exports = router;