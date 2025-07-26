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
import { useQueryClient } from "@tanstack/react-query";

type NavProfileProps = {
  user: UserProfile;
  className?: string;
};

export default function NavProfile({ user, className = "" }: NavProfileProps) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient()

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
              Edit Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Advanced</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={async () => {
                await queryClient.cancelQueries()
                await queryClient.invalidateQueries()
                queryClient.clear()
              }}
              className="cursor-pointer"
            >
              Clear Cache
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={true}
              className="cursor-pointer"
            >
              Report an Issue
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
