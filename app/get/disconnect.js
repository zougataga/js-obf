const db = require("quick.db");
const fs = require("fs");
const config = require("../../config.json");
module.exports = {
    path: "/disconnect",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;
        if (db.get(`ip_${ip}`)) {
            await db.set(`ip_${ip}`, null)
            const html = "<script>window.location = `" + config.domain + "/login`</script>";
            return res.send(html);
        } else {
            const html = "<script>window.location = `" + config.domain + "/login`</script>";
            return res.send(html), res.end();
        }
    }
}