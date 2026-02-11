import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  datasources: {
    login_db: {
      url: process.env.DATABASE_URL
    }
  }
});
