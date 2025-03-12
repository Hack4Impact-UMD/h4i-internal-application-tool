type Role = "applicant" | "reviewer" | "super-reviewer"

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

interface Applicant extends User {

}
