import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("h-10 w-10", className)}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7d9d9" />
          <stop offset="100%" stopColor="#e8b4b8" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#c09a3e" />
        </linearGradient>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c7809a" />
          <stop offset="100%" stopColor="#b36987" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#grad1)" stroke="#3a2d32" strokeWidth="1" />
      
      {/* Gold Flower */}
      <path d="M 30 70 C 20 60, 20 40, 30 30 S 40 20, 50 30 S 60 40, 50 50 Z" fill="url(#grad2)" fillOpacity="0.8" transform="rotate(20 50 50)"/>
      <path d="M 40 75 C 30 65, 30 45, 40 35 S 50 25, 60 35 S 70 45, 60 55 Z" fill="url(#grad2)" fillOpacity="0.6" transform="rotate(-30 50 50) scale(0.9) translate(5, -5)" />
      
      {/* Pink Flower */}
      <path d="M 70 70 C 60 80, 40 80, 30 70 S 20 60, 30 50 S 40 40, 50 50 Z" fill="url(#grad3)" fillOpacity="0.9" transform="rotate(120 50 50) scale(1.1)" />
      <path d="M 65 35 C 75 45, 75 65, 65 75 S 55 85, 45 75 S 35 65, 45 55 Z" fill="url(#grad3)" fillOpacity="0.7" transform="rotate(50 50 50) scale(0.8) translate(20,15)" />

      {/* Dark Leaves */}
      <path d="M 20 50 C 30 40, 40 40, 50 50 C 40 60, 30 60, 20 50 Z" fill="#3a2d32" transform="scale(0.8) translate(15, 45)" />
      <path d="M 80 50 C 70 40, 60 40, 50 50 C 60 60, 70 60, 80 50 Z" fill="#3a2d32" transform="scale(0.7) translate(30, -50)" />
      <path d="M 50 80 C 60 70, 60 60, 50 50 C 40 60, 40 70, 50 80 Z" fill="#3a2d32" transform="scale(0.6) translate(-75, -20)"/>
    </svg>
  );
}
