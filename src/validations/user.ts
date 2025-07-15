import { z } from 'zod';

// Character enum validation
export const characterSchema = z.enum(['bunny', 'cat', 'dog', 'giraffe', 'penguin'], {
  errorMap: (issue, ctx) => ({
    message: `Character must be one of: bunny, cat, dog, giraffe, penguin. Received: ${ctx.data}`,
  }),
});

// User creation validation schema
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .trim()
    .refine((name) => name.length > 0, 'Name cannot be empty after trimming'),
  character: characterSchema,
});

// User update validation schema (partial)
export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name must be at least 1 character')
      .max(100, 'Name must be 100 characters or less')
      .trim()
      .optional(),
    character: characterSchema.optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.character !== undefined,
    'At least one field (name or character) must be provided',
  );

// User ID validation schema
export const userIdSchema = z.object({
  id: z
    .string()
    .min(1, 'User ID is required')
    .regex(/^[a-z0-9-]+$/, 'User ID must contain only lowercase letters, numbers, and hyphens'),
});

// Character parameter validation schema
export const characterParamSchema = z.object({
  character: characterSchema,
});

// Query validation schema for pagination (future use)
export const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.enum(['name', 'character', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

// Type exports for better TypeScript support
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdInput = z.infer<typeof userIdSchema>;
export type CharacterParamInput = z.infer<typeof characterParamSchema>;
export type QueryInput = z.infer<typeof querySchema>;
