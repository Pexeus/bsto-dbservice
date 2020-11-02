const fs = require("fs")
const https = require("https");


const express = require("express")
const session = require("express-session")
const bodyParser = require('body-parser')
const knex = require("./src/dbConnection")
const scraper = require("./src/scraper")



const myBcrypt = require("./src/myBcrypt")
const db = knex.getDB()
const app = express()
const server = require("http").Server(app)

const PORT = 85

SESS_NAME = "sid"
SESS_SECRET = "$2b$10$a64NVceTGIElwFFZve3EUOpY5QUVRqhS6xgtyhPRdl6HH8qIAkEEm"
SESS_LIFETIME = 1000 * 60 * 60 * 2 // 2h (ms)
SESS_SEC = false

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./client"))
app.use(express.json({ limit: "1mb"}))

var sess = {}

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: SESS_SEC
    }
}))

function initiate() {
    scraper.initiate()

    server.listen(process.env.PORT || PORT, () => {
        console.clear()
        console.log("-> Online on Port " + PORT)
    })

    app.get("/stream/:vivoID", async (req, res) => {
        const url = "https://vivo.sx/" + req.params.vivoID

        const source = await scraper.getSource(url)
        
        https.get(source, response => {
            response.pipe(res)
        })
    })

    app.post("/getShows", (req, res) => {
        db("shows")
        .then(rows => {
            res.end(JSON.stringify(rows))
        })
    })

    app.post("/clearDatabase", (req, res) => {
        let key = req.body.key
        resetDB(key)

        res.end("executed")
    })

    app.post("/getEpisodes", async (req, res) => {
        const query = req.body.query
        const seasons = await db("seasons").where({ ID_show: query}) 

        for (season of seasons) {
            season.episodes = await db("episodes").where({ ID_show: query, ID_season: season.ID_season})
        }

        res.end(JSON.stringify(seasons))
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

    app.post("/show", async (req, res) => {
        const show = req.body
        console.log(show.title)
        console.log("seasons: " + show.seasons.length)

        await db("shows").insert({title: show.title, description: "error: empty"})
        .catch(err => {
            console.log(err);
        })
        seasonID = 0
        for(season of show.seasons) {
            seasonID += 1
            
            await db("seasons").insert({ID_season: seasonID, ID_show: show.id})
            .catch(err => {
                console.log(err)
            })

            for(episode of season.episodes) {
                await db("episodes")
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
        }

        res.end("done")
    })
    app.post("/login", (req, res) => {
        res.setHeader("Content-Type","application/json")
        username = req.body.username
        password = req.body.password
        db("users")
        .then(rows => {
            rows.forEach(row => {
                if(row.name == username) {
                    if(myBcrypt.comparePassword(password, row.password)) {
                        res.json({uid:row.ID})
                    }
                    else{
                        res.end("false")
                    }
                }
                else {
                    res.end("false")
                }
            })
        })
    })
    app.post("/createSession", (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        let uid = req.body.id.uid
        if(req.session.uid === undefined){
            sess = req.session
            sess.uid = uid
            res.end("true")
        }
        else{
            res.end("false")
        }
    })
    app.post("/getSession", (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if(req.session.uid) {
            res.end("true")
        }
        else {
            res.end("false")
        }
    })
    app.post("/logout", (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        req.session.destroy(err => {
            res.end(err)
        })
        res.end("done")
    })
    
}

async function resetDB(key) {
    if (key == "123") {
        db
        .raw('DELETE FROM shows; DELETE FROM episodes; DELETE FROM seasons;')
        .catch(err => {
            console.log(err)
        })

        db
        .raw('ALTER TABLE shows AUTO_INCREMENT = 1; ALTER TABLE seasons AUTO_INCREMENT = 1; ALTER TABLE episodes AUTO_INCREMENT = 1')
        .catch(err => {
            console.log(err)
        })

        console.log("cleared DB")
    }
    else {
        console.log("wrong key!");
    }
}

initiate()
