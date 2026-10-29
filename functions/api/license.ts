export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  // GET: Validate Code Format & Timestamp
  if (request.method === 'GET') {
    const code = url.searchParams.get('code')?.trim().toUpperCase();
    if (!code) {
      return new Response(JSON.stringify({ error: 'Code parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const pattern = /^SAKURA-(30D|14D|7D|60D|999D|LIFE)-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const isValidFormat = pattern.test(code);

    return new Response(JSON.stringify({
      code,
      validFormat: isValidFormat,
      plan: code.includes('LIFE') ? 'Lifetime VIP' : code.includes('30D') ? '30 Days VIP' : code.includes('14D') ? '14 Days Rush' : 'Custom VIP',
      serverTime: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  // POST: Verify / Issue
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { code, studentName, deviceId } = body;

      if (!code) {
        return new Response(JSON.stringify({ error: 'Code is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        code,
        studentName: studentName || 'Student',
        deviceId: deviceId || 'unknown',
        serverTimestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
