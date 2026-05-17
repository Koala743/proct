const crypto = require("crypto");

global.purchasedEmails = global.purchasedEmails || {};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = process.env.LEMON_SECRET;
  const signature = req.headers["x-signature"];

  if (secret && signature) {
    const hash = crypto.createHmac("sha256", secret).update(JSON.stringify(req.body)).digest("hex");
    if (hash !== signature) return res.status(401).json({ error: "Invalid signature" });
  }

  const eventName = req.body?.meta?.event_name;
  const email = req.body?.data?.attributes?.user_email || req.body?.data?.attributes?.customer_email;

  if (email && ["order_created","subscription_created","subscription_payment_success"].includes(eventName)) {
    global.purchasedEmails[email] = { event: eventName, date: new Date().toISOString() };
  }

  res.status(200).json({ received: true });
};