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
}

export const userRegisterFormSchema = z.object({
  email: z.string().email("Must provide a valid email"),
  firstName: z.string().nonempty("First name can't be empty"),
  lastName: z.string().nonempty("Last name can't be empty"),
  password: z.string().min(6, "Password must be greater than 6 characters")
})

export type UserRegisterForm = z.infer<typeof userRegisterFormSchema>
