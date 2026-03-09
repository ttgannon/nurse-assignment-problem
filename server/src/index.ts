import "dotenv/config";
import { app } from "./app";
import { prisma } from "./db";

const PORT = Number(process.env.PORT ?? 3000);

async function main() {
  // Verify database connectivity before accepting traffic
  await prisma.$connect();
  console.log("Database connected.");

  app.listen(PORT, () => {
    console.log(`Nursify server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
