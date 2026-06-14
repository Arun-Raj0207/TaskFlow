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

        const task = await Task.createTask(
            req.body.title,
            req.body.description,
            req.body.dueDate,
            priority,
            req.user._id
        );
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/", protect, async (req, res) => {
    try {
        const tasks = await Task.findByUserId(req.user._id);
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

        // Build updates object with database field names
        const updates = {};
        if (req.body.title !== undefined) updates.title = req.body.title;
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.dueDate !== undefined) updates.due_date = req.body.dueDate;
        if (req.body.completed !== undefined) updates.completed = req.body.completed;

        if (req.body.priority !== undefined) {
            const allowedPriorities = ["low", "medium", "high"];
            const normalized = String(req.body.priority).toLowerCase();
            if (!allowedPriorities.includes(normalized)) {
                return res.status(400).json({ message: `Invalid priority. Allowed: ${allowedPriorities.join(", ")}` });
            }
            updates.priority = normalized;
        }

        const updatedTask = await Task.updateTask(req.params.id, updates);
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

        // Build updates object with only provided fields
        const updates = {};
        if (req.body.title !== undefined) updates.title = req.body.title;
        if (req.body.completed !== undefined) updates.completed = req.body.completed;
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.dueDate !== undefined) updates.due_date = req.body.dueDate;

        if (req.body.priority !== undefined) {
            const allowedPriorities = ["low", "medium", "high"];
            const normalized = String(req.body.priority).toLowerCase();
            if (!allowedPriorities.includes(normalized)) {
                return res.status(400).json({ message: `Invalid priority. Allowed: ${allowedPriorities.join(", ")}` });
            }
            updates.priority = normalized;
        }

        const updatedTask = await Task.updateTask(req.params.id, updates);
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

        await Task.deleteTask(req.params.id);
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