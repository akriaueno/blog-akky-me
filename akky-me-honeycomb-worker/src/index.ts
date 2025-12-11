const HNY_TRACES_ENDPOINT = 'https://api.honeycomb.io/v1/traces';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://blog.akky.me',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  // Allow credentials because the browser fetch defaults to `credentials: "include"`.
  'Access-Control-Allow-Credentials': 'true',
  // Allow common OTLP headers; fall back to request's list in preflight handler below.
  'Access-Control-Allow-Headers': 'content-type, authorization, x-honeycomb-team',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      // Echo requested headers for stricter browsers when present
      const requestedHeaders = request.headers.get('access-control-request-headers');
      const headers = new Headers(corsHeaders);
      if (requestedHeaders) {
        headers.set('Access-Control-Allow-Headers', requestedHeaders);
      }
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    const apiKey = env.HONEYCOMB_API_KEY;

    const headers = new Headers(request.headers);

    headers.delete('authorization');

    headers.set('x-honeycomb-team', apiKey);

    const upstreamResp = await fetch(HNY_TRACES_ENDPOINT, {
      method: 'POST',
      headers,
      body: request.body,
    });

    const respHeaders = new Headers(upstreamResp.headers);
    Object.entries(corsHeaders).forEach(([k, v]) => respHeaders.set(k, v as string));

    return new Response(upstreamResp.body, {
      status: upstreamResp.status,
      statusText: upstreamResp.statusText,
      headers: respHeaders,
    });
  },
};

export interface Env {
  HONEYCOMB_API_KEY: string;
}
