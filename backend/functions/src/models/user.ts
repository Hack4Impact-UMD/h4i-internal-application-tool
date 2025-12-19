import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export type UserRole = "applicant" | "reviewer" | "super-reviewer"

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  dateCreated: Timestamp;
  activeApplications?: string[];
  inactiveApplications?: string[]
  inactive?: boolean
}

export const userRegisterFormSchema = z.object({
  email: z.string().email("Must provide a valid email"),
  firstName: z.string().nonempty("First name can't be empty"),
  lastName: z.string().nonempty("Last name can't be empty"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

})

export const updateUserSchema = z.object({
  email: z.string().email("Must provide a valid email"),
  firstName: z.string().nonempty("First name can't be empty"),
  lastName: z.string().nonempty("Last name can't be empty")
})

export type UserRegisterForm = z.infer<typeof userRegisterFormSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
