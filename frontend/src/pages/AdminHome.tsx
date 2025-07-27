import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useAllApplicationForms } from "@/hooks/useApplicationForm";
import { useAuth } from "@/hooks/useAuth";
import { PermissionRole } from "@/types/types";
import { displayUserRoleName } from "@/utils/display";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();
  const { data: forms, isPending, error } = useAllApplicationForms();
  const { user } = useAuth();

  if (!user) return <Loading />;

  const route = user.role == PermissionRole.Reviewer ? "reviewer" : "dor";
  const table = user.role == PermissionRole.SuperReviewer ? "/all" : "";

  if (isPending) return <Loading />;
  if (error) return <p>Failed to fetch forms: {error.message}</p>;

  return (
    <div className="w-full h-full px-2 py-4 flex gap-2 flex-col bg-lightgray items-center">
      <div className="max-w-5xl w-full p-4 rounded-md">
        <h1 className="text-2xl font-bold">Welcome, {user.firstName}!</h1>
        <p className="text-muted-foreground">
          You are a {displayUserRoleName(user.role)}.
        </p>
      </div>

      <div className="max-w-5xl w-full p-4 bg-white rounded-md">
        <h1 className="text-xl">Go to Review Dashboards</h1>
        <p className="text-muted-foreground">
          To access dashboards, you need to select which form you want to view
          application and review data for.
        </p>

        <ul className="flex flex-col gap-2 mt-4">
          {forms.map((form) => {
            return (
              <Link
                className="border border-gray-300 p-2 rounded-md flex flex-row gap-2 items-center"
                to={`/admin/${route}/dashboard/${form.id}${table}`}
                key={form.id}
              >
                <span
                  className={`${!form.isActive ? "bg-muted" : "bg-lightblue"} px-2 py-1 text-sm rounded-full`}
                >
                  {form.isActive ? "Active" : "Inactive"}
                </span>
                <span>
                  Semester: {form.semester} (ID: {form.id})
                </span>
              </Link>
            );
          })}
        </ul>
      </div>
      {user.role == PermissionRole.SuperReviewer && (
        <>
          <div className="max-w-5xl w-full p-4 bg-white rounded-md">
            <h1 className="text-xl">Or Manage Users </h1>
            <p className="text-muted-foreground">
              View all registered users, grant reviewer access, edit roles, and
              delete user accounts.
            </p>
            <Button className="mt-4" onClick={() => navigate("/admin/dor/users")}>
              Manage Users
            </Button>
          </div>
          <div className="max-w-5xl w-full p-4 bg-white rounded-md">
            <h1 className="text-xl">Or Manage Forms </h1>
            <p className="text-muted-foreground">
              Validate your form before uploading to Firestore.
            </p>
            <Button className="mt-4" onClick={() => navigate("/admin/dor/forms")}>
              Form Validator
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
