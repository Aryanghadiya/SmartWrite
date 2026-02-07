import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface RiskMeterProps {
  level: "low" | "medium" | "high";
  label?: string;
  className?: string;
}

const riskConfig = {
  low: {
    color: "text-green-500 dark:text-green-400",
    bg: "bg-green-500/10",
    barColor: "bg-green-500",
    icon: CheckCircle,
    label: "Low Risk",
    width: "w-1/3",
  },
  medium: {
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/10",
    barColor: "bg-amber-500",
    icon: AlertCircle,
    label: "Medium Risk",
    width: "w-2/3",
  },
  high: {
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-500/10",
    barColor: "bg-red-500",
    icon: AlertTriangle,
    label: "High Risk",
    width: "w-full",
  },
};

export function RiskMeter({ level, label, className }: RiskMeterProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2", className)} data-testid={`risk-meter-${level}`}>
      <Icon className={cn("w-4 h-4 shrink-0", config.color)} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">{label || config.label}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", config.barColor, config.width)}
          />
        </div>
      </div>
    </div>
  );
}
