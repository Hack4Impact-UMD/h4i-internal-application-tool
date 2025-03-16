import { DocumentReference } from "firebase-admin/firestore";
import { z } from "zod";

export type UserRole = "applicant" | "reviewer" | "super-reviewer"

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  activeApplications?: DocumentReference[];
  inactiveApplications?: DocumentReference[]
}

export const userRegisterFormSchema = z.object({
  id: z.string().nonempty("Must provide a user ID"),
  email: z.string().email("Must provide a valid email"),
  firstName: z.string().nonempty("First name can't be empty"),
  lastName: z.string().nonempty("Last name can't be empty")
})

export type UserRegisterForm = z.infer<typeof userRegisterFormSchema>
