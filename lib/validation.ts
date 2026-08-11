import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const vehicleSchema = z.object({
  title: z.string().min(5),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1980).max(2100),
  mileage: z.coerce.number().int().min(0),
  priceNet: z.coerce.number().int().min(0),
  vatRate: z.coerce.number().int().min(0).max(100),
  stockNumber: z.string().min(1),
  category: z.string().min(2),
  fuel: z.string().min(2),
  transmission: z.string().min(2),
  powerHp: z.coerce.number().int().min(0).nullable().optional(),
  engineCapacity: z.coerce.number().int().min(0).nullable().optional(),
  dmc: z.coerce.number().int().min(0).nullable().optional(),
  payload: z.coerce.number().int().min(0).nullable().optional(),
  location: z.string().min(2),
  description: z.string().min(20),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "DRAFT"]),
  featured: z.boolean().default(false),
  image: z.string().min(1),
});

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
