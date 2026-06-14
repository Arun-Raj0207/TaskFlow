const { query } = require("../db");

// Create a new user
const createUser = async (name, email, hashedPassword) => {
    const result = await query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at",
        [name, email, hashedPassword]
    );
    const user = result.rows[0];
    // Return with _id for API compatibility
    return {
        _id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
};

// Find user by email
const findByEmail = async (email) => {
    const result = await query(
        "SELECT id, name, email, password, created_at, updated_at FROM users WHERE email = $1",
        [email]
    );
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return {
        _id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
};

// Find user by ID
const findById = async (id) => {
    const result = await query(
        "SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1",
        [id]
    );
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return {
        _id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
};

module.exports = {
    createUser,
    findByEmail,
    findById
};