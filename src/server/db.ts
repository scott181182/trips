import path from "node:path";

import { schema } from "@zenstack/schema";
import { ZenStackClient } from "@zenstackhq/orm";
import { SqliteDialect } from "@zenstackhq/orm/dialects/sqlite";
import SQLite from "better-sqlite3";

const DATABASE_PATH = process.env.DATABASE_PATH || path.join("zenstack", "dev.db");

export const db = new ZenStackClient(schema, {
  dialect: new SqliteDialect({ database: new SQLite(DATABASE_PATH) }),
});
