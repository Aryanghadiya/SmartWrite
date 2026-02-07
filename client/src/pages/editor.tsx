import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { useUser } from "@/hooks/use-user";
import { apiRequest } from "@/lib/queryClient";
import type { AudienceOption, RelationshipOption, GrammarError, ToneOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  PenLine, MessageSquare, Moon, Sun, Loader2, Wand2, FileText,
  ArrowRight, RotateCcw, Copy, Users, Upload, LogIn, LogOut, History, Play
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<AudienceOption>("manager");
  const [relationship, setRelationship] = useState<RelationshipOption>("peer");
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("grammar");
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const { user, logout } = useUser();
  const [, setLocation] = useLocation();

  const {
    analysis,
    setAnalysis, // Need this exposed from useAnalysis if not already
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

  // Fetch history only if user is logged in
  const { data: history, refetch: refetchHistory } = useQuery({
    queryKey: ["/api/history"],
    enabled: !!user,
  });

  useEffect(() => {
    if (!manualMode && content.trim().length >= 10) {
      analyze(content, audience, relationship);
    }
  }, [content, audience, relationship, analyze, manualMode]);

  const handleManualAnalyze = useCallback(() => {
    if (content.trim().length >= 5) {
      analyze(content, audience, relationship);
    } else {
      toast({ title: "Text too short", description: "Type at least 5 characters.", variant: "destructive" });
    }
  }, [content, audience, relationship, analyze, toast]);

  // Helper to find the actual position of the error text
  const findBestMatch = useCallback((fullText: string, searchStr: string, approxIndex: number): { start: number, end: number } | null => {
    if (!searchStr) return null;

    // 1. Check exact match at approxIndex
    if (fullText.substring(approxIndex, approxIndex + searchStr.length) === searchStr) {
      return { start: approxIndex, end: approxIndex + searchStr.length };
    }

    // 2. Search nearby (within 50 chars)
    const range = 50;
    const startSearch = Math.max(0, approxIndex - range);
    const endSearch = Math.min(fullText.length, approxIndex + range);
    const snippet = fullText.substring(startSearch, endSearch);
    const relativeIdx = snippet.indexOf(searchStr);

    if (relativeIdx !== -1) {
      return { start: startSearch + relativeIdx, end: startSearch + relativeIdx + searchStr.length };
    }

    // 3. Global search fallback
    const globalIdx = fullText.indexOf(searchStr);
    if (globalIdx !== -1) {
      return { start: globalIdx, end: globalIdx + searchStr.length };
    }

    return null;
  }, []);

  const handleApplyFix = useCallback((error: GrammarError) => {
    const match = findBestMatch(content, error.text, error.startIndex);

    if (!match) {
      toast({ title: "Could not apply fix", description: "Text has changed or not found.", variant: "destructive" });
      return;
    }

    const newContent = content.substring(0, match.start) + error.suggestion + content.substring(match.end);
    setContent(newContent);
    toast({ title: "Fix applied", description: `"${error.text}" → "${error.suggestion}"` });
  }, [content, findBestMatch, toast]);

  const handleApplyAll = useCallback(() => {
    if (!analysis?.grammar?.errors?.length) return;

    let newContent = content;
    // We need to track offset shift if we process multiple errors
    // Simpler approach: Process from end to start using original indices BUT verifying them against current content state?
    // Actually, if we just replace string by string, we might mess up if there are duplicate errors.
    // robust way: sort errors by verified start index descending.

    const validatedErrors = analysis.grammar.errors
      .map(e => ({ ...e, match: findBestMatch(content, e.text, e.startIndex) }))
      .filter(e => e.match !== null)
      .sort((a, b) => b.match!.start - a.match!.start);

    for (const error of validatedErrors) {
      // Re-verify because content hasn't changed yet in this loop, so old indices are valid relative to 'content'
      // BUT we are building 'newContent'. 
      // Actually easier: since we sort descending, we can modify newContent repeatedly using the ORIGINAL indices (verified).

      const { start, end } = error.match!;
      // Double check if this part of newContent is still valid? 
      // Since we sort descending, we are modifying the END of the string, so start indices remain valid.
      newContent = newContent.substring(0, start) + error.suggestion + newContent.substring(end);
    }

    setContent(newContent);
    toast({ title: "All fixes applied", description: `Fixed ${validatedErrors.length} issues.` });
  }, [analysis, content, findBestMatch, toast]);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (data.text) {
        setContent(data.text);
        toast({ title: "File uploaded", description: "Text extracted successfully." });
      }
    } catch (error) {
      toast({ title: "Upload failed", description: "Could not extract text.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const loadHistoryItem = (item: any) => {
    setContent(item.originalText);
    // Ideally we could setAnalysis(item.result) if useAnalysis exposed it
    // But re-analyzing is also fine or we can extend useAnalysis
    // For now, let's just set content. It will auto-analyze if manual mode is off.
    // IF manual mode is on, user has to click analyze.
    toast({ title: "History loaded", description: "Loaded past text." });
  };

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

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".txt,.pdf,.docx"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs"
            >
              {isUploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
              Upload
            </Button>

            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1.5 rounded-md">
              <Switch
                id="manual-mode"
                checked={manualMode}
                onCheckedChange={setManualMode}
                className="h-4 w-7"
              />
              <Label htmlFor="manual-mode" className="text-xs cursor-pointer">Manual</Label>
            </div>

            {manualMode && (
              <Button
                size="sm"
                onClick={handleManualAnalyze}
                disabled={isAnalyzing || content.trim().length < 5}
                className="text-xs h-8"
              >
                {isAnalyzing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
                Analyze
              </Button>
            )}

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

            <div className="h-5 w-px bg-border" />

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium hidden sm:inline-block">
                  {user.username}
                </span>
                <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                  <LogOut className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="default" size="sm" className="text-xs h-8">
                  <LogIn className="w-3 h-3 mr-1" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-auto p-6">
              <Card className="p-6 min-h-full">
                <WritingEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing here... or upload a file."
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
                    Score: {analysis.scores?.overall ?? 0}/100
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
                <TabsList className="w-full grid grid-cols-5">
                  <TabsTrigger value="grammar" className="text-[10px] px-1" data-testid="tab-grammar">
                    Grammar
                  </TabsTrigger>
                  <TabsTrigger value="tone" className="text-[10px] px-1" data-testid="tab-tone">
                    Tone
                  </TabsTrigger>
                  <TabsTrigger value="intent" className="text-[10px] px-1" data-testid="tab-intent">
                    Intent
                  </TabsTrigger>
                  <TabsTrigger value="scores" className="text-[10px] px-1" data-testid="tab-scores">
                    Scores
                  </TabsTrigger>
                  {user && (
                    <TabsTrigger value="history" className="text-[10px] px-1">
                      History
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3">
                {activeTab === "history" && user ? (
                  <div className="space-y-3">
                    {!history || history.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No history found.
                      </p>
                    ) : (
                      history.map((item: any) => (
                        <Card
                          key={item.id}
                          className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => loadHistoryItem(item)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <Badge variant="outline" className="text-[10px]">
                              Score: {item.result.scores?.overall ?? "?"}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs line-clamp-2 text-foreground/80">
                            {item.originalText}
                          </p>
                        </Card>
                      ))
                    )}
                  </div>
                ) : (
                  <>
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
                              errors={analysis.grammar?.errors || []}
                              onApplyFix={handleApplyFix}
                              onApplyAll={handleApplyAll}
                            />
                            <div className="border-t border-border pt-4">
                              <ReadabilityPanel issues={analysis.readability?.issues || []} />
                            </div>
                          </>
                        )}

                        {activeTab === "tone" && (
                          <>
                            <ToneDetector
                              tone={analysis.tone || { detected: "neutral", confidence: 0, breakdown: {} }}
                              onTransformTone={handleToneTransform}
                              isTransforming={isTransforming}
                            />
                            <div className="border-t border-border pt-4">
                              <EmotionDetector emotions={analysis.emotions || { detected: [], regretRisk: "low" }} />
                            </div>
                          </>
                        )}

                        {activeTab === "intent" && (
                          <>
                            <IntentAnalyzer analysis={analysis.intentAnalysis || { intendedMeaning: "", perceivedMeaning: "", warnings: [] }} />
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
                          <WritingScoresPanel scores={analysis.scores || { clarity: 0, grammar: 0, confidence: 0, engagement: 0, professionalism: 0, readability: 0, overall: 0 }} />
                        )}
                      </div>
                    )}
                  </>
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
