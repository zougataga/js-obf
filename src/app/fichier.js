const config = require("../config.json")
const fs = require("fs")
const formidable = require('formidable');
const { img, sz, base64 } = require("../all.js")
const db = require("quick.db")


const u = (req, res) => {
    let ip = "181.214.218.58"
    if (db.get(`ip_${ip}`)) {
        let mail = db.get(`ip_${ip}`)
        const user = req.params.user
        const n = req.params.id.split(".")[0]
        const e = req.params.id.split(".")[1]
        const a = `${n}.${e}`
        const p = `${__dirname}/user/${user}/${a}`
        let file = fs.existsSync(p)
        if (!file) return res.status(404).json({ error: { err: "Fichier introuvable !" } });
        let v = img(e)
        if (v === "fa fa-file-code-o" || v === "fa fa-file-text-o") {
            fs.readFile(p, { encoding: 'utf8', flag: 'r' }, function (err, data) {
                if (err) {
                    console.log(err);
                    return res.status(404).json({ error: { err: err.message } })
                } else {
                    const { size, birthtime } = fs.statSync(p);
                    if (size && birthtime) {
                        let d = new Date(birthtime)
                        d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`
                        res.render("fichier.ejs", {
                            c: data,
                            a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                            n: `${a}`,
                            u: mail.split("@")[0],
                            j: "Abonnement Free",
                            p:  db.get(`avatar_${mail.split("@")[0]}`) ?  db.get(`avatar_${mail.split("@")[0]}`):"https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
                        })
                    } else {
                        return res.status(404).json({ error: { err: err.message } })
                    }
                }
            });


        } else if (v === "fa fa-file-image-o") {
            const { size, birthtime } = fs.statSync(p);
            if (size && birthtime) {
                let d = new Date(birthtime)
                d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`
                res.render("img.ejs", {
                    b: `data:image/${e};base64,${base64(p)}`,
                    a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                    n: `${a}`,
                    u: mail.split("@")[0],
                    j: "Abonnement Free",
                    p:  db.get(`avatar_${mail.split("@")[0]}`) ?  db.get(`avatar_${mail.split("@")[0]}`):"https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
                })
            }
        } else if (v === "fa fa-file-video-o" || v === "fa fa-file-sound-o") {
            const { size, birthtime } = fs.statSync(p);
            if (size && birthtime) {
                let d = new Date(birthtime)
                d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`
                res.render("video.ejs", {
                    b: `data:video/${e};base64,${base64(p)}`,
                    a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                    n: `${a}`,
                    u: mail.split("@")[0],
                    j: "Abonnement Free",
                    p:  db.get(`avatar_${mail.split("@")[0]}`) ?  db.get(`avatar_${mail.split("@")[0]}`):"https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
                })
            }
        } else {
            const { size, birthtime } = fs.statSync(p);
            if (size && birthtime) {
                let d = new Date(birthtime)
                d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`
                res.render("all.ejs", {
                    a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                    n: `${a}`,
                    u: mail.split("@")[0],
                    j: "Abonnement Free",
                    p:  db.get(`avatar_${mail.split("@")[0]}`) ?  db.get(`avatar_${mail.split("@")[0]}`):"https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
                })
            }
        }
    } else {
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html), res.end();
    }

}

const d = (req, res) => {
    let ip = "181.214.218.58"
    if (db.get(`ip_${ip}`)) {
        let mail = db.get(`ip_${ip}`)
        const user = req.params.user
        const n = req.params.id.split(".")[0]
        const e = req.params.id.split(".")[1]
        const a = `${n}.${e}`
        const p = `${__dirname}/user/${user}/${a}`
        const content = req.body.content;
        let file = fs.existsSync(p)
        if (!file) return res.status(404).json({ error: { err: "Fichier introuvable !" } });
        let v = img(e)
        if (v === "fa fa-file-code-o" || v === "fa fa-file-text-o" || v === "fa fa-file-o") {
            fs.writeFile(p, content, "utf8", function (er, ee) {
                if (er) {
                    console.log(er);
                    return res.status(404).json({ error: { err: er.message } })
                } else {

                    const { size, birthtime } = fs.statSync(p);
                    if (size && birthtime) {
                        let d = new Date(birthtime)
                        d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`
                        res.render("fichier.ejs", {
                            c: content,
                            a: `${n} - ${d} - ${sz(size)} - Fichier ${e}`,
                            n: `${a}`,
                            u: mail.split("@")[0],
                            j: "Abonnement Free",
                            p:  db.get(`avatar_${mail.split("@")[0]}`) ?  db.get(`avatar_${mail.split("@")[0]}`):"https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
                        })
                    } else {
                        return res.status(404).json({ error: { err: err.message } })
                    }

                }
            })

        } else {
            return res.status(404).json({ error: { err: "Fichier introuvable !" } });
        }
    } else {
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html), res.end();
    }
}




module.exports = { u, d }

