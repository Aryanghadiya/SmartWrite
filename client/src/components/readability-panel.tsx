import { Badge } from "@/components/ui/badge";
import type { ReadabilityIssue } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Eye, FileText } from "lucide-react";

interface ReadabilityPanelProps {
  issues: ReadabilityIssue[];
}

const issueConfig: Record<string, { label: string; color: string; bg: string }> = {
  wordy: { label: "Wordy", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  passive: { label: "Passive Voice", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
  jargon: { label: "Jargon", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-500/10" },
  repeated: { label: "Repeated", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  confusing: { label: "Confusing", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
};

export function ReadabilityPanel({ issues }: ReadabilityPanelProps) {
  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in-up" data-testid="panel-readability-clean">
        <Eye className="w-8 h-8 text-green-500 mb-2" />
        <p className="text-sm font-medium">Clear writing</p>
        <p className="text-xs text-muted-foreground mt-1">No readability issues detected.</p>
      </div>
    );
  }

  const grouped = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {} as Record<string, ReadabilityIssue[]>);

  return (
    <div className="space-y-3 animate-fade-in-up" data-testid="panel-readability">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium">Readability Analysis</h3>
        <Badge variant="secondary" className="text-[10px]">{issues.length}</Badge>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([type, items]) => {
          const config = issueConfig[type] || issueConfig.confusing;
          return (
            <div key={type}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Badge className={cn("text-[10px]", config.bg, config.color)}>{config.label}</Badge>
                <span className="text-[10px] text-muted-foreground">{items.length} found</span>
              </div>
              <div className="space-y-1">
                {items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground pl-2 border-l-2 border-border py-1">
                    <span className="line-through opacity-60">{item.text.substring(0, 60)}{item.text.length > 60 ? "..." : ""}</span>
                    {item.suggestion && (
                      <span className="block mt-0.5 text-foreground/80">{item.suggestion}</span>
                    )}
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-[10px] text-muted-foreground pl-2">+{items.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
