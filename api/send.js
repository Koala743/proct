module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email required" });

  const CF = "https://anonimogmail.armijosfeo.workers.dev";

  // Ya verificado?
  const verR = await fetch(`${CF}/check-verified?email=${encodeURIComponent(email)}`);
  const verD = await verR.json();
  if (verD.verified) {
    return res.status(200).json({ success: true, already: true });
  }

  // Rate limit?
  const rlR = await fetch(`${CF}/check-rl?email=${encodeURIComponent(email)}`);
  const rlD = await rlR.json();
  if (rlD.blocked) {
    return res.status(429).json({ error: "Espera 2 minutos antes de reenviar" });
  }

  // Reusar código existente o generar nuevo
  let code = rlD.code;
  if (!code) {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Guardar en Cloudflare
  await fetch(`${CF}/save-code?email=${encodeURIComponent(email)}&code=${code}`);

  // Enviar email
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