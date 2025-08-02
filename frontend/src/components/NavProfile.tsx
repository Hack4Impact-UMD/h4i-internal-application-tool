import { UserProfile } from "@/types/types";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import {
  DropdownMenuGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Link } from "react-router-dom";
import { clearQueryCache } from "@/config/query";

type NavProfileProps = {
  user: UserProfile;
  className?: string;
};

export default function NavProfile({ user, className = "" }: NavProfileProps) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={twMerge(
              "flex px-2 bg-transparent flex-row gap-2",
              className,
            )}
          >
            <Avatar className="rounded-full size-8">
              <AvatarFallback className="bg-gray-200">
                {user.firstName.charAt(0).toUpperCase()}
                {user.lastName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-light">{user.firstName}</span>
            {open ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Profile</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={"/profile"}>Edit Profile</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Advanced</DropdownMenuLabel>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuItem
                  onClick={async () => {
                    await clearQueryCache()
                  }}
                  className="cursor-pointer"
                >
                  Clear Cache
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  This can fix issues with stale data or abnormally long loading
                  times. Refreshing after clearing is recommended.
                </p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuItem className="cursor-pointer">
              <a href="mailto:umd@hack4impact.org">Report an Issue</a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={logout}
              variant="destructive"
              className="cursor-pointer"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
