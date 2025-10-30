import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 210 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      fill="currentColor"
    >
      <g>
        <path d="M3.333 11.667v-5h5v-5h23.333v5h5v5h-3.333v16.667h-26.667v-16.667h-3.333zm26.667-1.667v-1.667h-1.667v-3.333h-20v3.333h-1.667v1.667h23.333zM8.333 26.667h20v-13.333h-20v13.333z m3.333-10h13.333v6.667h-13.333v-6.667z" />
        <text 
          x="45" 
          y="30" 
          fontFamily="Poppins, sans-serif" 
          fontSize="30" 
          fontWeight="bold"
          letterSpacing="2"
        >
          NOEMIA
        </text>
      </g>
    </svg>
  );
}
