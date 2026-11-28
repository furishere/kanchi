
import { prisma } from "@/lib/prisma";

export async function getFeedPreferences(userId?: string) {
  if (!userId) {
    return {
      hiddenMoods: [],
      mutedUserIds: [],
      blurCw: true,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      hiddenMoods: true,
      blurCw: true,
      mutedUsers: {
        select: {
          mutedUserId: true,
        },
      },
    },
  });

  if (!user) {
    return {
      hiddenMoods: [],
      mutedUserIds: [],
      blurCw: true,
    };
  }

  return {
    hiddenMoods: user.hiddenMoods,
    mutedUserIds: user.mutedUsers.map(
      (mute) => mute.mutedUserId
    ),
    blurCw: user.blurCw,
  };
}
