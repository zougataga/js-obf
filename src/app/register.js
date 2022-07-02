const config = require("../config.json")
const fs = require("fs")
const db = require("quick.db")

const u = (req, res) => {
    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const obj = req.body
    db.delete(`ip_${ip}`)
    if(obj.mdp !== obj.mdp2) {
        let html = "<script>alert(`Les mots de passe c  orrespondent pas !`);window.location = `" + config.domain + "/register`</script>"
        return res.send(html);
    }
    if(obj.txt !== obj.cptch) {
        let html = "<script>alert(`Captcha invalide !`);window.location = `" + config.domain + "/register`</script>"
        return res.send(html);
    }
    if (db.get(`user_${obj.mail}`)) {
        let html = "<script>alert(`Un compte avec cette email existe déjà !`);window.location = `" + config.domain + "/login`</script>"
        return res.send(html);
    } else {
        db.set(`user_${obj.mail}`, obj.mdp)
        db.set(`ip_${ip}`, obj.mail)
        let user = obj.mail.split("@")[0]
        if (!fs.existsSync(`${__dirname}/user/${user}/`)) fs.mkdirSync(`${__dirname}/user/${user}/`)
        let html = "<script>alert(`Votre compte a bien été créer !`);window.location = `" + config.domain + "/login`</script>"
        return res.send(html);
    }

}


module.exports = u


