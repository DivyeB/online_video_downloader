const ytdl = require('ytdl-core');
const fs = require("fs")
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.get("/",(req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/",(req, res) => {
    const url = req.body.url;
    const quality = req.body.quality;

    const info = ytdl(url, getinfo());
    console.log(info);
})

app.listen(port, () => {
    console.log("Server up and running!")
})