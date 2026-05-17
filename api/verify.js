global.codes = global.codes || {};

module.exports = async function handler(req, res) {

    const email = req.query.email;
    const code = req.query.code;

    if (global.codes[email] === code) {
        return res.status(200).json({
            success: true
        });
    }

    res.status(400).json({
        success: false
    });
}