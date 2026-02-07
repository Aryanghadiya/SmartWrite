import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskMeter } from "./risk-meter";
import type { ReaderReaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Users, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ReaderReactionsProps {
  reactions: ReaderReaction[];
  onApplyRewrite: (text: string) => void;
}

const audienceIcons: Record<string, string> = {
  recruiter: "R",
  professor: "P",
  manager: "M",
  client: "C",
  teammate: "T",
};

export function ReaderReactions({ reactions, onApplyRewrite }: ReaderReactionsProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (reactions.length === 0) return null;

  return (
    <div className="space-y-3 animate-fade-in-up" data-testid="panel-reader-reactions">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium">Reader Reactions</h3>
      </div>

      <div className="space-y-2">
        {reactions.map((reaction, idx) => (
          <Card
            key={idx}
            className={cn("p-3 transition-all hover-elevate cursor-pointer")}
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            data-testid={`card-reaction-${reaction.audience.toLowerCase()}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {audienceIcons[reaction.audience.toLowerCase()] || reaction.audience[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium capitalize">{reaction.audience}</span>
                  <Badge
                    className={cn(
                      "text-[10px]",
                      reaction.riskLevel === "low" && "bg-green-500/10 text-green-600 dark:text-green-400",
                      reaction.riskLevel === "medium" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      reaction.riskLevel === "high" && "bg-red-500/10 text-red-600 dark:text-red-400"
                    )}
                  >
                    {reaction.riskLevel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{reaction.emotionalReaction}</p>
                <RiskMeter level={reaction.riskLevel} className="mt-2" />
              </div>
              {expandedIdx === idx ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </div>

            {expandedIdx === idx && (
              <div className="mt-3 pt-3 border-t border-border animate-fade-in-up">
                <p className="text-xs text-muted-foreground mb-1.5">Safer alternative:</p>
                <div className="bg-green-500/5 rounded-md p-2.5 text-sm leading-relaxed">
                  {reaction.saferRewrite}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyRewrite(reaction.saferRewrite);
                  }}
                  data-testid={`button-apply-rewrite-${idx}`}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Use This Version
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
