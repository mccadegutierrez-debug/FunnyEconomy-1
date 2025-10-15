import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface UsernameLinkProps {
  username: string;
  className?: string;
  children?: React.ReactNode;
}

export function UsernameLink({ username, className, children }: UsernameLinkProps) {
  return (
    <Link
      href={`/profile/${username}`}
      className={cn(
        "hover:text-primary hover:underline transition-colors cursor-pointer inline-block",
        className
      )}
      data-testid={`link-user-${username}`}
    >
      {children || username}
    </Link>
  );
}
