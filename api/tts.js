export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text, voice } = req.body || {};

    if (!text) {
      return res.status(400).json({ error: 'Missing text' });
    }

    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing DASHSCOPE_API_KEY' });
    }

    const dashscopeResp = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/speech/synthesis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          Accept: 'audio/wav'
        },
        body: JSON.stringify({
          model: 'qwen-tts-v1',
          input: { text },
          parameters: {
            voice: mapVoice(voice),
            format: 'wav',
            rate: 0.9,
            pitch: 1.0,
            volume: 1.0
          }
        })
      }
    );

    if (!dashscopeResp.ok) {
      const errText = await dashscopeResp.text();
      return res.status(500).json({
        error: 'DashScope TTS failed',
        detail: errText
      });
    }

    const audioBuffer = await dashscopeResp.arrayBuffer();

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="speech.wav"'
    );

    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    return res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
}

function mapVoice(voice) {
  const voices = {
    adult_female: 'xiaoyun',
    child: 'xiaoxiao'
  };
  return voices[voice] || 'xiaoyun';
}
