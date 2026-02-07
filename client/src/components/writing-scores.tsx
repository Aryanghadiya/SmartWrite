import { ScoreRing } from "./score-ring";
import type { WritingScores as WritingScoresType } from "@/lib/types";
import { BarChart3 } from "lucide-react";

interface WritingScoresProps {
  scores: WritingScoresType | null;
}

export function WritingScoresPanel({ scores }: WritingScoresProps) {
  if (!scores) return null;

  const scoreItems = [
    { key: "overall", label: "Overall" },
    { key: "clarity", label: "Clarity" },
    { key: "grammar", label: "Grammar" },
    { key: "confidence", label: "Confidence" },
    { key: "engagement", label: "Engagement" },
    { key: "professionalism", label: "Professional" },
    { key: "readability", label: "Readability" },
  ] as const;

  return (
    <div className="space-y-3 animate-fade-in-up" data-testid="panel-writing-scores">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium">Writing Score</h3>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {scoreItems.map((item) => (
          <ScoreRing
            key={item.key}
            score={scores[item.key]}
            label={item.label}
            size={item.key === "overall" ? 72 : 60}
            strokeWidth={item.key === "overall" ? 5 : 4}
          />
        ))}
      </div>
    </div>
  );
}
