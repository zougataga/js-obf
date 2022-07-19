const db = require("quick.db");
const config = require("../../config.json");
module.exports = {
    path: "/register",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;
        if (!db.get(`ip_${ip}`)) {
            return res.sendFile(`register.html`, { root: "./views/web" });
        } else {
            const html = "<script>window.location = `" + config.domain + "/login`</script>";
            return res.send(html), res.end();
        }
    }
}