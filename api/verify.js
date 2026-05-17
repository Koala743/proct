module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { email, code } = req.query;

  const r = await fetch(`${process.env.KV_REST_API_URL}/get/code:${email}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
  });
  const data = await r.json();

  if (data.result === code) {
    return res.status(200).json({ success: true });
  }

  res.status(400).json({ success: false });
};