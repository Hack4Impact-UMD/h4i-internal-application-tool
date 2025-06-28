import {
  ApplicantRole,
  ApplicationReviewData,
  AppReviewAssignment,
  ReviewStatus,
} from "@/types/types";
import {
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { getApplicantById } from "@/services/applicantService";
import {
  createReviewData,
  getReviewDataForAssignemnt,
} from "@/services/reviewDataService";
import { applicantRoleColor, applicantRoleDarkColor, displayApplicantRoleName } from "@/utils/display";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { throwErrorToast } from "../error/ErrorToast";
import { getApplicationForm } from "@/services/applicationFormsService";

type ReviewerApplicationsTableProps = {
  assignments: AppReviewAssignment[];
  search: string;
  rowCount?: number;
  statusFilter: "all" | "reviewed" | "pending";
  formId: string;
};

type AssignmentRow = {
  index: number;
  applicant: {
    name: string;
    id: string;
  };
  responseId: string;
  role: ApplicantRole;
  review?: ApplicationReviewData;
  score: {
    value?: number;
    outOf?: number;
  };
};

export default function ReviewerApplicationsTable({
  assignments,
  search,
  formId,
  rowCount = 20,
  statusFilter = "all",
}: ReviewerApplicationsTableProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  function useRows(pageIndex: number) {
    return useQuery({
      queryKey: ["my-assignment-rows", pageIndex],
      placeholderData: (prev) => prev,
      queryFn: async () => {
        return Promise.all(
          assignments
            .slice(
              pageIndex * rowCount,
              Math.min(assignments.length, (pageIndex + 1) * rowCount),
            )
            .map(async (assignment, index) => {
              const user = await getApplicantById(assignment.applicantId);
              const review = await getReviewDataForAssignemnt(assignment);

              const avgScore = (scores: { [score in string]: number }) => {
                const keys = Object.keys(scores);
                const sum = keys.reduce((acc, key) => scores[key] + acc, 0);
                return sum / keys.length;
              };

              const row: AssignmentRow = {
                index: 1 + pageIndex * rowCount + index,
                applicant: {
                  id: user.id,
                  name: `${user.firstName} ${user.lastName}`,
                },
                responseId: assignment.applicationResponseId,
                role: assignment.forRole,
                review: review,
                score: {
                  value: review ? avgScore(review.applicantScores) : undefined,
                  outOf: 4, // NOTE: All scores are assummed to be out of 4
                },
              };

              return row;
            }),
        );
      },
    });
  }

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnHelper = createColumnHelper<AssignmentRow>();
  const cols = useMemo(
    () =>
      [
        columnHelper.accessor("index", {
          id: "number",
          header: "S. NO",
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor("applicant.name", {
          id: "applicant-name",
          header: "APPLICANT",
        }),
        columnHelper.accessor("role", {
          id: "role",
          header: "ROLE",
          cell: ({ getValue }) => (
            <span
              style={{ backgroundColor: applicantRoleColor(getValue()), color: applicantRoleDarkColor(getValue()) }}
              className={`rounded-full px-2 py-1`}
            >
              {displayApplicantRoleName(getValue())}
            </span>
          ),
        }),
        columnHelper.accessor("score", {
          id: "score",
          header: "SCORE",
          cell: ({ getValue, row }) => {
            const review = row.original.review;
            const score = getValue();
            if (!review?.submitted) {
              return "INC";
            } else {
              return score.value && score.outOf
                ? `${score.value}/${score.outOf}`
                : `N/A`;
            }
          },
        }),
        columnHelper.accessor("review", {
          id: "review-status",
          header: "ACTION",
          cell: ({ getValue, row }) => {
            const review = getValue();
            const rowData = row.original;
            if (review) {
              return (
                <Button
                  disabled={rowData.review?.submitted}
                  onClick={() =>
                    handleReview(
                      review,
                      rowData.applicant.id,
                      rowData.responseId,
                      rowData.role,
                    )
                  }
                  variant="outline"
                  className="border-2 rounded-full"
                >
                  Edit
                </Button>
              );
            } else {
              return (
                <Button
                  onClick={() =>
                    handleReview(
                      review,
                      rowData.applicant.id,
                      rowData.responseId,
                      rowData.role,
                    )
                  }
                  variant="outline"
                  className="border-2 rounded-full"
                >
                  Review
                </Button>
              );
            }
          },
          filterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId) as
              | ApplicationReviewData
              | undefined;

            if (filterValue == "all") return true;
            else if (filterValue == "pending") return !value;
            else if (filterValue == "reviewed") return !!value;
            else return true;
          },
        }),
      ] as ColumnDef<AssignmentRow>[],
    [columnHelper],
  );

  async function handleReview(
    appReviewData: ApplicationReviewData | undefined,
    applicantId: string,
    responseId: string,
    role: ApplicantRole,
  ) {
    const form = await getApplicationForm(formId);
    if (appReviewData) {
      // there's an existing review, edit it
      if (appReviewData.submitted) {
        throwErrorToast("This review has already been submitted!");
      } else {
        navigate(
          `/admin/review/f/${appReviewData.applicationFormId}/${form.sections[0].sectionId}/${appReviewData.id}`,
        );
      }
    } else {
      const review = {
        applicantScores: {},
        applicantId: applicantId,
        applicationFormId: formId,
        applicationResponseId: responseId,
        forRole: role,
        reviewStatus: ReviewStatus.NotReviewed,
        reviewerId: user!.id,
        reviewerNotes: "",
        submitted: false,
      };

      console.log(review);

      const newReview = await createReviewData(review);
      navigate(
        `/admin/review/f/${newReview.applicationFormId}/${form.sections[0].sectionId}/${newReview.id}`,
      );
    }
  }

  const { data: rows, isPending, error } = useRows(pagination.pageIndex);

  if (isPending || !rows) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  return (
    <div className="flex flex-col w-full gap-2">
      <DataTable
        columns={cols}
        data={rows}
        className="border-none rounded-none"
        options={{
          getPaginationRowModel: getPaginationRowModel(),
          manualPagination: true,
          onPaginationChange: setPagination,
          rowCount: rowCount,
          enableGlobalFilter: true,
          state: {
            globalFilter: search,
            pagination,
            columnFilters: [
              {
                id: "review-status",
                value: statusFilter,
              },
            ],
          },
        }}
      />
      <div className="flex flex-row gap-2">
        <span>
          Page {pagination.pageIndex + 1} of{" "}
          {Math.ceil(assignments.length / rowCount)}
        </span>
        <div className="ml-auto">
          <Button
            variant="outline"
            disabled={pagination.pageIndex <= 0}
            onClick={() =>
              setPagination({
                ...pagination,
                pageIndex: pagination.pageIndex - 1,
              })
            }
          >
            Previous Page
          </Button>
          <Button
            variant="outline"
            disabled={
              (pagination.pageIndex + 1) * rowCount >= assignments.length - 1
            }
            onClick={() =>
              setPagination({
                ...pagination,
                pageIndex: pagination.pageIndex + 1,
              })
            }
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
}
