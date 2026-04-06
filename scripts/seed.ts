import { ZenStackClient } from "@zenstackhq/orm";
import { SqliteDialect } from "@zenstackhq/orm/dialects/sqlite";
import SQLite from "better-sqlite3";

import { schema } from "../zenstack/schema";

async function main() {
  const db = new ZenStackClient(schema, {
    dialect: new SqliteDialect({
      database: new SQLite("./zenstack/dev.db"),
    }),
  });
  const user = await db.user.create({
    data: {
      email: "admin@example.com",
      name: "Test Admin",
      role: "ADMIN",
    },
  });
  console.log("User created:", user);
}

main();
