import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { WritingEditor } from "@/components/writing-editor";
import { GrammarPanel } from "@/components/grammar-panel";
import { ToneDetector } from "@/components/tone-detector";
import { WritingScoresPanel } from "@/components/writing-scores";
import { ReaderReactions } from "@/components/reader-reactions";
import { IntentAnalyzer } from "@/components/intent-analyzer";
import { EmotionDetector } from "@/components/emotion-detector";
import { ReadabilityPanel } from "@/components/readability-panel";
import { AudienceSelector } from "@/components/audience-selector";
import { AiChatSidebar } from "@/components/ai-chat-sidebar";
import { useAnalysis } from "@/hooks/use-analysis";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import type { AudienceOption, RelationshipOption, GrammarError, ToneOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  PenLine, MessageSquare, Moon, Sun, Loader2, Wand2, FileText,
  ArrowRight, RotateCcw, Copy, Users,
} from "lucide-react";

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<AudienceOption>("manager");
  const [relationship, setRelationship] = useState<RelationshipOption>("peer");
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("grammar");
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const {
    analysis,
    reactions,
    isAnalyzing,
    isGettingReactions,
    isTransforming,
    analyze,
    getReactions,
    transformTone,
    paraphrase,
    summarize,
  } = useAnalysis();

  useEffect(() => {
    if (content.trim().length >= 10) {
      analyze(content, audience, relationship);
    }
  }, [content, audience, relationship, analyze]);

  const handleApplyFix = useCallback((error: GrammarError) => {
    const newContent = content.substring(0, error.startIndex) + error.suggestion + content.substring(error.endIndex);
    setContent(newContent);
    toast({ title: "Fix applied", description: `"${error.text}" → "${error.suggestion}"` });
  }, [content, toast]);

  const handleApplyAll = useCallback(() => {
    if (!analysis?.grammar?.errors?.length) return;
    let newContent = content;
    const sorted = [...analysis.grammar.errors].sort((a, b) => b.startIndex - a.startIndex);
    for (const error of sorted) {
      newContent = newContent.substring(0, error.startIndex) + error.suggestion + newContent.substring(error.endIndex);
    }
    setContent(newContent);
    toast({ title: "All fixes applied", description: `Fixed ${sorted.length} issues.` });
  }, [analysis, content, toast]);

  const handleToneTransform = useCallback(async (tone: ToneOption) => {
    const result = await transformTone(content, tone);
    if (result) {
      setContent(result);
      toast({ title: "Tone transformed", description: `Rewritten in ${tone} tone.` });
    }
  }, [content, transformTone, toast]);

  const handleGetReactions = useCallback(() => {
    getReactions(content, ["recruiter", "professor", "manager", "client", "teammate"]);
  }, [content, getReactions]);

  const handleParaphrase = useCallback(async () => {
    setIsParaphrasing(true);
    const result = await paraphrase(content);
    if (result) {
      setContent(result);
      toast({ title: "Paraphrased", description: "Your text has been rewritten." });
    }
    setIsParaphrasing(false);
  }, [content, paraphrase, toast]);

  const handleSummarize = useCallback(async () => {
    setIsSummarizing(true);
    const result = await summarize(content);
    if (result) {
      setContent(result);
      toast({ title: "Summarized", description: "Your text has been condensed." });
    }
    setIsSummarizing(false);
  }, [content, summarize, toast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied", description: "Text copied to clipboard." });
  }, [content, toast]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="flex h-screen w-full overflow-hidden" data-testid="page-editor">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <PenLine className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-tight">SmartWrite</h1>
                <p className="text-[10px] text-muted-foreground">AI Communication Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <AudienceSelector
              audience={audience}
              relationship={relationship}
              onAudienceChange={setAudience}
              onRelationshipChange={setRelationship}
            />

            <div className="h-5 w-px bg-border" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleParaphrase}
              disabled={isParaphrasing || content.trim().length < 10}
              data-testid="button-paraphrase"
              className="text-xs"
            >
              {isParaphrasing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RotateCcw className="w-3 h-3 mr-1" />}
              Paraphrase
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSummarize}
              disabled={isSummarizing || content.trim().length < 10}
              data-testid="button-summarize"
              className="text-xs"
            >
              {isSummarizing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <FileText className="w-3 h-3 mr-1" />}
              Summarize
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!content.trim()}
              data-testid="button-copy"
              className="text-xs"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>

            <div className="h-5 w-px bg-border" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatOpen(!chatOpen)}
              data-testid="button-toggle-chat"
              className={cn(chatOpen && "bg-primary/10")}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-toggle-theme">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-auto p-6">
              <Card className="p-6 min-h-full">
                <WritingEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing here... SmartWrite will analyze your text in real-time and provide intelligent suggestions."
                />
              </Card>
            </div>

            <div className="flex items-center justify-between px-6 py-2 border-t border-border bg-card text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span data-testid="text-word-count">{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
              <div className="flex items-center gap-2">
                {isAnalyzing && (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    <span>Analyzing...</span>
                  </div>
                )}
                {analysis && !isAnalyzing && (
                  <Badge variant="secondary" className="text-[10px]">
                    Score: {analysis.scores.overall}/100
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="w-[380px] border-l border-border bg-card flex flex-col shrink-0">
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-medium">Analysis</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetReactions}
                  disabled={isGettingReactions || content.trim().length < 10}
                  data-testid="button-get-reactions"
                  className="text-xs"
                >
                  {isGettingReactions ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Users className="w-3 h-3 mr-1" />
                  )}
                  Predict Reactions
                </Button>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="grammar" className="text-xs" data-testid="tab-grammar">
                    Grammar
                  </TabsTrigger>
                  <TabsTrigger value="tone" className="text-xs" data-testid="tab-tone">
                    Tone
                  </TabsTrigger>
                  <TabsTrigger value="intent" className="text-xs" data-testid="tab-intent">
                    Intent
                  </TabsTrigger>
                  <TabsTrigger value="scores" className="text-xs" data-testid="tab-scores">
                    Scores
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3">
                {!analysis && !isAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Wand2 className="w-10 h-10 text-muted-foreground/20 mb-3" />
                    <p className="text-sm text-muted-foreground">Start typing to see analysis</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">SmartWrite checks consequences, not just language</p>
                  </div>
                )}

                {isAnalyzing && !analysis && (
                  <div className="space-y-4 py-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                )}

                {analysis && (
                  <div className="space-y-4">
                    {activeTab === "grammar" && (
                      <>
                        <GrammarPanel
                          errors={analysis.grammar.errors}
                          onApplyFix={handleApplyFix}
                          onApplyAll={handleApplyAll}
                        />
                        <div className="border-t border-border pt-4">
                          <ReadabilityPanel issues={analysis.readability.issues} />
                        </div>
                      </>
                    )}

                    {activeTab === "tone" && (
                      <>
                        <ToneDetector
                          tone={analysis.tone}
                          onTransformTone={handleToneTransform}
                          isTransforming={isTransforming}
                        />
                        <div className="border-t border-border pt-4">
                          <EmotionDetector emotions={analysis.emotions} />
                        </div>
                      </>
                    )}

                    {activeTab === "intent" && (
                      <>
                        <IntentAnalyzer analysis={analysis.intentAnalysis} />
                        {reactions.length > 0 && (
                          <div className="border-t border-border pt-4">
                            <ReaderReactions
                              reactions={reactions}
                              onApplyRewrite={(text) => {
                                setContent(text);
                                toast({ title: "Rewrite applied" });
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {activeTab === "scores" && (
                      <WritingScoresPanel scores={analysis.scores} />
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <AiChatSidebar
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        writingContent={content}
      />
    </div>
  );
}
