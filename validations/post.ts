import {z} from "zod"

enum Emotion {
  Lonely,
  Heartbroken,
  Hopeful,
  Grateful,
  Anxious,
  Confused,
  Regretful,
  Angry,
  BurnedOut,
  Loved,
  Guilty
}

export const postSchema = z.object({
    content : z
        .string()
        .min(1, "Content is required")
        .max(800, "Content cannot exceed 800 characters"),
    emotion : z
        .enum(["Lonely","Heartbroken","Hopeful","Grateful","Anxious","Confused", "Regretful","Angry","BurnedOut","Loved","Guilty"]),
    hasTriggerWarning : z
        .boolean()
        .default(false)
        
}) 

export type PostSchema = z.infer<typeof postSchema>