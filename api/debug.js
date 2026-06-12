export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  const result = {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlStart: supabaseUrl ? supabaseUrl.substring(0, 30) : 'missing',
    keyStart: supabaseKey ? supabaseKey.substring(0, 20) : 'missing',
  };

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/examples?select=id&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    result.status = response.status;
    result.body = await response.text();
  } catch(e) {
    result.error = e.message;
  }

  return res.status(200).json(result);
}
