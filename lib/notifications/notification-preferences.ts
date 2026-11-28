
type NotificationPreferences = {
  notifyReplies: boolean;
  notifyReactions: boolean;
};

type NotificationType = "REPLY" | "FELT" | "WARM";

export function shouldCreateNotification(
  preferences: NotificationPreferences,
  type: NotificationType
): boolean {
  if (type === "REPLY") {
    return preferences.notifyReplies;
  }

  if (type === "FELT" || type === "WARM") {
    return preferences.notifyReactions;
  }

  return false;
}
