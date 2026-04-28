import { Sparkles } from "lucide-react";

export function CopilotFAB({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 text-ink-invert shadow-elev-3 hover:scale-105 transition-transform grid place-items-center"
      aria-label="Ask Copilot"
    >
      <span className="absolute inset-0 rounded-full bg-accent-500/30 animate-ping-soft" />
      <Sparkles className="relative h-5 w-5" strokeWidth={2} />
    </button>
  );
}
