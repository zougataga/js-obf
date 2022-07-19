const db = require("quick.db");
const config = require("../../config.json");
module.exports = {
    path: "/fichier",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;;
        if (db.get(`ip_${ip}`)) {
            const mail = await db.get(`ip_${ip}`);
            return res.render(`panel/panel.ejs`, {
                u: mail.split("@")[0],
                j: "Abonnement Free",
                p: "https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
            })
        } else {
            const html = "<script>window.location = `" + config.domain + "/login`</script>";
            return res.send(html), res.end();
        }
    }
}