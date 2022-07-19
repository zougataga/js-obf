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
            const file = fs.existsSync(p);
            if (!file) return res.status(404).json({ error: { err: "Fichier introuvable !" } });
            const v = await img(e);
            if (v === "fa fa-file-code-o" || v === "fa fa-file-text-o") {
                fs.readFile(p, { encoding: 'utf8', flag: 'r' }, function (err, data) {
                    if (err) {
                        console.log(err);
                        return res.status(404).json({ error: { err: err.message } })
                    } else {
                        const { size, birthtime } = fs.statSync(p);
                        if (size && birthtime) {
                            var d = new Date(birthtime)
                            d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`
                            res.render("panel/fichier.ejs", {
                                c: data,
                                a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                                n: `${a}`,
                                u: mail.split("@")[0],
                                j: "Abonnement Free",
                                p: "https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175"
                            })
                        } else {
                            return res.status(404).json({ error: { err: err.message } })
                        }
                    }
                });
            } else if (v === "fa fa-file-image-o") {
                const { size, birthtime } = fs.statSync(p);
                if (size && birthtime) {
                    var d = new Date(birthtime)
                    d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`
                    res.render("panel/img.ejs", {
                        b: `data:image/${e};base64,${await base64(p)}`,
                        a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                        n: `${a}`,
                        u: mail.split("@")[0],
                        j: "Abonnement Free",
                        p: "https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175"
                    })
                }
            } else if (v === "fa fa-file-video-o" || v === "fa fa-file-sound-o") {
                const { size, birthtime } = fs.statSync(p);
                if (size && birthtime) {
                    var d = new Date(birthtime)
                    d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`
                    res.render("panel/video.ejs", {
                        b: `data:video/${e};base64,${await base64(p)}`,
                        a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                        n: `${a}`,
                        u: mail.split("@")[0],
                        j: "Abonnement Free",
                        p: "https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175"
                    })
                }
            } else {
                const { size, birthtime } = fs.statSync(p);
                if (size && birthtime) {
                    var d = new Date(birthtime);
                    d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`;
                    res.render("panel/all.ejs", {
                        a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                        n: `${a}`,
                        u: mail.split("@")[0],
                        j: "Abonnement Free",
                        p: "https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175"
                    })
                }
            }
        } else {
            const html = "<script>window.location = `" + config.domain + "/login`</script>";
            return res.send(html), res.end();
        }
    }
}