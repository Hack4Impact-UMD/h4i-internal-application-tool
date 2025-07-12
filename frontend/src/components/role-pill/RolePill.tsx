import { ApplicantRole } from "@/types/types";
import {
  applicantRoleColor,
  applicantRoleDarkColor,
  displayApplicantRoleName,
} from "@/utils/display";
import { twMerge } from "tailwind-merge";

type ApplicantRolePillProps = {
  role: ApplicantRole;
  className?: string;
};

export default function ApplicantRolePill({
  role,
  className = "",
}: ApplicantRolePillProps) {
  return (
    <span
      style={{
        backgroundColor: applicantRoleColor(role),
        color: applicantRoleDarkColor(role),
      }}
      className={twMerge(
        `text-sm rounded-full px-2 py-1 flex items-center max-w-fit justify-center`,
        className,
      )}
    >
      {displayApplicantRoleName(role)}
    </span>
  );
}
