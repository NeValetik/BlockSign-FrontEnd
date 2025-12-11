import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Fetch the blob from the provided URL
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch blob' }, { status: response.status });
    }

    const blob = await response.blob();
    
    // Return the blob with appropriate headers
    return new NextResponse(blob, {
      headers: {
        'Content-Type': blob.type || 'application/octet-stream',
        'Content-Disposition': `inline; filename="document"`,
      },
    });
  } catch (error) {
    console.error('Error fetching blob:', error);
    return NextResponse.json({ error: 'Failed to fetch blob' }, { status: 500 });
  }
}

