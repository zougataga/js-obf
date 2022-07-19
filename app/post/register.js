const db = require("quick.db");
const fs = require("fs");
const config = require("../../config.json");
module.exports = {
    path: "/register",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;
        const obj = req.body;
        const user = obj.mail.split("@")[0];
        const p = `./drive/${user}`;
        await db.delete(`ip_${ip}`);
        if (obj.mdp !== obj.mdp2) {
            const html = "<script>alert(`Les mots de passe ne correspondent pas !`);window.location = `" + config.domain + "/register`</script>";
            return res.send(html);
        }
        if (obj.txt !== obj.cptch) {
            const html = "<script>alert(`Captcha invalide !`);window.location = `" + config.domain + "/register`</script>";
            return res.send(html);
        }
        if (db.get(`user_${obj.mail}`)) {
            const html = "<script>alert(`Un compte avec cette email existe déjà !`);window.location = `" + config.domain + "/login`</script>";
            return res.send(html);
        } else {
            if (!fs.existsSync(p)) fs.mkdir(p, () => { });
            await db.set(`user_${obj.mail}`, obj.mdp);
            await db.set(`ip_${ip}`, obj.mail);
            var html = "<script>alert(`Votre compte a bien été créer !`);window.location = `" + config.domain + "/login`</script>";
            return res.send(html);
        }
    }
}