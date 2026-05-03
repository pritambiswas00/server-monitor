import { NextResponse } from 'next/server';
import { errorState } from '@/lib/error-state';

export async function POST() {
  errorState.forceErrors = true;
  return NextResponse.json({ forceErrors: true, message: 'Error generation started' });
}
