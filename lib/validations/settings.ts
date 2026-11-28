
import { z } from "zod";

const moods = [
  "lonely",
  "anxious",
  "hopeful",
  "grateful",
  "angry",
  "numb",
  "heartbroken",
  "relieved",
] as const;

export const updateSettingsSchema = z.object({
  notifyReplies: z.boolean().optional(),

  notifyReactions: z.boolean().optional(),

  quietHours: z
    .object({
      enabled: z.boolean(),
      start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
      end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    })
    .nullable()
    .optional(),

  blurCw: z.boolean().optional(),

  hiddenMoods: z.array(z.enum(moods)).max(8).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one setting is required"
);

export type UpdateSettingsInput = z.infer<
  typeof updateSettingsSchema
>;
