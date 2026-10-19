import { NextRequest, NextResponse } from 'next/server';
import { getStats } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const stats = await getStats(userId);
    return NextResponse.json({ success: true, stats });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve stats.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
