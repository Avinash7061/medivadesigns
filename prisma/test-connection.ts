/**
 * test-connection.ts
 * Run with: npx tsx prisma/test-connection.ts
 * Tests the Supabase Postgres connection via Prisma before touching the app.
 */
import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  console.log("🔌 Testing Supabase connection...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL?.replace(/:([^@]+)@/, ":****@"));

  // 1. Raw query to verify connection
  const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT now()`;
  console.log("✅ Connected! Server time:", result[0].now);

  // 2. Count products table
  const count = await prisma.product.count();
  console.log(`📦 Products in DB: ${count}`);

  // 3. List all product names if any exist
  if (count > 0) {
    const products = await prisma.product.findMany({ select: { name: true, price: true } });
    products.forEach((p) => console.log(`  • ${p.name} — ₹${p.price}`));
  }

  console.log("\n✅ Connection test passed!");
}

main()
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
