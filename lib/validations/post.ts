
import { z } from "zod";

export const createPostSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Post cannot be empty")
    .max(5000, "Post cannot exceed 5000 characters"),

  mood: z.enum([
    "lonely",
    "anxious",
    "hopeful",
    "grateful",
    "angry",
    "numb",
    "heartbroken",
    "relieved",
  ]),

  contentWarning: z
    .string()
    .trim()
    .max(500, "Content warning cannot exceed 500 characters")
    .optional()
    .nullable(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;


export const getPostsQuerySchema = z.object({
  cursor: z.string().min(1).optional(),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(20),

  mood: z.enum([
    "lonely",
    "anxious",
    "hopeful",
    "grateful",
    "angry",
    "numb",
    "heartbroken",
    "relieved",
  ]).optional(),
});


export const updatePostSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Post cannot be empty")
    .max(5000, "Post cannot exceed 5000 characters")
    .optional(),

  mood: z.enum([
    "lonely",
    "anxious",
    "hopeful",
    "grateful",
    "angry",
    "numb",
    "heartbroken",
    "relieved",
  ]).optional(),

  contentWarning: z
    .string()
    .trim()
    .max(500, "Content warning cannot exceed 500 characters")
    .nullable()
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one field is required"
);


export const reactionSchema = z.object({
  type: z.enum(["FELT", "WARM"]),
});


export const explorePostsQuerySchema = z.object({
  cursor: z.string().min(1).optional(),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(20),

  mood: z.enum([
    "lonely",
    "anxious",
    "hopeful",
    "grateful",
    "angry",
    "numb",
    "heartbroken",
    "relieved",
  ]).optional(),

  sort: z.enum(["recent", "trending"]).default("recent"),
});

export type ExplorePostsQuery = z.infer<
  typeof explorePostsQuerySchema
>;
