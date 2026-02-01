import { Crown } from "lucide-react";

export function VIPBadge({
  size = "default",
}: {
  size?: "default" | "sm" | "lg";
}) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    default: "px-3 py-1 text-xs gap-1.5",
    lg: "px-4 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    default: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`inline-flex items-center font-bold rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-stone-900 shadow-lg shadow-amber-500/20 ${sizeClasses[size]}`}
    >
      <Crown className={`${iconSizes[size]} fill-stone-900`} />
      <span>VIP Member</span>
    </div>
  );
}
