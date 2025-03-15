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

export type UserRegisterForm = {
  id: string; // firebase auth generated uid
  email: string;
  firstName: string;
  lastName: string;
}

export const userRegisterFormSchema = z.object({
  id: z.string().nonempty(),
  email: z.string().email(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty()
})
