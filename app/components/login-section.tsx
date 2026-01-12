"use client";

import { usePrivy } from "@privy-io/react-auth";
import { LogInIcon } from "lucide-react";
import { Button } from "./ui/button";

export function LoginSection() {
  const { login } = usePrivy();

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 border border-accent/20">
            <LogInIcon className="w-6 h-6 text-accent" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-sm text-muted-foreground">Sign in to create and manage your AI agents</p>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={() => login()}
          className="w-full h-10"
        >
          <LogInIcon className="w-4 h-4 mr-2" />
          Sign In with Google
        </Button>

        {/* Info */}
        <div className="p-4 rounded-lg bg-card/50 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            We use secure authentication to protect your agent and payment data. Your privacy is our priority.
          </p>
        </div>
      </div>
    </main>
  );
}
