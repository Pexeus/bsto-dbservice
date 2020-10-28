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

    app.post("/status", (req, res) => {
        let count = 0

        db("shows")
        .then(rows => {
            rows.forEach(row => {
                count += 1
            })

            res.end(JSON.stringify({pointer: count}))
        })
    })

    app.post("/show", (req, res) => {
        const show = req.body
        console.log(show.title)
        console.log("seasons: " + show.seasons.length)

        db("shows")
        .insert({title: show.title})
        .catch(err => {
            console.log(err);
        })
        seasonID = 0
        for(season of show.seasons) {
            seasonID += 1
            db("seasons")
            .insert({ID_show: show.id})
            .catch(err => {
                console.log(err)
            })

            console.log("episodes: " + season.episodes.length)

            for(episode of season.episodes) {
                db("episodes")
                .insert({
                    ID_show: show.id,
                    ID_season: seasonID,
                    title: episode.title,
                    bs_link: episode.href,
                    vivo_link: episode.vivo
                })
                .catch(err => {
                    console.log(err)
                })
            }

            res.end("done")
        }
    })
}

async function saveShow(show) {
    db("shows")
        .insert({ title: show.title })
        .catch(err => {
            console.log(err)
        })
}

async function saveSeason(showid) {
    db("seasons")
    .insert({ID_show: showid})
    .catch(err => {
        console.log(err);
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
