import { useState, useCallback, useRef } from "react";
import type { FullAnalysis, ReaderReaction, ToneOption, AudienceOption, RelationshipOption } from "@/lib/types";

export function useAnalysis() {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [reactions, setReactions] = useState<ReaderReaction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGettingReactions, setIsGettingReactions] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const analyze = useCallback((text: string, audience: AudienceOption, relationship: RelationshipOption) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 10) {
      setAnalysis(null);
      setReactions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, audience, relationship }),
        });
        if (!res.ok) throw new Error("Analysis failed");
        const data = await res.json();
        setAnalysis(data);
      } catch (err) {
        console.error("Analysis error:", err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 800);
  }, []);

  const getReactions = useCallback(async (text: string, audiences: AudienceOption[]) => {
    if (text.trim().length < 10) return;
    setIsGettingReactions(true);
    try {
      const res = await fetch("/api/ai/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, audiences }),
      });
      if (!res.ok) throw new Error("Reactions failed");
      const data = await res.json();
      setReactions(data.reactions || []);
    } catch (err) {
      console.error("Reactions error:", err);
    } finally {
      setIsGettingReactions(false);
    }
  }, []);

  const transformTone = useCallback(async (text: string, targetTone: ToneOption): Promise<string | null> => {
    setIsTransforming(true);
    try {
      const res = await fetch("/api/ai/transform-tone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetTone }),
      });
      if (!res.ok) throw new Error("Transform failed");
      const data = await res.json();
      return data.rewritten || null;
    } catch (err) {
      console.error("Transform error:", err);
      return null;
    } finally {
      setIsTransforming(false);
    }
  }, []);

  const paraphrase = useCallback(async (text: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/ai/paraphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Paraphrase failed");
      const data = await res.json();
      return data.rewritten || null;
    } catch {
      return null;
    }
  }, []);

  const summarize = useCallback(async (text: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Summarize failed");
      const data = await res.json();
      return data.summary || null;
    } catch {
      return null;
    }
  }, []);

  return {
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
  };
}
