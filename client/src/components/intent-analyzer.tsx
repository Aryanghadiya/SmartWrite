import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IntentAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Target, AlertTriangle, ArrowRight } from "lucide-react";

interface IntentAnalyzerProps {
  analysis: IntentAnalysis | null;
}

const warningTypeLabels: Record<string, string> = {
  rude: "May Sound Rude",
  passive_aggressive: "Passive Aggressive",
  insecure: "Sounds Insecure",
  over_apologizing: "Over-Apologizing",
  dominant: "Overly Dominant",
};

const warningColors: Record<string, string> = {
  rude: "bg-red-500/10 text-red-600 dark:text-red-400",
  passive_aggressive: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  insecure: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  over_apologizing: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  dominant: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export function IntentAnalyzer({ analysis }: IntentAnalyzerProps) {
  if (!analysis) return null;

  return (
    <div className="space-y-3 animate-fade-in-up" data-testid="panel-intent-analyzer">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium">Intent vs Interpretation</h3>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Card className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">What You Meant</p>
          <p className="text-sm leading-relaxed">{analysis.intendedMeaning}</p>
        </Card>

        <div className="flex justify-center">
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
        </div>

        <Card className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">How It May Sound</p>
          <p className="text-sm leading-relaxed">{analysis.perceivedMeaning}</p>
        </Card>
      </div>

      {analysis.warnings.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Communication Risks</span>
          </div>
          {analysis.warnings.map((warning, idx) => (
            <div key={idx} className="flex items-start gap-2 py-1.5">
              <Badge className={cn("text-[10px] shrink-0", warningColors[warning.type] || warningColors.rude)}>
                {warningTypeLabels[warning.type] || warning.type}
              </Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">{warning.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
