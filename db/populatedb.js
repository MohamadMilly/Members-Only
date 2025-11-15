require("dotenv").config();
const { Client } = require("pg");

const dbUrlArg = process.argv[2];

const DATABASE_URL = dbUrlArg || process.env.DATABASE_URL;
const SSL = dbUrlArg ? { ssl: { rejectUnauthorized: false } } : null;

const members_table_SQL = `
CREATE TABLE IF NOT EXISTS members (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 firstname VARCHAR(255) NOT NULL,
 lastname VARCHAR(255) NOT NULL,
 username VARCHAR (255) NOT NULL,
 password VARCHAR(255) NOT NULL,
 isMember BOOLEAN DEFAULT false,
 isAdmin BOOLEAN DEFAULT false
 );
`;

const posts_table_SQL = `
CREATE TABLE IF NOT EXISTS posts (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(255) NOT NULL,
content TEXT NOT NULL,
date TIMESTAMP,
author_id INTEGER,
FOREIGN KEY (author_id) REFERENCES members(id)
);
`;

const session_table_SQL = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`;

async function main() {
  console.log("Seeding ... ");
  const client = new Client({
    connectionString: DATABASE_URL,
    ...SSL,
  });
  await client.connect();
  await client.query(members_table_SQL);
  await client.query(posts_table_SQL);
  await client.query(session_table_SQL);
  await client.end();
  console.log("done");
}

main();
