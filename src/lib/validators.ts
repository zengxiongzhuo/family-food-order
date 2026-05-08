import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  sortOrder: z.number().int().optional().default(0),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  sortOrder: z.number().int().optional(),
});

export const createDishSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  ingredients: z.string().min(1, "Ingredients are required"),
  cookingMethod: z.string().optional().nullable(),
  isAvailable: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const updateDishSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  categoryId: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  ingredients: z.string().min(1).optional(),
  cookingMethod: z.string().optional().nullable(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        dishId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "At least one item is required"),
  notes: z.string().optional().nullable(),
});
