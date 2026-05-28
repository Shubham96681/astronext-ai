import { NextResponse } from 'next/server';

const UPSTREAM = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await fetch(`${UPSTREAM}/api/v1/astrologers/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Not found' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch astrologer' }, { status: 502 });
  }
}
