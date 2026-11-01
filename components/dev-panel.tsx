'use client';

import { useState } from 'react';
import { Terminal, Unlock, Lock, KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAccess } from '@/lib/access-context';
import { useToast } from '@/hooks/use-toast';

export function DevPanel() {
  const { hasLifetimeAccess, devUnlockWithPasscode, devUnlockAll, devLock } =
    useAccess();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);

  const tryPasscode = async () => {
    setChecking(true);
    await new Promise((r) => setTimeout(r, 500));
    const ok = devUnlockWithPasscode(code);
    setChecking(false);
    if (ok) {
      toast({
        title: 'Dev Mode: Unlocked',
        description: 'Passcode accepted. All blur paywalls removed.',
      });
      setCode('');
      setOpen(false);
    } else {
      toast({
        title: 'Invalid passcode',
        description: 'That passcode did not match.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow-lg backdrop-blur-md transition-all hover:border-primary/50 hover:text-primary"
          aria-label="Dev Mode"
          title="Dev Mode: Unlock All"
        >
          <Terminal className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="border-border/60 bg-card/95 backdrop-blur-xl sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-center font-display text-lg">
            Dev Mode Controls
          </DialogTitle>
          <DialogDescription className="text-center">
            Test the permanent unlocked state instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <KeyRound className="h-3.5 w-3.5" />
              Enter passcode
            </label>
            <div className="flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. HIDDEN2026"
                onKeyDown={(e) => e.key === 'Enter' && tryPasscode()}
                className="font-mono"
              />
              <Button
                onClick={tryPasscode}
                disabled={checking || !code}
                size="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {checking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Unlock'
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <Button
            onClick={() => {
              devUnlockAll();
              toast({
                title: 'Dev Mode: Unlock All',
                description: 'All tools are now visible.',
              });
            }}
            variant="outline"
            className="w-full border-primary/40 text-primary hover:bg-primary/10"
          >
            <Unlock className="mr-2 h-4 w-4" />
            Dev Mode: Unlock All
          </Button>

          {hasLifetimeAccess && (
            <Button
              onClick={() => {
                devLock();
                toast({ title: 'Dev Mode: Locked', description: 'Paywall restored.' });
              }}
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              <Lock className="mr-2 h-4 w-4" />
              Re-lock (restore paywall)
            </Button>
          )}

          <div className="flex items-center justify-center">
            <Badge
              variant="outline"
              className={
                hasLifetimeAccess
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border bg-muted text-muted-foreground'
              }
            >
              {hasLifetimeAccess ? 'Unlocked' : 'Locked'}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
