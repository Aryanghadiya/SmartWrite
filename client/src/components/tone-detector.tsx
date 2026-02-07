import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ToneResult, ToneOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

interface ToneDetectorProps {
  tone: ToneResult | null;
  onTransformTone: (tone: ToneOption) => void;
  isTransforming: boolean;
}

const toneOptions: { value: ToneOption; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "assertive", label: "Assertive" },
  { value: "persuasive", label: "Persuasive" },
];

const toneColors: Record<string, string> = {
  professional: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  casual: "bg-green-500/10 text-green-600 dark:text-green-400",
  friendly: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  assertive: "bg-red-500/10 text-red-600 dark:text-red-400",
  persuasive: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  neutral: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
};

export function ToneDetector({ tone, onTransformTone, isTransforming }: ToneDetectorProps) {
  if (!tone) return null;

  const topTones = Object.entries(tone.breakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-3 animate-fade-in-up" data-testid="panel-tone-detector">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium">Detected Tone</h3>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={cn("capitalize", toneColors[tone.detected.toLowerCase()] || toneColors.neutral)}>
          {tone.detected}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {Math.round(tone.confidence * 100)}% confidence
        </span>
      </div>

      <div className="space-y-1.5">
        {topTones.map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-20 capitalize truncate">{key}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/60 transition-all duration-500"
                style={{ width: `${Math.round(val * 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">{Math.round(val * 100)}%</span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Rewrite in a different tone:</p>
        <div className="flex flex-wrap gap-1.5">
          {toneOptions.map((opt) => (
            <Button
              key={opt.value}
              variant="outline"
              size="sm"
              disabled={isTransforming || opt.value === tone.detected.toLowerCase()}
              onClick={() => onTransformTone(opt.value)}
              data-testid={`button-tone-${opt.value}`}
              className="text-xs gap-1"
            >
              {opt.label}
              <ArrowRight className="w-3 h-3" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
