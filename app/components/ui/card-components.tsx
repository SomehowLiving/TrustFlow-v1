"use client";

import { ReactNode } from "react";

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export function FormCard({ children, className = "" }: FormCardProps) {
  return (
    <div className={`p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

interface StepContainerProps {
  children: ReactNode;
}

export function StepContainer({ children }: StepContainerProps) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  );
}

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  step?: number;
  totalSteps?: number;
}

export function PageHeader({
  icon,
  title,
  subtitle,
  step,
  totalSteps,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 border border-accent/20">
        <div className="text-accent">{icon}</div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {step && totalSteps ? `Step ${step} of ${totalSteps} — ` : ""}{subtitle}
        </p>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="flex gap-1 pt-6">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        return (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full transition-colors ${
              step <= currentStep
                ? "bg-accent"
                : "bg-border"
            }`}
          />
        );
      })}
    </div>
  );
}
