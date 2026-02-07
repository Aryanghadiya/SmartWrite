import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { useLocation } from "wouter";
import {
  PenLine, Sparkles, Shield, Target, Users, Brain, BarChart3,
  Heart, BookOpen, Eye, ArrowRight, Moon, Sun, Zap, CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Grammar & Spell Check",
    description: "Real-time context-aware corrections with one-click fixes and educational explanations for every error.",
  },
  {
    icon: Target,
    title: "Intent vs Interpretation",
    description: "See 'what you meant' versus 'how it may sound' — catch passive aggression, rudeness, or insecurity before sending.",
  },
  {
    icon: Users,
    title: "Reader Reaction Predictor",
    description: "Predict how recruiters, managers, professors, and clients will emotionally react to your message.",
  },
  {
    icon: Shield,
    title: "Regret Detection",
    description: "AI detects anger, panic, or frustration and warns you before you send a message you'll regret.",
  },
  {
    icon: BarChart3,
    title: "Writing Score Dashboard",
    description: "Live scores for clarity, grammar, confidence, engagement, professionalism, and readability.",
  },
  {
    icon: Brain,
    title: "Tone Transformation",
    description: "Instantly rewrite any text in Professional, Casual, Friendly, Assertive, or Persuasive tone.",
  },
  {
    icon: Eye,
    title: "Readability Analyzer",
    description: "Color-coded highlighting for wordy sentences, passive voice, jargon, and confusing structures.",
  },
  {
    icon: Heart,
    title: "Power Dynamics",
    description: "Smart suggestions that adapt based on whether you're writing to a senior, junior, peer, or customer.",
  },
  {
    icon: BookOpen,
    title: "AI Writing Assistant",
    description: "Built-in AI chat for brainstorming, paraphrasing, summarization, and idea generation.",
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background" data-testid="page-landing">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <PenLine className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">SmartWrite</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle-landing">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button onClick={() => setLocation("/editor")} data-testid="button-get-started-header">
              Get Started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              AI Communication Intelligence Platform
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Most tools check language.
              <br />
              <span className="text-primary">SmartWrite checks consequences.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Go beyond grammar. Predict reader reactions, detect emotional risks, analyze tone dynamics, and write with confidence.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button size="lg" onClick={() => setLocation("/editor")} data-testid="button-start-writing">
                Start Writing
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }} data-testid="button-explore-features">
                Explore Features
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
              {[
                "Real-time Analysis",
                "Tone Detection",
                "Reaction Prediction",
                "Power Dynamics",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-card/50" id="features">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Everything you need to write with impact
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                SmartWrite combines advanced AI with communication psychology to help you write better and predict outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="p-5 hover-elevate"
                    data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1.5">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to write smarter?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              SmartWrite uses advanced AI to analyze your writing in real-time and predict how it will be received.
            </p>
            <Button size="lg" onClick={() => setLocation("/editor")} data-testid="button-cta-start">
              <PenLine className="w-4 h-4 mr-2" />
              Start Writing Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <PenLine className="w-3.5 h-3.5" />
            <span>SmartWrite</span>
          </div>
          <span>AI Communication Intelligence Platform</span>
        </div>
      </footer>
    </div>
  );
}
