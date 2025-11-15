const { Pool } = require("pg");
require("dotenv").config();

const dbUrlArg = process.argv[2];
const SSL = dbUrlArg ? { ssl: { rejectUnauthorized: false } } : null;

const DATABASE_URL = dbUrlArg || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ...SSL,
});

module.exports = pool;
