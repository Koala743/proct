module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Guardar en Redis con expiración de 10 minutos
  await fetch(`${process.env.KV_REST_API_URL}/set/code:${email}/${code}/ex/600`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
  });

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender: { name: "DBU Rage", email: "armijofeo28@gmail.com" },
      to: [{ email }],
      subject: "Verification Code",
      htmlContent: `<h1>Tu código</h1><h2>${code}</h2>`
    })
  });

  res.status(200).json({ success: true });
};