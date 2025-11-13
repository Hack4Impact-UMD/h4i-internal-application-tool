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

type InternalApplicantData = {
  firstName: string;
  lastName: string;
  email: string;
};

type CreateInternalApplicantDialogProps = {
  onSubmit: (data: InternalApplicantData) => void;
};

export default function CreateInternalApplicantDialog({
  onSubmit,
}: CreateInternalApplicantDialogProps) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const reset = useCallback(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const isValid =
    firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "";

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isValid) return;
    const data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };
    onSubmit(data);
    setOpen(false);

    reset();
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
            Enter the details of the internal applicant below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
