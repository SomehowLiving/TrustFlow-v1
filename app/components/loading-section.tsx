import { Loader2Icon } from "lucide-react";

export function LoadingSection() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2Icon className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </main>
  );
}
