import { NextResponse } from 'next/server';

const UPSTREAM = process.env.ASTRONEXT_API_URL ?? 'https://api-stage.astronext.ai';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams({
    page: searchParams.get('page') ?? '1',
    size: searchParams.get('size') ?? '20',
    status: 'approved',
    verified: 'true',
  });

  try {
    const res = await fetch(`${UPSTREAM}/api/v1/astrologers?${params}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch astrologers' }, { status: 502 });
  }
}
