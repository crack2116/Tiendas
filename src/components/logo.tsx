import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("h-6 w-6", className)}
      fill="currentColor"
    >
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" fill="none" />
      <path d="M 30 70 Q 50 20 70 70" stroke="currentColor" strokeWidth="4" fill="none" />
      <path d="M 30 70 L 70 70" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
  );
}
