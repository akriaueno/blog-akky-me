const HNY_TRACES_ENDPOINT = 'https://api.honeycomb.io/v1/traces';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://blog.akky.me',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
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
