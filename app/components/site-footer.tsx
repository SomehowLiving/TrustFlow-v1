import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background/50">
      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            TrustFlow — Guard-railed AI payments with programmable money
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
