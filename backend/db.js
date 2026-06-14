const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

// Determine SSL settings: enable for production, Supabase hosts, or when DB_SSL=true
const shouldUseSsl = (() => {
  if (process.env.DB_SSL && process.env.DB_SSL.toLowerCase() === "true") return true;
  if (process.env.NODE_ENV === "production") return true;
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("supabase.co")) return true;
  return false;
})();

// Create a pool of connections to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error("Database query error", { text, error: error.message });
    throw error;
  }
};

// Helper function to get a client for transactions
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = { pool, query, getClient };
