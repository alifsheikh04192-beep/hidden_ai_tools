import { NextResponse } from 'next/server';
import { SYNC_POOL } from '@/lib/tools';

export const dynamic = 'force-dynamic';

// Mock background worker: simulates fetching freshly launched tools from
// Product Hunt and AI RSS feeds. Returns a random subset of the sync pool,
// each tagged with a fetch timestamp so the UI can show the NEW badge.
export async function GET() {
  const shuffled = [...SYNC_POOL].sort(() => Math.random() - 0.5);
  const count = Math.min(2 + Math.floor(Math.random() * 2), shuffled.length);
  const fetchedAt = new Date().toISOString();
  const tools = shuffled.slice(0, count).map((t) => ({
    ...t,
    fetchedAt,
    isNew: true,
  }));

  return NextResponse.json({
    ok: true,
    source: 'Product Hunt + AI RSS (mock)',
    fetchedAt,
    count: tools.length,
    tools,
  });
}
