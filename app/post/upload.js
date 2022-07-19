const db = require("quick.db");
const fs = require("fs");
const formidable = require("formidable");
const config = require("../../config.json");
module.exports = {
    path: "/upload",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;
        if (db.get(`ip_${ip}`)) {
            const user = db.get(`ip_${ip}`).split("@")[0];
            const form = new formidable.IncomingForm();
            form.uploadDir = `./drive/${user}`;
            form.keepExtensions = true;
            form.maxFieldsSize = 2 * 1024 * 1024;
            form.parse(req, function (err, fields, files) {
                if (err) {
                    console.log(err);
                    return res.status(404).json({ error: { err: err.message } });
                } else {
                    if (files.file.originalFilename.split(".")[2]) {
                        return res.status(404).json({ error: { err: "Le nom contient des caractères non autorisé ! (invalide: image.2022.png, valide: image_2022.png)" } })
                    } else {
                        fs.readdir(`./drive/${user}`, (err, fl) => {
                            if (err) {
                                console.log(err);
                                return res.status(404).json({ error: { err: err.message } })
                            } else {
                                var r = false
                                fl.forEach(f => {
                                    if (files.file.originalFilename === f) r = true;
                                });
                                if (r) {
                                    return res.status(404).json({ error: { err: `Un fichier avec le même nom existe déjà !` } });
                                } else {
                                   fs.rename(files.file.filepath, files.file.filepath.replace(files.file.filepath.split("\\")[2], files.file.originalFilename), (error) => {
                                        if (error) {
                                            console.log(err);
                                            return res.status(404).json({ error: { err: error.message } })
                                        } else {
                                            const html = "<script>alert(`Upload terminer !`);window.location = `" + config.domain + "`</script>";
                                            return res.send(html);
                                        }
                                    });
                                }
        
                            }
                        })
        
                    }
                }
            });
        } else {
            const html = "<script>window.location = `" + config.domain + "/login`</script>";
            return res.send(html), res.end();
        }
    }
}