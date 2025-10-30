import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      fill="currentColor"
    >
      <text 
        x="0" 
        y="30" 
        fontFamily="Poppins, sans-serif" 
        fontSize="30" 
        fontWeight="bold"
        letterSpacing="2"
      >
        NOEMIA
      </text>
    </svg>
  );
}