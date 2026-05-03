import { NextResponse } from 'next/server';
import { errorState } from '@/lib/error-state';

export async function POST() {
  errorState.forceErrors = false;
  return NextResponse.json({ forceErrors: false, message: 'Error generation stopped' });
}
