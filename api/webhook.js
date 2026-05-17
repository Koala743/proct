const crypto = require("crypto");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
    const chunks = [];

    for await (const chunk of req) {
        chunks.push(chunk);
    }

    const rawBody = Buffer.concat(chunks).toString("utf8");

    const signature = req.headers["x-signature"];

    const digest = crypto
        .createHmac("sha256", process.env.LEMON_SECRET)
        .update(rawBody)
        .digest("hex");

    if (digest !== signature) {
        return res.status(403).send("Invalid signature");
    }

    const body = JSON.parse(rawBody);

    if (body.meta.event_name === "order_created") {

        const email = body.data.attributes.user_email;

        const key = crypto.randomBytes(16).toString("hex");

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Your DBU Rage Key",
            html: `
                <h1>Thanks for buying</h1>
                <p>Your Key:</p>
                <b>${key}</b>
            `
        });

        console.log("Key sent:", email);
    }

    res.status(200).send("OK");
}