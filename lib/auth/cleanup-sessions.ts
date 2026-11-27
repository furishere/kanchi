
import { prisma } from "@/lib/prisma";

export async function cleanupExpiredSessions() {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return {
    deleted: result.count,
  };
}
