'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, Zap, Sparkles, TrendingUp, ChevronDown, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header, LiveSyncBar } from '@/components/header';
import { ToolCard } from '@/components/tool-card';
import { DevPanel } from '@/components/dev-panel';
import { useAccess } from '@/lib/access-context';
import { useToast } from '@/hooks/use-toast';
import { WHOP_CHECKOUT_URL } from '@/lib/constants';
import {
  INITIAL_TOOLS,
  CATEGORY_PILLS,
  PAGE_SIZE,
  type AITool,
  type ToolCategory,
} from '@/lib/tools';
import { cn } from '@/lib/utils';

type SyncedTool = AITool & { _isNew?: boolean };

export default function Home() {
  const { hasLifetimeAccess } = useAccess();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ToolCategory | 'All'>('All');
  const [tools, setTools] = useState<SyncedTool[]>(INITIAL_TOOLS as SyncedTool[]);
  const [syncing, setSyncing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesCategory = category === 'All' || t.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.promptPresets.some((p) => p.value.toLowerCase().includes(q))
      );
    });
  }, [tools, query, category]);

  // Reset pagination whenever the filter changes so users start from the top.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, category]);

  const freeTools = filtered.filter((t) => t.free);
  const premiumTools = filtered.filter((t) => !t.free);
  const visiblePremium = premiumTools.slice(0, visibleCount);
  const hasMore = premiumTools.length > visibleCount;

  const syncLatest = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/sync-tools');
      if (!res.ok) throw new Error('sync failed');
      const data = await res.json();
      const incoming: AITool[] = (data.tools ?? []).map(
        (t: AITool & { isNew?: boolean; fetchedAt?: string }) => {
          const { isNew, fetchedAt, ...rest } = t;
          return rest;
        }
      );
      setTools((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const fresh = incoming.filter((t) => !existingIds.has(t.id));
        const withNewFlag: SyncedTool[] = fresh.map((t) => ({ ...t, _isNew: true }));
        return [
          ...withNewFlag,
          ...prev.map((t) => ({ ...t, _isNew: false })),
        ];
      });
      toast({
        title: 'Sync complete',
        description: `${incoming.length} freshly launched tools added.`,
      });
    } catch {
      toast({
        title: 'Sync failed',
        description: 'Could not reach the sync engine. Try again.',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  }, [toast]);

  return (
    <div id="top" className="min-h-screen bg-background">
      <LiveSyncBar />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
        <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <Badge className="mx-auto mb-5 border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            40,000+ tools indexed & growing daily
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Hidden AI Tools —{' '}
            <span className="text-primary text-glow">Best Secret AI Software</span>{' '}
            & Directory
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Explore the ultimate collection of hidden AI tools and secret
            productivity platforms curated for creators and developers.
          </p>

          {/* Search + sync */}
          <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 sm:flex-row">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 130+ tools, prompts, workflows…"
                className="h-11 rounded-full border-border/60 bg-card/60 pl-10 pr-4 backdrop-blur-md"
              />
            </div>
            <Button
              onClick={syncLatest}
              disabled={syncing}
              variant="outline"
              className="h-11 shrink-0 rounded-full border-primary/40 text-primary hover:bg-primary/10"
            >
              <RefreshCw className={cn('mr-2 h-4 w-4', syncing && 'animate-spin')} />
              {syncing ? 'Syncing…' : 'Sync Latest Tools'}
            </Button>
          </div>

          {/* Category pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {CATEGORY_PILLS.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setCategory(pill.value)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                  category === pill.value
                    ? 'border-primary/50 bg-primary/15 text-primary glow-ring'
                    : 'border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                )}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* Results counter */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">
              {freeTools.length + Math.min(visibleCount, premiumTools.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-foreground">{filtered.length}</span>{' '}
            tools
          </p>
        </div>

        {/* Free showcase — always shows all free tools */}
        {freeTools.length > 0 && (
          <div className="mb-12">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-400" />
              <h2 className="font-display text-xl font-semibold">
                Free Showcase — Video &amp; Photo
              </h2>
              <Badge className="border-amber-400/30 bg-amber-400/15 text-amber-300">
                🌟 100% unlocked
              </Badge>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {freeTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} isNew={tool._isNew} />
              ))}
            </div>
          </div>
        )}

        {/* Premium vault — paginated with Load More */}
        {premiumTools.length > 0 && (
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Premium Vault — Cartoon, 3D, Audio, Automation, Coding, Text &amp; Design
              </h2>
              {!hasLifetimeAccess && (
                <a
                  href={WHOP_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 glow-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Zap className="mr-1.5 h-4 w-4" />
                  Unlock for $20
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-70" />
                </a>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePremium.map((tool) => (
                <ToolCard key={tool.id} tool={tool} isNew={tool._isNew} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <Button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-primary/40 text-primary hover:bg-primary/10"
                >
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Load More Tools
                </Button>
                <p className="text-xs text-muted-foreground">
                  {premiumTools.length - visibleCount} more tools to explore
                </p>
              </div>
            )}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              No tools match &ldquo;{query}&rdquo;. Try another search or sync the
              latest tools.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p>
            Hidden AI Tools · hiddenaitools.com — The secret vault of
            undiscovered AI tools &amp; workflows.
          </p>
          <p className="mt-1">
            One-time $20 Lifetime Pass · Daily auto-update engine · 40,000+
            tools indexed.
          </p>
        </div>
      </footer>

      <DevPanel />
    </div>
  );
}
