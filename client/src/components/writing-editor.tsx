import { useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WritingEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function WritingEditor({ value, onChange, placeholder = "Start writing here...", className }: WritingEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className={cn("relative flex-1", className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        data-testid="input-editor"
        className="w-full h-full min-h-[400px] resize-none bg-transparent text-base leading-relaxed focus:outline-none placeholder:text-muted-foreground/50 font-sans"
        spellCheck={false}
      />
    </div>
  );
}
