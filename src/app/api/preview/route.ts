import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  // For static export, we can't use dynamic request data
  // Return a static response instead
  return NextResponse.json(
    {
      message:
        'Preview API - use in development mode for dynamic functionality',
      note: 'This is a static export version',
    },
    { status: 200 }
  );
}
