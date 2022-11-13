const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.static(__dirname + '/resource'));


app.get("/", (req, res) => {
    res.sendFile("./index.html", {root: "./"})
});

app.listen(PORT, () => {
    console.log("API ON");
});
