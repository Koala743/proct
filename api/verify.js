global.codes = global.codes || {};

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { email, code } = req.query;
  if (global.codes[email] === code) return res.status(200).json({ success: true });

  res.status(400).json({ success: false });
};