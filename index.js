// LLX :=)
const PORT = process.env.PORT || 8080
//  process.on("unhandledRejection", (a) => {if (a.message) return undefined})

const express = require("express")
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/src/app/drive'));

app.get("/",(req,res)=>require("./src/app/root.js").u(req,res))
app.get("/register",(req,res)=>require("./src/app/root.js").d(req,res))
app.get("/login",(req,res)=>require("./src/app/root.js").t(req,res))

app.get("/fichier",(req,res)=>require("./src/app/root.js").u(req,res))
app.get("/upload",(req,res)=>require("./src/app/root.js").c(req,res))
app.get("/setting",(req,res)=>require("./src/app/root.js").s(req,res))

app.get("/all/:user",(req,res)=>require("./src/app/all.js")(req,res))
app.get("/fichier/:user/:id",(req,res)=>require("./src/app/fichier.js").u(req,res))
app.get("/delete/:user/:id",(req,res)=>require("./src/app/delete.js").u(req,res))
app.get("/disconnect",(req,res)=>require("./src/app/root.js").q(req,res))

app.post("/fichier/:user/:id",(req,res)=>require("./src/app/fichier.js").d(req,res))
app.post("/upload",(req,res)=>require("./src/app/upload.js").u(req,res))
app.post("/avatar",(req,res)=>require("./src/app/upload.js").d(req,res))
app.post("/register",(req,res)=>require("./src/app/register.js")(req,res))
app.post("/login",(req,res)=>require("./src/app/login.js")(req,res))
app.post("/delete/:user",(req,res)=>require("./src/app/delete.js").d(req,res))

// app.all('*', (req, res) =>require("./src/app/root.js").sp(req,res));
app.listen(PORT, () => { 
console.clear();
console.log(`=> [${new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getUTCSeconds()+":"}] - API ON`);

})
