import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useCallback, useEffect, useState } from "react";
import { ApplicantRole } from "@/types/types";
import { displayApplicantRoleName } from "@/utils/display";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

// TODO mutate service function next; form validation and management could be better

export default function CreateInternalApplicantDialog() {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [rolesApplied, setRolesApplied] = useState<ApplicantRole[]>([]);

  const reset = useCallback(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setRolesApplied([]);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const isValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" && // backend only validation
    rolesApplied.length > 0;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isValid) return;
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue hover:bg-blue/90 text-white">
          Create Internal Applicant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an Internal Applicant</DialogTitle>
          <DialogDescription>
            Enter the details of the internal applicant below. A dummy applicant and response will be created and viewable as a typical applicant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-full overflow-x-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium"> 
                Roles Applied (select at least one!) 
              </label>
              <div className="overflow-x-scroll">
                <ToggleGroup
                  variant="outline"
                  type="multiple"
                  defaultValue={rolesApplied}
                  value={rolesApplied}
                  onValueChange={(v) => setRolesApplied(v as ApplicantRole[])}
                >
                  {Object.entries(ApplicantRole).map((e) => (
                    <ToggleGroupItem
                    key={e[1]}
                    value={e[1]}
                    size={"lg"}
                    className="data-[state=on]:bg-blue data-[state=on]:text-white cursor-pointer w-48"
                    >
                      <p className="overflow-x-hidden w-full">
                        {displayApplicantRoleName(e[1])}
                      </p>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!isValid}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
