async function getShows() {
    return new Promise(resolve => {
        axios.post("/getShows").then(response => {
            resolve(response.data)
        })
    })
}

async function episodes(showID) {
    return new Promise(resolve => {
        axios.post("/getEpisodes", {query: showID}).then(response => {
            resolve(response.data)
        })
    })
}

async function clearDB(key) {
    axios.post("/clearDatabase", {key: key}).then(response => {
        console.log(response)
        location.reload()
    })
}

async function getVideoSource(url) {
    return new Promise(resolve => {
        axios.post("/getSource", {url: url}).then(response => {
            resolve(response.data)
        })
    })
}
