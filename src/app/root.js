const config = require("../config.json")
const fs = require("fs")
const db = require("quick.db")
const u = (req, res) => {
    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (db.get(`ip_${ip}`)) {
        let mail = db.get(`ip_${ip}`)
        return res.render(`panel.ejs`, {
            u: mail.split("@")[0],
            j: "Abonnement Free",
            p:  db.get(`avatar_${mail.split("@")[0]}`) ?  db.get(`avatar_${mail.split("@")[0]}`):"https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
        })
    } else {
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html), res.end();
    }
}

const c = (req, res) => {
    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (db.get(`ip_${ip}`)) {
        let mail = db.get(`ip_${ip}`)
        return res.render(`upload.ejs`, {
            u: mail.split("@")[0],
            j: "Abonnement Free",
            p:  db.get(`avatar_${mail.split("@")[0]}`) ?  db.get(`avatar_${mail.split("@")[0]}`):"https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
        })
    } else {
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html), res.end();
    }
}

const s = (req, res) => {
    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (db.get(`ip_${ip}`)) {
        let mail = db.get(`ip_${ip}`)
        return res.render(`setting.ejs`, {
            u: mail.split("@")[0],
            j: "Abonnement Free",
            p:  db.get(`avatar_${mail.split("@")[0]}`) ?  db.get(`avatar_${mail.split("@")[0]}`):"https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
        })
    } else {
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html), res.end();
    }
}

const d = (req, res) => {
    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (!db.get(`ip_${ip}`)) {
        res.sendFile(`register.html`, { root: "./views/html" })
    } else {
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html), res.end();
    }
}

const t = (req, res) => {
    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (!db.get(`ip_${ip}`)) {
        return res.sendFile(`login.html`, { root: "./views/html" })
    } else {
        let html = "<script>window.location = `" + config.domain + "/fichier`</script>"
        return res.send(html), res.end();
    }
}

const q = (req, res) => {
    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (db.get(`ip_${ip}`)) {
        db.set(`ip_${ip}`, null)
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html);
    } else {
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html), res.end();
    }
    
}

const sp = (req, res) => {
    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (!db.get(`ip_${ip}`)) {
        return res.sendFile(`404.html`, { root: "./views/html" })
    } else {
        let mail = db.get(`ip_${ip}`)
        return res.render(`404.ejs`, {
            u: mail.split("@")[0],
            j: "Abonnement Free",
            p:  db.get(`avatar_${mail.split("@")[0]}`) ?  db.get(`avatar_${mail.split("@")[0]}`):"https://tse3.mm.bing.net/th?id=OIP.z8-GqzZcw5PZgZkcGisFOAAAAA&pid=Api&P=0&w=175&h=175" 
        })
    }
}

module.exports = { u, d, t, q, c, s, sp }


