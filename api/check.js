global.purchasedEmails = global.purchasedEmails || {};

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required" });

  res.status(200).json({ purchased: !!global.purchasedEmails[email] });
};