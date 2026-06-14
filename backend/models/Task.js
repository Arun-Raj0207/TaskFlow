const { query } = require("../db");

// Create a new task
const createTask = async (title, description, dueDate, priority, userId) => {
    const result = await query(
        "INSERT INTO tasks (title, description, due_date, priority, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, due_date, priority, completed, user_id, created_at, updated_at",
        [title, description || "", dueDate || null, priority || "medium", userId]
    );
    const task = result.rows[0];
    return mapTaskResponse(task);
};

// Find all tasks for a user
const findByUserId = async (userId) => {
    const result = await query(
        "SELECT id, title, description, due_date, priority, completed, user_id, created_at, updated_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    return result.rows.map(mapTaskResponse);
};

// Find task by ID
const findById = async (id) => {
    const result = await query(
        "SELECT id, title, description, due_date, priority, completed, user_id, created_at, updated_at FROM tasks WHERE id = $1",
        [id]
    );
    if (result.rows.length === 0) return null;
    return mapTaskResponse(result.rows[0]);
};

// Update a task
const updateTask = async (id, updates) => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.title !== undefined) {
        fields.push(`title = $${paramCount++}`);
        values.push(updates.title);
    }
    if (updates.description !== undefined) {
        fields.push(`description = $${paramCount++}`);
        values.push(updates.description);
    }
    if (updates.due_date !== undefined) {
        fields.push(`due_date = $${paramCount++}`);
        values.push(updates.due_date || null);
    }
    if (updates.priority !== undefined) {
        fields.push(`priority = $${paramCount++}`);
        values.push(updates.priority);
    }
    if (updates.completed !== undefined) {
        fields.push(`completed = $${paramCount++}`);
        values.push(updates.completed);
    }

    if (fields.length === 0) {
        // No updates provided, return current task
        return findById(id);
    }

    fields.push(`updated_at = $${paramCount++}`);
    values.push(new Date());
    values.push(id);

    const result = await query(
        `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING id, title, description, due_date, priority, completed, user_id, created_at, updated_at`,
        values
    );

    if (result.rows.length === 0) return null;
    return mapTaskResponse(result.rows[0]);
};

// Delete a task
const deleteTask = async (id) => {
    const result = await query(
        "DELETE FROM tasks WHERE id = $1 RETURNING id",
        [id]
    );
    return result.rows.length > 0;
};

// Helper function to map database fields to API response format
const mapTaskResponse = (task) => {
    return {
        _id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        priority: task.priority,
        completed: task.completed,
        user: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at
    };
};

module.exports = {
    createTask,
    findByUserId,
    findById,
    updateTask,
    deleteTask
};