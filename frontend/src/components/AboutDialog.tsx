import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  CheckIcon,
  ClipboardIcon,
  ExternalLink,
  GitPullRequestIcon,
  MailIcon,
} from "lucide-react";
import { throwErrorToast } from "./toasts/ErrorToast";
import { useState } from "react";

export default function AboutDialog() {
  const commit = import.meta.env.DEV
    ? "dev"
    : import.meta.env.VITE_COMMIT
      ? import.meta.env.VITE_COMMIT
      : "unknown";

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commit);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      throwErrorToast("Failed to copy");
      setCopied(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>About</DialogTitle>
        <DialogDescription>
          The Hack4Impact-UMD Application portal.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 text-sm">
        <div>
          <p className="font-medium">Built from commit:</p>
          <div className="flex items-center gap-2">
            <p className="font-mono grow text-muted-foreground" title={commit}>
              {commit.slice(0, 7)}
            </p>

            {copied ? (
              <Button
                variant="outline"
                size="sm"
                className="h-7 bg-green-200 hover:bg-green-200 border-green-500 text-green-800 hover:text-green-800"
              >
                <CheckIcon /> Copied!
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                onClick={handleCopy}
              >
                <ClipboardIcon /> Copy commit hash
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-center gap-2 text-blue-500 underline-offset-4 [&>a:hover]:underline">
            <a
              className="flex flex-row gap-1 items-center"
              href="https://umd.hack4impact.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="size-4" />
              Main Website
            </a>
            |
            <a
              className="flex flex-row gap-1 items-center"
              href="mailto:umd@hack4impact.org"
            >
              <MailIcon className="size-4" />
              Report an Issue
            </a>
            |
            <a
              className="flex flex-row gap-1 items-center"
              href="https://github.com/Hack4Impact-UMD/h4i-internal-application-tool"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitPullRequestIcon className="size-4" />
              GitHub
            </a>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Made with ❤️ by the Hack4Impact-UMD team
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
