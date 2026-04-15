import { NextResponse } from 'next/server';

const emptySessionResponse = () =>
  NextResponse.json({ success: true, data: null, message: 'No active session' }, { status: 200 });

export async function GET() {
  return emptySessionResponse();
}
