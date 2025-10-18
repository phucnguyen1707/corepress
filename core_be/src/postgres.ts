import { SQL } from "bun";

export const pg = new SQL(
  "postgresql://postgres:Ad12345%23@localhost:5432/corepress"
);

export const createTable = async (pg: SQL) => {
  await pg`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      session TEXT UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`;

  await pg`CREATE TABLE IF NOT EXISTS pages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'New Page',
      user_id INTEGER NOT NULL,
      data JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`;
};
