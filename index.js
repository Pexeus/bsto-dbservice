const fs = require("fs")
const express = require("express")
const bodyParser = require('body-parser')
const knex = require("./dbConnection")

const db = knex.getDB()
const app = express()
const server = require("http").Server(app)

const PORT = 85


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./client"))
app.use(express.json({ limit: "1mb"}))

function initiate() {
    server.listen(process.env.PORT || PORT, () => {
        console.clear()
        console.log("-> Online on Port " + PORT)
    })

    app.post("/episode", (req, res) => {
        console.log("new episode:")
        saveEpisode(req.body)

        res.setHeader('Content-Type', 'application/json');
        res.end("ok")
    })

    app.post("/show", (req, res) => {
        console.log("new show:")
        saveShow(req.body)

        res.setHeader('Content-Type', 'application/json');
        res.end("ok")
    })
}

async function saveShow(show) {
    db("shows")
        .insert(show)
        .catch(err => {
            console.log(err)
        })

    db("shows")
        .then(rows => {
            console.log(rows);
        })
}

async function saveEpisode(episode) {
    db("episodes")
        .insert(episode)

    db("episodes")
        .then(rows => {
            console.log(rows);
        })
}

initiate()
