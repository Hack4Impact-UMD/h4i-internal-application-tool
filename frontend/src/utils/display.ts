import { ApplicantRole, PermissionRole } from "@/types/types";

export function displayUserRoleName(role: PermissionRole) {
  if (role == PermissionRole.SuperReviewer) return "Super Reviewer"
  else if (role == PermissionRole.Applicant) return "Applicant"
  else return "Reviewer"
}

export function displayApplicantRoleName(role: ApplicantRole) {
  if (role == ApplicantRole.Bootcamp) return "Bootcamp"
  else if (role == ApplicantRole.TechLead) return "Tech Lead"
  else if (role == ApplicantRole.Product) return "Product"
  else if (role == ApplicantRole.Sourcing) return "Sourcing"
  else if (role == ApplicantRole.Engineer) return "Engineer"
  else if (role == ApplicantRole.Designer) return "Designer"
  else return role
}
