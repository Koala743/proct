module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { email, code } = req.query;
  const CF = "https://anonimogmail.armijosfeo.workers.dev";

  const r = await fetch(`${CF}/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
  const data = await r.json();

  if (data.success) return res.status(200).json({ success: true });
  res.status(400).json({ success: false });
};