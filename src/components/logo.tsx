import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-6 w-6", className)}
    >
      <path d="M16.907,8.343A4.25,4.25,0,0,1,12,12.55a4.25,4.25,0,0,1-4.907-4.207A4.25,4.25,0,0,1,12,3.5a4.25,4.25,0,0,1,4.907,4.843Z" opacity="0.5"/>
      <path d="M19.96,15.25a4.25,4.25,0,0,1-7.149.333,4.25,4.25,0,0,1,2.242-7.8,4.25,4.25,0,0,1,4.574,7.464Z" opacity="0.75"/>
      <path d="M11.667,20.467a4.25,4.25,0,0,1-4.575-7.465,4.25,4.25,0,0,1,7.149-.332A4.25,4.25,0,0,1,11.667,20.467Z"/>
    </svg>
  );
}
