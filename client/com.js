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

window.onload = () => {
    axios.post("/getSession")
    .then(resp => {
        if(resp.data == false) {
            window.location.href = "./login?error=accessdenied"
        }
    })
}


document.getElementById("logout").addEventListener("click", () => {
    axios.post("/logout")
    .then(resp => {
        if(resp.data == "done") {
            window.location.href = "./login"
        }
        else {
            console.log(resp.data);
        }
        
    })
})