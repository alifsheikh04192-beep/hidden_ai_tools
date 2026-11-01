'use client';

import { useState } from 'react';
import {
  ChevronDown,
  Copy,
  ExternalLink,
  Lock,
  ListChecks,
  Sliders,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAccess } from '@/lib/access-context';
import { useToast } from '@/hooks/use-toast';
import { WHOP_CHECKOUT_URL } from '@/lib/constants';
import type { AITool } from '@/lib/tools';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: AITool;
  isNew?: boolean;
}

export function ToolCard({ tool, isNew }: ToolCardProps) {
  const { hasLifetimeAccess } = useAccess();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);

  const isLocked = !tool.free && !hasLifetimeAccess;

  const copyPrompt = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: 'Prompt copied to clipboard!',
        description: 'Paste it into the tool and tweak the parameters.',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Your browser blocked clipboard access.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl border border-border/50 bg-card/60 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_-4px_hsl(263_70%_60%/0.25)]',
        isNew && 'animate-fade-in-up border-amber-500/40'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted/60 text-2xl">
            {tool.emoji}
          </span>
          <div>
            <h3 className="font-display text-base font-semibold leading-tight">
              {tool.name}
            </h3>
            <p className="text-xs text-muted-foreground">{tool.category}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {tool.free ? (
            <Badge className="border-amber-400/30 bg-amber-400/15 text-amber-300">
              <span className="mr-1">🌟</span> Free Showcase
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Premium
            </Badge>
          )}
          {isNew ? (
            <Badge className="animate-new-badge border-orange-500/40 bg-orange-500/20 text-orange-300">
              🔥 NEW
            </Badge>
          ) : null}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{tool.tagline}</p>

      {isLocked ? (
        // Locked premium card: title, description and unlock CTA only.
        // Secrets (prompts, workflow, parameters, negative seed, tool URL)
        // are never rendered into the page for non-paying visitors.
        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-5 text-center">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Lock className="h-4 w-4 text-primary" />
            🔒 Locked Premium Secret
          </div>
          <p className="max-w-xs text-xs text-muted-foreground">
            Prompts, workflow, parameters, negative seed &amp; the direct tool
            link are included with Lifetime Access.
          </p>
          <a
            href={WHOP_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 glow-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Zap className="mr-1.5 h-4 w-4" />
            Unlock Lifetime Access for $20
          </a>
        </div>
      ) : (
        <>
          {/* Prompt presets */}
          <div className="mt-4 space-y-3">
            {tool.promptPresets.map((preset) => (
              <div
                key={preset.label}
                className="rounded-lg border border-border/50 bg-muted/30 p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground/80">
                    {preset.label}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-primary hover:bg-primary/10"
                    onClick={() => copyPrompt(preset.value)}
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Copy Prompt
                  </Button>
                </div>
                <p className="font-mono text-xs leading-relaxed text-foreground/70">
                  {preset.value}
                </p>
              </div>
            ))}
          </div>

          {/* Expandable drawer for workflow + parameters + negative seed */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-4 flex items-center justify-between text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5" />
              Workflow, parameters &amp; negative seed
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                expanded && 'rotate-180'
              )}
            />
          </button>

          {expanded && (
            <div className="mt-3 space-y-4 animate-fade-in-up">
              {/* Workflow steps */}
              <div className="space-y-2">
                {tool.workflow.map((step, i) => (
                  <div
                    key={step.title}
                    className="flex gap-3 rounded-lg border border-border/40 bg-muted/20 p-2.5"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Parameters */}
              {tool.parameters && tool.parameters.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Sliders className="h-3.5 w-3.5" />
                    Parameters
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tool.parameters.map((p) => (
                      <Badge
                        key={p.label}
                        variant="outline"
                        className="border-border/50 bg-muted/30 font-mono text-xs"
                      >
                        {p.label}: {p.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Negative seed */}
              {tool.negativeSeed && (
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                    Negative Seed
                  </p>
                  <p className="rounded-lg border border-border/40 bg-muted/30 p-3 font-mono text-xs text-foreground/70">
                    {tool.negativeSeed}
                  </p>
                </div>
              )}
            </div>
          )}

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Open {tool.name}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </>
      )}
    </div>
  );
}
