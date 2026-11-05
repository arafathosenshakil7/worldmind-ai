// Vercel Serverless - Key is in Vercel Env, NOT in code
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server key missing' });

  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: "You are WorldMind AI. Understand Bangla and English. Reply in same language user uses. If user mixes, reply in same mixed style." }] }
    })
  });
  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "দুঃখিত, উত্তর পাওয়া যায়নি।";
  return res.status(200).json({ reply });
    }
