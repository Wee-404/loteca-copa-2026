const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const url = new URL(req.url);
  const apiKey = process.env.ODDS_API_KEY || url.searchParams.get('key') || '';

  const oddsUrl = `https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds?regions=eu,uk&markets=h2h&oddsFormat=decimal&bookmakers=bet365,pinnacle,betfair_ex_eu&apiKey=${apiKey}`;

  try {
    const r = await fetch(oddsUrl);
    const body = await r.text();
    return new Response(body, {
      status: r.status,
      headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=120' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
};

export const config = { path: '/api/odds' };
