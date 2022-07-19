const db = require("quick.db");
const fs = require("fs");
const config = require("../../config.json");
module.exports = {
    path: "/delete/:user/:id",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;
        if (db.get(`ip_${ip}`)) {
            const user = req.params.user;
            const n = req.params.id.split(".")[0];
            const e = req.params.id.split(".")[1];
            const a = `${n}.${e}`;
            const p = `./drive/${user}/${a}`;
            const file = fs.existsSync(p);
            if (!file) return res.status(404).json({ error: { err: "Fichier introuvable !" } });
            fs.unlink(p, function (err) {
                if (err) {
                    console.log(err);
                    return res.status(404).json({ error: { err: err.message } });
                } else {
                    const html = "<script>alert(`Le fichier " + a + " a été supprimer !`);window.location = `" + config.domain + "`</script>";
                    return res.send(html);
                }
            });
        } else {
            const html = "<script>window.location = `" + config.domain + "/login`</script>";
            return res.send(html), res.end();
        }
    }
}