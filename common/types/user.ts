type Role = "applicant" | "reviewer" | "super-reviewer"

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface Applicant extends User {

}
