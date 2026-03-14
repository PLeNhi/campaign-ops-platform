import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "change-me";

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL }
  });

  if (existing) {
    console.log("Admin user already exists:", ADMIN_EMAIL);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      role: "ADMIN"
    }
  });

  console.log("Created admin user:", ADMIN_EMAIL);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
