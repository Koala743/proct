const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
global.codes = global.codes || {};

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  global.codes[email] = code;

  await resend.emails.send({
    from: "DBU Rage <onboarding@resend.dev>",
    to: email,
    subject: "Verification Code",
    html: `<h1>Tu código</h1><h2>${code}</h2>`
  });

  res.status(200).json({ success: true });
};