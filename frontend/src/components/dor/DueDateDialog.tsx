import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timestamp } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { throwSuccessToast } from "@/components/toasts/SuccessToast";
import { throwErrorToast } from "@/components/toasts/ErrorToast";
import { updateApplicationFormDueDate } from "@/services/applicationFormsService";
import { useAuth } from "@/hooks/useAuth";

interface DueDateDialogProps {
  formId: string;
  currentDueDate: Timestamp;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DueDateDialog({
  formId,
  currentDueDate,
  open,
  onOpenChange,
}: DueDateDialogProps) {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  // Convert format
  const currentDate = currentDueDate.toDate();
  const defaultValue = currentDate.toISOString().slice(0, 16);

  const [newDueDate, setNewDueDate] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Get the auth token
      const authToken = await token();
      if (!authToken) {
        throwErrorToast("Authentication token not available. Please log in again.");
        return;
      }

      const date = new Date(newDueDate);
      const timestamp = Timestamp.fromDate(date);

      // Use the backend API
      await updateApplicationFormDueDate(formId, timestamp, authToken);

      queryClient.invalidateQueries({ queryKey: ["form"] });

      throwSuccessToast("Due date updated successfully");
      onOpenChange(false);
    } catch (error) {
      throwErrorToast("Failed to update due date");
      console.error("Error updating due date:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Application Due Date</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="due-date" className="text-sm font-medium">
              New Due Date
            </label>
            <Input
              id="due-date"
              type="datetime-local"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
