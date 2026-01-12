export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, voice } = req.body || {};

  if (!text) {
    return res.status(400).json({ error: 'Missing text' });
  }

  return res.status(200).json({
    ok: true,
    received: {
      text,
      voice: voice || 'default'
    }
  }
