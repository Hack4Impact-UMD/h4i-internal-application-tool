import { Fragment, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";

import Timeline from "./Timeline.tsx";
import {
  ApplicantRole,
  ApplicationResponse,
  ApplicationStatus,
  ReviewStatus,
} from "../../types/types.ts";
import { useApplicationResponsesAndSemesters } from "../../hooks/useApplicationResponseAndSemesters.ts";
import { useApplicationForm } from "../../hooks/useApplicationForm.ts";
import Spinner from "../Spinner.tsx";
import { useMyApplicationStatus } from "@/hooks/useApplicationStatus.ts";
import { statusDisplay } from "@/utils/status.ts";
import ApplicantRolePill from "../role-pill/RolePill.tsx";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth.ts";
import { getApplicationResponseAndSemester } from "@/services/applicationResponseAndSemesterService.ts";
import { getApplicationStatus } from "@/services/statusService.ts";

const timelineItems = [
  { label: "Not Reviewed", id: ReviewStatus.NotReviewed },
  { label: "Under Review", id: ReviewStatus.UnderReview },
  { label: "Interview", id: ReviewStatus.Interview },
  { label: "Decided", id: "decided" },
];

function useTimelineStep() {
  const { token, user } = useAuth();
  return useQuery({
    queryKey: ["timeline", token],
    enabled: !!user && !!token,
    queryFn: async () => {
      if (!user || !token) return 0;

      const applications = await getApplicationResponseAndSemester(user.id);
      const appStatuses = await Promise.all(
        applications
          .filter((app) => app.active)
          .flatMap((app) =>
            app.rolesApplied.map((role) =>
              getApplicationStatus(token, app.id, role),
            ),
          ),
      );

      let step = 0;

      for (const appStatus of appStatuses) {
        if (
          appStatus.status === "decided" ||
          appStatus.status === ReviewStatus.Accepted ||
          appStatus.status === ReviewStatus.Waitlisted ||
          appStatus.status === ReviewStatus.Denied
        ) {
          step = 3;
          return step;
        }
      }

      for (const appStatus of appStatuses) {
        if (appStatus.status === ReviewStatus.Interview) {
          step = 2;
          return step;
        }
      }

      for (const appStatus of appStatuses) {
        if (appStatus.status === ReviewStatus.UnderReview) {
          step = 1;
          return step;
        }
      }

      return step;
    },
  });
}

function ApplicationResponseRow({
  response,
  role,
}: {
  response: ApplicationResponse;
  role: ApplicantRole;
}) {
  const {
    data: form,
    isPending: isFormPending,
    error: formError,
  } = useApplicationForm(response.applicationFormId);

  const {
    data: appStatus,
    isPending: isStatusPending,
    error: statusError,
  } = useMyApplicationStatus(response.id, role);

  const status = appStatus?.status;

  const decided = useMemo(
    () =>
      status == "decided" ||
      status == ReviewStatus.Accepted ||
      status == ReviewStatus.Waitlisted ||
      status == ReviewStatus.Denied,
    [status],
  );

  const formatDate = (timestamp: Timestamp) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return "-";
  };

  if (isFormPending || isStatusPending)
    return (
      <tr className="border-t border-gray-300">
        <td className="text-center py-4 px-2" colSpan={100}>
          <Spinner className="w-full" />
        </td>
      </tr>
    );

  if (formError)
    return (
      <tr className="border-t border-gray-300">
        <td className="text-center py-4 px-2" colSpan={100}>
          <p className="text-center">{formError.message}</p>
        </td>
      </tr>
    );

  if (statusError)
    return (
      <tr className="border-t border-gray-300">
        <td className="text-center py-4 px-2" colSpan={100}>
          <p className="text-center">{statusError.message}</p>
        </td>
      </tr>
    );

  return (
    <tr className="border-t border-gray-300">
      <td className="py-4 flex flex-row gap-2 items-center text-blue-500 font-bold">
        {form.semester + " Application"}
        <ApplicantRolePill role={role} />
      </td>
      <td className="text-center">
        <span className={`px-3 py-1 rounded-full bg-lightblue`}>
          {decided ? "Decided" : status ? statusDisplay(status) : "Unknown"}
        </span>
      </td>
      <td className="text-center">{formatDate(response.dateSubmitted)}</td>
      <td className="text-center">
        {decided ? (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => window.open("/status/decision", "_self")}
          >
            View Decision
          </span>
        ) : (
          "-"
        )}
      </td>
    </tr>
  );
}

function StatusPage() {
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const {
    data: applications,
    isPending,
    error,
  } = useApplicationResponsesAndSemesters();

  const activeApplications = useMemo(
    () => applications.filter((app) => app.active),
    [applications],
  );

  const inactiveApplications = useMemo(
    () => applications.filter((app) => !app.active),
    [applications],
  );

  const activeList =
    activeTab == "active" ? activeApplications : inactiveApplications;
  const semesterGrouping = activeList.reduce((map, application) => {
    const semester = application.semester;

    if (!map.has(semester)) {
      map.set(semester, []);
    }

    map.get(semester)!.push(application);
    return map;
  }, new Map<string, ApplicationResponse[]>());

  const { data: currentTimelineStep } = useTimelineStep();

  return (
    <div className="flex flex-col">
      <div className="h-screen bg-muted">
        <div className="bg-white p-6 w-full max-w-5xl mx-auto m-8 rounded-md shadow">
          <h1 className="text-xl mt-10 mb-10 font-semibold">My Applications</h1>

          <div className="border-b border-gray-300">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("active")}
                className={`relative pb-4 px-1 cursor-pointer ${activeTab === "active" ? "text-blue-500" : "text-gray-500"
                  }`}
                style={{ background: "none", border: "none", outline: "none" }}
              >
                Active ({activeApplications.length})
                {activeTab === "active" && (
                  <div className="absolute bottom-0 left-2 right-2 h-1.5 bg-blue-500 rounded-t-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("inactive")}
                className={`relative pb-4 px-1 cursor-pointer ${activeTab === "inactive" ? "text-blue-500" : "text-gray-500"
                  }`}
                style={{ background: "none", border: "none", outline: "none" }}
              >
                Inactive ({inactiveApplications.length})
                {activeTab === "inactive" && (
                  <div className="absolute bottom-0 left-2 right-2 h-1.5 bg-blue-500 rounded-t-full" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-5">
            {activeTab === "active" && (
              <Timeline
                currentStep={currentTimelineStep ?? 0}
                items={timelineItems}
                maxStepReached={3}
              />
            )}
          </div>

          <div className="mt-3">
            {isPending ? (
              <p className="w-full">Loading...</p>
            ) : error ? (
              <p className="w-full">
                Error fetching applications: {error.message}
              </p>
            ) : activeList.length == 0 ? (
              <p className="w-full">
                You don't have any {activeTab} applications. Go apply!
              </p>
            ) : activeTab == "inactive" ? (
              Array.from(semesterGrouping.entries()).map(([semester, apps]) => (
                <div>
                  <h2 className="text-lg font-semibold mt-6 mb-2">
                    Hack4Impact {semester} Application
                  </h2>
                  <table className="w-full">
                    <thead>
                      <tr className="border-t border-gray-300">
                        <th className="pb-4 pt-4 text-left font-normal w-1/3">
                          Application
                        </th>
                        <th className="pb-4 pt-4 text-center font-normal w-1/4">
                          Application Status
                        </th>
                        <th className="pb-4 pt-4 text-center font-normal w-1/4">
                          Date Submitted
                        </th>
                        <th className="pb-4 pt-4 text-center font-normal w-1/6">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.map((application) => (
                        <Fragment key={application.id}>
                          {application.rolesApplied.map((role) => (
                            <ApplicationResponseRow
                              key={application.id + role}
                              response={application}
                              role={role}
                            />
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-t border-gray-300">
                    <th className="pb-4 pt-4 text-left font-normal w-1/3">
                      Application
                    </th>
                    <th className="pb-4 pt-4 text-center font-normal w-1/4">
                      Application Status
                    </th>
                    <th className="pb-4 pt-4 text-center font-normal w-1/4">
                      Date Submitted
                    </th>
                    <th className="pb-4 pt-4 text-center font-normal w-1/6">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeList.map((application) => (
                    <Fragment key={application.id}>
                      {application.rolesApplied.map((role) => (
                        <ApplicationResponseRow
                          key={application.id + role}
                          response={application}
                          role={role}
                        />
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusPage;
