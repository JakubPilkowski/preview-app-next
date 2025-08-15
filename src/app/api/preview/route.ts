import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🚀 ~ GET ~ request:', request);
  const { searchParams } = new URL(request.url);
  console.log('🚀 ~ GET ~ searchParams:', searchParams);
  const sessionId = searchParams.get('sessionId');
  console.log('🚀 ~ GET ~ sessionId:', sessionId);

  if (!sessionId) {
    return NextResponse.json(
      { error: 'sessionId parameter is required' },
      { status: 400 }
    );
  }

  const draft = await draftMode();
  draft.enable();

  redirect(`/preview/${sessionId}`);
}
