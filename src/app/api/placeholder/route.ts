// This is a placeholder file to ensure the /api directory is correctly handled by Azure Static Web Apps.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'This is a placeholder.' });
}
