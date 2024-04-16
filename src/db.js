import pg from "pg";
const { Pool } = pg;

const config = {
  user: "postgres",
  host: "localhost",
  database: "banco",
  password: "wilper591",
  port: 5432,
};

export const pool = new Pool(config);
