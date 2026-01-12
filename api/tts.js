export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 👇 防止 body 是 undefined
    const body = req.body || {};
    const text = body.text;
    const voice = body.voice || 'default';

    if (!text) {
      return res.status(400).json({
        error: 'Missing text',
        debug: { body }
      });
    }

    return res.status(200).json({
      ok: true,
      received: {
        text,
        voice
      }
    });
  } catch (err) {
    // 👇 关键：把真实错误返回
    return res.status(500).json({
      error: 'Server error',
      message: err.message,
      stack: err.stack
    });
  }
}
