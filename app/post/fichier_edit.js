const db = require("quick.db");
const fs = require("fs");
const config = require("../../config.json");
const img = require("../../assets/function/img.js");
const base64 = require("../../assets/function/base64.js");
const sz = require("../../assets/function/size.js");
module.exports = {
    path: "/fichier/:user/:id",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;
        if (db.get(`ip_${ip}`)) {
            const mail = await db.get(`ip_${ip}`);
            const user = req.params.user;
            const n = req.params.id.split(".")[0];
            const e = req.params.id.split(".")[1];
            const a = `${n}.${e}`;
            const p = `./drive/${user}/${a}`;
            const content = req.body.content;
            const file = fs.existsSync(p);
            if (!file) return res.status(404).json({ error: { err: "Fichier introuvable !" } });
            var v = img(e)
            if (v === "fa fa-file-code-o" || v === "fa fa-file-text-o" || v === "fa fa-file-o") {
                fs.writeFile(p, content, "utf8", function (er, ee) {
                    if (er) {
                        console.log(er);
                        return res.status(404).json({ error: { err: er.message } })
                    } else {
                        const { size, birthtime } = fs.statSync(p);
                        if (size && birthtime) {
                            var d = new Date(birthtime);
                            d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`;
                            res.render("panel/fichier.ejs", {
                                c: content,
                                a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                                n: `${a}`,
                                u: mail.split("@")[0],
                                j: "Abonnement Free",
                                p: "https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175"
                            });
                        } else {
                            return res.status(404).json({ error: { err: err.message } })
                        }
                    }
                })

            } else {
                return res.status(404).json({ error: { err: "Fichier introuvable !" } });
            }
        } else {
            const html = "<script>window.location = `" + config.domain + "/login`</script>";
            return res.send(html), res.end();
        }
    }
}