import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GrammarError } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, BookOpen, Wand2 } from "lucide-react";
import { useState } from "react";

interface GrammarPanelProps {
  errors: GrammarError[];
  onApplyFix: (error: GrammarError) => void;
  onApplyAll: () => void;
}

const typeColors: Record<string, string> = {
  grammar: "bg-red-500/10 text-red-600 dark:text-red-400",
  spelling: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  punctuation: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  style: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export function GrammarPanel({ errors, onApplyFix, onApplyAll }: GrammarPanelProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (errors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in-up" data-testid="panel-grammar-clean">
        <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
        <p className="text-sm font-medium">No issues found</p>
        <p className="text-xs text-muted-foreground mt-1">Your writing looks great!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fade-in-up" data-testid="panel-grammar">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium">{errors.length} issue{errors.length !== 1 ? "s" : ""} found</span>
        </div>
        <Button variant="outline" size="sm" onClick={onApplyAll} data-testid="button-fix-all" className="text-xs">
          <Wand2 className="w-3 h-3 mr-1" />
          Fix All
        </Button>
      </div>

      <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
        {errors.map((error, idx) => (
          <Card
            key={idx}
            className={cn(
              "p-3 cursor-pointer transition-all hover-elevate",
              expandedIdx === idx && "ring-1 ring-primary/30"
            )}
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            data-testid={`card-grammar-error-${idx}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge className={cn("text-[10px] capitalize", typeColors[error.type])}>
                    {error.type}
                  </Badge>
                </div>
                <p className="text-sm">
                  <span className="line-through text-muted-foreground">{error.text}</span>
                  <span className="mx-1 text-muted-foreground">&rarr;</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">{error.suggestion}</span>
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyFix(error);
                }}
                data-testid={`button-fix-${idx}`}
                className="text-xs shrink-0"
              >
                Fix
              </Button>
            </div>

            {expandedIdx === idx && (
              <div className="mt-2 pt-2 border-t border-border animate-fade-in-up">
                <div className="flex items-start gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{error.explanation}</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
