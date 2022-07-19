const db = require("quick.db");
const config = require("../../config.json");
module.exports = {
    path: "/login",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;
        if (!db.get(`ip_${ip}`)) {
            return res.sendFile(`login.html`, { root: "./views/web" });
        } else {
            const html = "<script>window.location = `" + config.domain + "/fichier`</script>";
            return res.send(html), res.end();
        }
    }
}