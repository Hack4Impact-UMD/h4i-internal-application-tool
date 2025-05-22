import { PermissionRole } from "@/types/types";

export function displayRoleName(role: PermissionRole) {
  if (role == PermissionRole.SuperReviewer) return "Super Reviewer"
  else if (role == PermissionRole.Applicant) return "Applicant"
  else return "Reviewer"
}
