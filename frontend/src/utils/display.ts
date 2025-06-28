import { ApplicantRole, PermissionRole } from "@/types/types";

export function displayUserRoleName(role: PermissionRole) {
  if (role == PermissionRole.SuperReviewer) return "Super Reviewer";
  else if (role == PermissionRole.Applicant) return "Applicant";
  else return "Reviewer";
}

export function displayApplicantRoleName(role: ApplicantRole) {
  if (role == ApplicantRole.Bootcamp) return "Bootcamp";
  else if (role == ApplicantRole.TechLead) return "Tech Lead";
  else if (role == ApplicantRole.Product) return "Product";
  else if (role == ApplicantRole.Sourcing) return "Sourcing";
  else if (role == ApplicantRole.Engineer) return "Engineer";
  else if (role == ApplicantRole.Designer) return "Designer";
  else return role;
}

export function applicantRoleColor(role: ApplicantRole) {
  if (role == ApplicantRole.Bootcamp) return "#FBDED9";
  else if (role == ApplicantRole.TechLead) return "#E2D8E8";
  else if (role == ApplicantRole.Product) return "#DCEBDD";
  else if (role == ApplicantRole.Sourcing) return "#F8E6BA";
  else if (role == ApplicantRole.Engineer) return "#D5E7F2";
  else if (role == ApplicantRole.Designer) return "#F8DFEB";
  else return "#FFFFFF";
}

export function applicantRoleDarkColor(role: ApplicantRole) {
  if (role == ApplicantRole.Bootcamp) return "#5D1615";
  else if (role == ApplicantRole.TechLead) return "#592878";
  else if (role == ApplicantRole.Product) return "#1D3829";
  else if (role == ApplicantRole.Sourcing) return "#402C1B";
  else if (role == ApplicantRole.Engineer) return "#193347";
  else if (role == ApplicantRole.Designer) return "#4C2337";
  else return "#000000";
}
