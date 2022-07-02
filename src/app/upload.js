const config = require("../config.json")
const fs = require("fs")
const formidable = require('formidable');
const { img, sz, base64 } = require("../all.js")
const db = require('quick.db');


const u = (req, res) => {
    let ip = "181.214.218.58"
    if (db.get(`ip_${ip}`)) {
        let user = db.get(`ip_${ip}`).split("@")[0]
        let form = new formidable.IncomingForm();
        form.uploadDir = `./src/app/user/${user}`;
        form.keepExtensions = true;
        form.maxFieldsSize = 2 * 1024 * 1024;
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log(err);
                return res.status(404).json({ error: { err: err.message } })
            } else {
                if (files.file.originalFilename.split(".")[2]) {
                    return res.status(404).json({ error: { err: "Le nom contient des caractères non autorisé ! (invalide: image%%%<=>.2022.png, valide: image.png)" } })
                } else {
                    fs.readdir(`${__dirname}/user`, (err, fl) => {
                        if (err) {
                            console.log(err);
                            return res.status(404).json({ error: { err: err.message } })
                        } else {
                            let r = false
                            fl.forEach(f => {
                                if (files.file.originalFilename === f) r = true
                            })
                            if (r) {
                                return res.status(404).json({ error: { err: `Un fichier avec le même nom existe déjà !` } })
                            } else {
                                fs.rename(files.file.filepath, files.file.filepath.replace(files.file.filepath.split("\\")[4], files.file.originalFilename), (error) => {
                                    if (error) {
                                        console.log(err);
                                        return res.status(404).json({ error: { err: error.message } })
                                    } else {
                                        let html = "<script>alert(`Upload terminer !`);window.location = `" + config.domain + "`</script>"
                                        return res.send(html);
                                    }
                                });
                            }
    
                        }
                    })
    
                }
            }
        });
        return;
    } else {
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html);
    }

    
}

const d = (req, res) => {
    let ip = "181.214.218.58"
    if (db.get(`ip_${ip}`)) {
        let user = db.get(`ip_${ip}`).split("@")[0]
        db.set(`avatar_${user}`, req.body.baseimg)
        let html = "<script>window.location = `" + config.domain + "/`</script>"
        return res.send(html);
    } else {
        let html = "<script>window.location = `" + config.domain + "/login`</script>"
        return res.send(html);
    }
}

module.exports = { u, d }