import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    teaser: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
