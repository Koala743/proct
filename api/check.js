global.purchasedEmails = global.purchasedEmails || {};

module.exports = async function handler(req, res) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required" });

  const found = !!global.purchasedEmails[email];
  res.status(200).json({ purchased: found });
};