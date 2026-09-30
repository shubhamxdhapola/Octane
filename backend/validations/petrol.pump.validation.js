import { z } from "zod";

export const updatePetrolPumpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100).optional(),
  address: z.string().trim().min(3, "Address must be at least 3 characters").max(200).optional(),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(50).optional(),
  state: z.string().trim().min(2, "State must be at least 2 characters").max(50).optional(),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Invalid 6-digit Indian pincode").optional(),
  contactPhone: z.string().trim().regex(/^[6-9]\d{9}$/, "Invalid 10-digit phone number").optional(),
  contactEmail: z.string().trim().email("Invalid email address").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required to update",
});
