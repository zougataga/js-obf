const config = require("../config.json")
const fs = require("fs")
const formidable = require('formidable');
const { img, sz, base64 } = require("../all.js")

const u = (req, res) => {
    const user = req.params.user
    fs.readdir(`${__dirname}/user/${user}`, (err, files) => {
        if (err) {
            console.log(err);
            return res.status(404).json({ error: { err: err.message } })
        } else {
            let outpout = []
            let sze = ""
            let r = false
            files.forEach(file => {
                const { size, birthtime } = fs.statSync(`${__dirname}/user/${user}/${file}`);
                if (size && birthtime) {
                    r = true
                    sze += size
                    let d = new Date(birthtime)
                    d = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getUTCSeconds()}`
                    outpout.push({ name: file.split(".")[0], ext: file.split(".")[1], size: sz(size), base: size, date: d, img: img(file.split(".")[1]) })
                }
            })
            if (r) return res.status(200).json({size: sz(sze), slm: outpout });
            else return res.end()

        }
    })
}

module.exports = u