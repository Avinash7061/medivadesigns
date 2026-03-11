import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";

/**
 * Ensures the SQLite database file exists and schema is up-to-date.
 * Called at app startup in development or when DATABASE_URL points to a file.
 */
export function ensureDatabase() {
  const dbUrl = process.env.DATABASE_URL ?? "";
  if (!dbUrl.startsWith("file:")) return; // Only handle SQLite file databases

  const dbPath = dbUrl.replace("file:", "");
  const absolutePath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), dbPath);

  if (!existsSync(absolutePath)) {
    console.log("📦 Database not found. Running prisma db push to create it...");
    try {
      execSync("npx prisma db push --skip-generate", {
        stdio: "inherit",
        env: process.env,
      });
      console.log("✅ Database created successfully.");
    } catch (error) {
      console.error("❌ Failed to create database:", error);
    }
  }
}
