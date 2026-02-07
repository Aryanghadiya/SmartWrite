import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EmotionResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Heart, ShieldAlert } from "lucide-react";

interface EmotionDetectorProps {
  emotions: EmotionResult | null;
}

const regretColors = {
  low: "text-green-600 dark:text-green-400",
  medium: "text-amber-600 dark:text-amber-400",
  high: "text-red-600 dark:text-red-400",
};

export function EmotionDetector({ emotions }: EmotionDetectorProps) {
  if (!emotions) return null;

  return (
    <div className="space-y-3 animate-fade-in-up" data-testid="panel-emotion-detector">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium">Emotional Analysis</h3>
      </div>

      {emotions.detected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {emotions.detected.map((emotion) => (
            <Badge key={emotion} variant="secondary" className="text-xs capitalize">
              {emotion}
            </Badge>
          ))}
        </div>
      )}

      {emotions.regretRisk !== "low" && emotions.warning && (
        <Card className={cn(
          "p-3 border-l-2",
          emotions.regretRisk === "high" ? "border-l-red-500 bg-red-500/5" : "border-l-amber-500 bg-amber-500/5"
        )}>
          <div className="flex items-start gap-2">
            <ShieldAlert className={cn("w-4 h-4 shrink-0 mt-0.5", regretColors[emotions.regretRisk])} />
            <div>
              <p className={cn("text-xs font-medium mb-0.5", regretColors[emotions.regretRisk])}>
                {emotions.regretRisk === "high" ? "Regret Warning" : "Caution"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{emotions.warning}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
