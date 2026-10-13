import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "info" | "destructive";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary/12 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/15 text-destructive",
};

/** Tarjeta de indicador del panel. */
export const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-lg border bg-card p-4 shadow-sm transition-[box-shadow,transform] duration-200 hover:shadow-elegant motion-reduce:transition-none [@media(hover:hover)]:hover:-translate-y-0.5 motion-reduce:[@media(hover:hover)]:hover:translate-y-0",
      className,
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="font-tabular mt-2 text-2xl font-semibold leading-none">{value}</p>
        {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {Icon ? (
        <span className={cn("rounded-md p-2", TONE_CLASSES[tone])}>
          <Icon className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  </div>
);
