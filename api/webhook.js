const crypto = require("crypto");

global.purchasedEmails = global.purchasedEmails || {};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verificar firma
  const secret = process.env.LEMON_SECRET;
  const signature = req.headers["x-signature"];

  if (secret && signature) {
    const body = JSON.stringify(req.body);
    const hash = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return res.status(401).json({ error: "Invalid signature" });
    }
  }

  const eventName = req.body?.meta?.event_name;
  const email =
    req.body?.data?.attributes?.user_email ||
    req.body?.data?.attributes?.customer_email;

  if (!email) {
    return res.status(200).json({ received: true });
  }

  const allowedEvents = [
    "order_created",
    "subscription_created",
    "subscription_payment_success",
  ];

  if (allowedEvents.includes(eventName)) {
    global.purchasedEmails[email] = {
      event: eventName,
      date: new Date().toISOString(),
    };
    console.log(`[webhook] ${eventName} → ${email}`);
  }

  res.status(200).json({ received: true });
};
