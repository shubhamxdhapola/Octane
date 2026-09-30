import { z } from "zod";

export const loginSchema = z.object({
    phone: z
        .string({ error: "Phone number is required" })
        .trim()
        .min(1, "Phone number is required"),

    password: z
        .string({ error: "Password is required" })
        .min(1, "Password is required")
})

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),

    newPassword: z
        .string()
        .min(4, "New password must be at least 4 characters")
        .max(20, "New password cannot exceed 20 characters")
});

export const registerOwnerSchema = z.object({
    ownerName: z
        .string()
        .trim()
        .min(3, "Owner name must be at least 3 characters")
        .max(50, "Owner name cannot exceed 50 characters")
        .optional(),

    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters")
        .optional(),

    phone: z
        .string({ error: "Phone number is required" })
        .trim()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),

    password: z
        .string({ error: "Password is required" })
        .min(4, "Password must be at least 4 characters")
        .max(20, "Password cannot exceed 20 characters"),

    petrolPumpName: z
        .string()
        .trim()
        .min(2, "Petrol pump name must be at least 2 characters")
        .max(100, "Petrol pump name cannot exceed 100 characters")
        .optional(),

    pumpName: z
        .string()
        .trim()
        .min(2, "Petrol pump name must be at least 2 characters")
        .max(100, "Petrol pump name cannot exceed 100 characters")
        .optional(),

    address: z
        .string({ error: "Address is required" })
        .trim()
        .min(3, "Address must be at least 3 characters")
        .max(200, "Address cannot exceed 200 characters"),

    city: z
        .string({ error: "City is required" })
        .trim()
        .min(2, "City must be at least 2 characters")
        .max(50, "City cannot exceed 50 characters"),

    state: z
        .string({ error: "State is required" })
        .trim()
        .min(2, "State must be at least 2 characters")
        .max(50, "State cannot exceed 50 characters"),

    pincode: z
        .string({ error: "Pincode is required" })
        .trim()
        .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Indian pincode"),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address")
        .optional()
        .or(z.literal("")),
}).refine((data) => Boolean(data.name || data.ownerName), {
    message: "Owner name is required",
    path: ["name"],
}).refine((data) => Boolean(data.petrolPumpName || data.pumpName), {
    message: "Petrol pump name is required",
    path: ["pumpName"],
});

export const checkPhoneSchema = z.object({
    phone: z
        .string({ error: "Phone number is required" })
        .trim()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
});