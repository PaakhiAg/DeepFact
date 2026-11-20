import { NextRequest, NextResponse } from 'next/server';
import { getReports } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const query = searchParams.get('q') || undefined;
    const verdict = searchParams.get('verdict') || undefined;

    const reports = await getReports(userId, query, verdict);
    return NextResponse.json({ success: true, reports });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch reports.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
