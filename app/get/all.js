const fs = require("fs");
const db = require("quick.db");
const img = require("../../assets/function/img.js");
const sz = require("../../assets/function/size.js");
module.exports = {
    path: "/all/:user",
    go: async (req, res) => {
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteaddress;
        if (db.get(`ip_${ip}`)) {
            const user = req.params.user;
            fs.readdir(`./drive/${user}`, (err, files) => {
                if (err) {
                    console.log(err);
                    return res.status(404).json({ error: { err: err.message } })
                } else {
                    var outpout = [];
                    var sze = "";
                    var r = false;
                    files.forEach(file => {
                        const { size, birthtime } = fs.statSync(`./drive/${user}/${file}`);
                        if (size && birthtime) {
                            r = true;
                            sze += size;
                            var d = new Date(birthtime);
                            d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`;
                            outpout.push({ name: file.split(".")[0], ext: file.split(".")[1], size: sz(size), base: size, date: d, img: img(file.split(".")[1]) });
                        }
                    });
                    if (r) return res.status(200).json({size: sz(sze), slm: outpout });
                    else return res.end()
                }
            })
        } else {
            const html = "<script>window.location = `" + config.domain + "/login`</script>";
            return res.send(html), res.end();
        }
    }
}