const db = require("quick.db")

const config = require("../config.json")
const fs = require("fs")
const formidable = require('formidable');
const { img, sz, base64 } = require("../all.js")

const u = (req, res) => {
    const user = req.params.user
    const n = req.params.id.split(".")[0]
    const e = req.params.id.split(".")[1]
    const a = `${n}.${e}`
    const p = `${__dirname}\\user\\${user}\\${a}`
    let file = fs.existsSync(p)
    if (!file) return res.status(404).json({ error: { err: "Fichier introuvable !" } });

    fs.unlink(p, function (err) {
        if (err) {
            console.log(err);
            return res.status(404).json({ error: { err: err.message } })
        } else {
            let html = "<script>alert(`Le fichier " + a + " a été supprimer !`);window.location = `" + config.domain + "`</script>"
            return res.send(html);
        }
    });

}

const d = (req, res) => {
    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const user = req.params.user
    const p = `${__dirname}\\user\\${user}`
    fs.rmdir(p, { recursive: true}, function (err) {
        if (err) {
            console.log(err);
            return res.status(404).json({ error: { err: err.message } })
        } else {
            db.set(`user_${db.get(`ip_${ip}`)}`,null)
            db.set(`ip_${ip}`, null)
            db.set(`avatar_${user}`, null)
            let html = "<script>alert(`Votre compte à bien été supprimer !`);window.location = `" + config.domain + "/login`</script>"
            return res.send(html);
        }
    });

}

module.exports = { u, d }