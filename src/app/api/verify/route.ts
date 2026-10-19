import { NextRequest, NextResponse } from 'next/server';
import { runVerificationPipeline } from '@/lib/pipeline';
import { ExtractionError } from '@/lib/extractor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, url, sourceType, title, customApiKey, userId } = body;

    if (!text && !url) {
      return NextResponse.json(
        { success: false, error: 'Please enter text, article content, or a web URL to verify.' },
        { status: 400 }
      );
    }

    const report = await runVerificationPipeline(
      {
        text,
        url,
        sourceType: sourceType || (url ? 'url' : 'text'),
        title,
      },
      userId || 'user-demo-analyst',
      customApiKey
    );

    return NextResponse.json({ success: true, report });
  } catch (err: unknown) {
    console.error('Verification API error:', err);

    if (err instanceof ExtractionError) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
          isUrlInaccessible: true,
        },
        { status: 422 }
      );
    }

    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during verification.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
