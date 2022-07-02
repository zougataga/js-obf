const config = require("../config.json")
const fs = require("fs")
const db = require("quick.db")

const u = (req, res) => {
    let ip = "181.214.218.58"
    const obj = req.body
    if (!db.get(`user_${obj.mail}`)) {
        let html = "<script>alert(`Aucun compte avec cette email n'a été trouver !`);window.location = `" + config.domain + "/login`</script>"
        return res.send(html);
    } else {
        let mdp = db.get(`user_${obj.mail}`)
        if (mdp === obj.mdp) {
            db.set(`ip_${ip}`, obj.mail)
            let html = "<script>window.location = `" + config.domain + "/`</script>"
            return res.send(html);
        } else {
            let html = "<script>alert(`Mot de passe invalide !`);window.location = `" + config.domain + "/login`</script>"
            return res.send(html);
        }

    }

}


module.exports = u


