import { getApplicantById } from "@/services/applicantService";
import { getApplicationStatusForResponseRole } from "@/services/statusService";
import {
  ApplicantRole,
  ApplicationResponse,
  InternalApplicationStatus,
} from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";

export type DecisionRow = {
  index: number;
  applicant: {
    id: string;
    name: string;
    email: string;
  };
  role: ApplicantRole;
  decision: InternalApplicationStatus | undefined; // accepted, denied, waitlisted
  dateSubmitted: Timestamp;
  responseId: string;
};

export function useRows(applications: ApplicationResponse[], formId: string) {
  return useQuery({
    queryKey: ["decision-rows", applications.map((a) => a.id).sort(), formId],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      return Promise.all(
        applications.map(async (app, index) => {
          const role = app.rolesApplied[0];

          // Get applicant info
          let applicant;
          try {
            applicant = await getApplicantById(app.userId);
          } catch (error) {
            console.error(`Failed to fetch applicant ${app.userId}:`, error);
            applicant = {
              id: app.userId,
              firstName: "Unknown",
              lastName: "",
              email: "",
            };
          }

          // Get final decision status
          let decision: InternalApplicationStatus | undefined;
          try {
            decision = await getApplicationStatusForResponseRole(app.id, role);
          } catch (error) {
            console.error(
              `Failed to fetch application status for ${app.id}-${role}:`,
              error,
            );
            decision = undefined;
          }

          // Build row for the table
          const row: DecisionRow = {
            index: index + 1,
            applicant: {
              id: applicant.id,
              name: `${applicant.firstName} ${applicant.lastName}`,
              email: applicant.email,
            },
            role,
            decision,
            dateSubmitted: app.dateSubmitted,
            responseId: app.id,
          };

          return row;
        }),
      );
    },
  });
}
