// LLX :=)
const PORT = process.env.PORT || 8080;
//process.on("unhandledRejection", (a) => {if (a.message) return undefined})

const express = require("express");
const app = express();
const cors = require('cors');
const { readdirSync } = require('fs');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/drive'));
app.use(express.static(__dirname + '/assets'));


// app.get("/",(req,res)=>require("./src/app/root.js").u(req,res))
// app.get("/register",(req,res)=>require("./src/app/root.js").d(req,res))
// app.get("/login",(req,res)=>require("./src/app/root.js").t(req,res))

// app.get("/fichier",(req,res)=>require("./src/app/root.js").u(req,res))
// app.get("/upload",(req,res)=>require("./src/app/root.js").c(req,res))
// app.get("/setting",(req,res)=>require("./src/app/root.js").s(req,res))

// app.get("/all/:user",(req,res)=>require("./src/app/all.js")(req,res))
// app.get("/fichier/:user/:id",(req,res)=>require("./src/app/fichier.js").u(req,res))
// app.get("/delete/:user/:id",(req,res)=>require("./src/app/delete.js").u(req,res))
// app.get("/disconnect",(req,res)=>require("./src/app/root.js").q(req,res))

// app.post("/fichier/:user/:id",(req,res)=>require("./src/app/fichier.js").d(req,res))
// app.post("/upload",(req,res)=>require("./src/app/upload.js").u(req,res))
// app.post("/avatar",(req,res)=>require("./src/app/upload.js").d(req,res))
// app.post("/register",(req,res)=>require("./src/app/register.js")(req,res))
// app.post("/login",(req,res)=>require("./src/app/login.js")(req,res))
// app.post("/delete/:user",(req,res)=>require("./src/app/delete.js").d(req,res))

// app.all('*', (req, res) =>require("./src/app/root.js").sp(req,res));

const loadApp = (dir = "./app/") => {
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
        for (const file of commands) {
            const getFile = require(`${dir}/${dirs}/${file}`);
            if (dirs === "get") {
                app.get(getFile.path, async (req, res) => await getFile.go(req, res))
            }
            if (dirs === "post") {
                app.post(getFile.path, async (req, res) => await getFile.go(req, res))
            }
            console.log(`=> [${new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getUTCSeconds()}] - app charger {${getFile.path}} [${dirs}]`)
        };
    });
};
loadApp()

app.all('*', (req, res) => res.sendFile("404.html", { root: "./views/web" }));
app.listen(PORT, () => { 
console.log(`=> [${new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getUTCSeconds()}] - API ON`);
})
