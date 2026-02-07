export interface GrammarError {
  text: string;
  suggestion: string;
  explanation: string;
  type: "grammar" | "spelling" | "punctuation" | "style";
  startIndex: number;
  endIndex: number;
}

export interface ToneResult {
  detected: string;
  confidence: number;
  breakdown: Record<string, number>;
}

export interface WritingScores {
  clarity: number;
  grammar: number;
  confidence: number;
  engagement: number;
  professionalism: number;
  readability: number;
  overall: number;
}

export interface ReadabilityIssue {
  type: "wordy" | "passive" | "jargon" | "repeated" | "confusing";
  text: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
}

export interface EmotionResult {
  detected: string[];
  regretRisk: "low" | "medium" | "high";
  warning?: string;
}

export interface IntentAnalysis {
  intendedMeaning: string;
  perceivedMeaning: string;
  warnings: Array<{
    type: "rude" | "passive_aggressive" | "insecure" | "over_apologizing" | "dominant";
    description: string;
  }>;
}

export interface ReaderReaction {
  audience: string;
  emotionalReaction: string;
  riskLevel: "low" | "medium" | "high";
  saferRewrite: string;
}

export interface FullAnalysis {
  grammar: { errors: GrammarError[] };
  tone: ToneResult;
  scores: WritingScores;
  readability: { issues: ReadabilityIssue[] };
  emotions: EmotionResult;
  intentAnalysis: IntentAnalysis;
}

export type ToneOption = "professional" | "casual" | "friendly" | "assertive" | "persuasive";
export type AudienceOption = "recruiter" | "professor" | "manager" | "client" | "teammate";
export type RelationshipOption = "senior" | "junior" | "peer" | "customer";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
