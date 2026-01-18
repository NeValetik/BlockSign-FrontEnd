import { NextRequest, NextResponse } from 'next/server';

// Allowed origins for the proxy - only allow fetching from the API server
const ALLOWED_ORIGINS = [
  process.env.API_URL,
  process.env.NEXT_PUBLIC_API_URL,
].filter(Boolean).map(url => {
  try {
    return new URL(url as string).origin;
  } catch {
    return null;
  }
}).filter(Boolean) as string[];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Validate that the URL is from an allowed origin (SSRF protection)
  try {
    const parsedUrl = new URL(url);
    const isAllowedOrigin = ALLOWED_ORIGINS.length === 0 || 
      ALLOWED_ORIGINS.some(origin => parsedUrl.origin === origin);
    
    if (!isAllowedOrigin) {
      console.warn(`Blocked proxy request to unauthorized origin: ${parsedUrl.origin}`);
      return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
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
        // Security headers for the response
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching blob:', error);
    return NextResponse.json({ error: 'Failed to fetch blob' }, { status: 500 });
  }
}

