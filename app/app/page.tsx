import { Button } from "@/components/ui/button";
import { ShieldCheckIcon, LockIcon, GlobeIcon, CoinsIcon } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-32">
        <div className="max-w-3xl space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">Cryptographically Enforced</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Autonomous Payments.
              <br />
              <span className="text-accent">Guaranteed Safe.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Guard-railed AI agents that execute payments only within predefined trust boundaries. Programmable money that keeps you in control.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <Link href="/agents/new">
              <Button size="lg" className="px-8 h-12 text-base">
                Create Your First Agent
              </Button>
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <FeatureCard
              icon={<LockIcon className="w-5 h-5" />}
              title="Policy-Constrained"
              description="Spending limits and approved recipients enforced on-chain. No exceptions."
            />
            <FeatureCard
              icon={<CoinsIcon className="w-5 h-5" />}
              title="Multi-Stablecoin"
              description="MNEE, USDT, USDC. Use what makes sense for each transaction."
            />
            <FeatureCard
              icon={<GlobeIcon className="w-5 h-5" />}
              title="Multi-Chain"
              description="Deploy across Ethereum, Base, and other networks. Seamlessly."
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-5 h-5" />}
              title="Built for Trust"
              description="No arbitrary transfers. No prompt injection. Only whitelisted recipients."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-accent">{icon}</div>
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
