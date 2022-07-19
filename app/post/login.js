const db = require("quick.db");
const config = require("../../config.json");
module.exports = {
    path: "/login",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;
        const obj = req.body;
        if (!db.get(`user_${obj.mail}`)) {
            var html = "<script>alert(`Aucun compte avec cette email n'a été trouver !`);window.location = `" + config.domain + "/login`</script>"
            return res.send(html);
        } else {
            const mdp = await db.get(`user_${obj.mail}`);
            if (mdp === obj.mdp) {
                await db.set(`ip_${ip}`, obj.mail);
                var html = "<script>window.location = `" + config.domain + "/`</script>";
                return res.send(html);
            } else {
                var html = "<script>alert(`Mot de passe non valide !`);window.location = `" + config.domain + "/login`</script>";
                return res.send(html);
            }

        }
    }
}