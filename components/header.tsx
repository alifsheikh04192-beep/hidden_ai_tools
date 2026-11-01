'use client';

import { useState } from 'react';
import { KeyRound, Zap, ShieldCheck, Flame, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAccess } from '@/lib/access-context';
import { WHOP_CHECKOUT_URL } from '@/lib/constants';

export function Header() {
  const { hasLifetimeAccess } = useAccess();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 glow-ring transition-transform group-hover:scale-105">
            <KeyRound className="h-5 w-5 text-primary" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Hidden<span className="text-primary text-glow"> AI </span>Tools
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          {hasLifetimeAccess ? (
            <Badge
              variant="secondary"
              className="border-primary/30 bg-primary/10 text-primary"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              Lifetime Access
            </Badge>
          ) : (
            <a
              href={WHOP_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 glow-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Zap className="mr-1.5 h-4 w-4" />
              Unlock $20
              <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-70" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

export function LiveSyncBar() {
  return (
    <div className="border-b border-border/40 bg-muted/30">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">Live Tracker:</span>{' '}
          40,000+ Hidden AI Tools Indexed
          <span className="mx-1.5 text-border">|</span>
          <Flame className="mr-1 inline h-3.5 w-3.5 text-amber-400" />
          Daily Auto-Update Engine Active
        </span>
      </div>
    </div>
  );
}
