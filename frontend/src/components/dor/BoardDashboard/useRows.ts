import { ApplicantRole, BoardUserProfile } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export type BoardRow = {
  index: number;
  boardMember: {
    name: string;
    id: string;
    email: string;
  };
  applicantRoles: ApplicantRole[];
};

export function useRows(boardMembers: BoardUserProfile[]) {
  return useQuery({
    queryKey: ["all-board-rows", boardMembers.map((x) => x.id).sort()],
    placeholderData: (prev) => prev,
    queryFn: async () =>
      Promise.all(
        boardMembers.map(async (boardMember, index) => {
          const row: BoardRow = {
            index: 1 + index,
            boardMember: {
              id: boardMember.id,
              name: `${boardMember.firstName} ${boardMember.lastName}`,
              email: boardMember.email,
            },
            applicantRoles: boardMember.applicantRoles ?? [],
          };

          return row;
        }),
      ),
  });
}
