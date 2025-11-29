import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog";
import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateCheck } from "@/hooks/useUpdateCheck";

export default function UpdateNotifier({ children }: { children: ReactNode }) {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { data: isNewVersionAvailable } = useUpdateCheck();

  useEffect(() => {
    if (isNewVersionAvailable) {
      setShowDialog(true);
    }
  }, [isNewVersionAvailable]);

  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>A new version is available!</AlertDialogTitle>
            <AlertDialogDescription>
              Make sure to save any work and refresh the page to get the latest
              features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Remind me later</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate(0)}>
              Refresh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </>
  );
}
