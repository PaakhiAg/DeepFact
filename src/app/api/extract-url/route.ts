import { NextRequest, NextResponse } from 'next/server';
import { extractArticleFromUrl, ExtractionError, isValidUrl } from '@/lib/extractor';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid http or https article URL.' },
        { status: 400 }
      );
    }

    const data = await extractArticleFromUrl(url);
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
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

    const message = err instanceof Error ? err.message : 'Failed to extract article content.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
