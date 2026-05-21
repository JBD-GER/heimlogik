import { badgeTone, labelFor } from "@/lib/dashboard/labels";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  value?: string | null;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  const tone = badgeTone(value);

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-md px-2.5 text-xs font-bold",
        tone === "success" && "bg-green-100 text-green-800",
        tone === "danger" && "bg-red-100 text-red-800",
        tone === "warning" && "bg-amber-100 text-amber-800",
        tone === "info" && "bg-sky-100 text-sky-800",
        tone === "neutral" && "bg-slate-100 text-slate-700",
      )}
    >
      {labelFor(value)}
    </span>
  );
}
