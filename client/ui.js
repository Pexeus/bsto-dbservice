async function displayShows() {
    const shows = await getShows()

    let tableHead = rowGen("th", shows[0])
    vie.insert("#showsTable", tableHead)

    shows.forEach(show => {
        let row = rowGen("td", show)
        row.addEventListener("click", function() {
            displayEpisodes()
        });

        vie.insert("#showsTable", row)
    })
}

async function displayEpisodes() {
    const id = event.target.parentNode.childNodes[0].innerHTML
    const seasons = await episodes(id)
    let currentSeason = 0

    vie.get("#episodes").innerHTML = ""
    
    seasons.forEach(season => {
        const container = vie.new("div", "#seasonConainer")
        const SeasonNr = vie.new("h2")
        SeasonNr.innerHTML = "Season " + (currentSeason += 1)

        const table = vie.new("table")
        const tableHead = rowGen("th", season.episodes[0])
        table.appendChild(tableHead)


        season.episodes.forEach(episode => {
            let row = rowGen("td", episode)
            row.addEventListener("click", function() {
                const clicked = event.target

                if (clicked.tagName != "TR") {
                    url = clicked.parentElement.childNodes[clicked.parentElement.childNodes.length - 1].innerHTML
                    openPlayer(url)
                }
            })
            table.appendChild(row)
        })

        container.appendChild(SeasonNr)
        container.appendChild(table)
        vie.get("#episodes").appendChild(container)
    })
}

async function openPlayer(url) {
    const player = vie.get("#player")
    const vivoID = url.split("https://vivo.sx/")[1]

    player.style.display = "inline-block"
    player.innerHTML = ""

    console.log(playerMethod())

    if (playerMethod() == "stream") {
        const video = vie.new("video")
        video.setAttribute("controls", "")

        const source = "/stream/" + vivoID
    
        const sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', source);

        player.appendChild(video)
        video.appendChild(sourceElement)
        video.load();
        video.play();
    }

    if (playerMethod() == "vivo") {
        const iframe = vie.new("iframe")

        iframe.src = "https://vivo.sx/embed/" + vivoID
        iframe.sandbox = "allow-scripts allow-forms allow-same-origin"
        iframe.scrolling = "no"
        iframe.setAttribute("allowfullscreen", "")
        iframe.setAttribute("frameborder", "0")

        player.appendChild(iframe)
    }
}

function playerMethod() {
    const selection = vie.get("#playerMethod")
    return selection.value.toLowerCase()
}


function clearData() {
    key = vie.get("#passwordInput").value
    clearDB(key)
}

function rowGen(type, elements) {
    let row = vie.new("tr")

    if (type == "th") {
        const keys = Object.keys(elements)

        keys.forEach(key => {
            let cell = vie.new(type)
            cell.innerHTML = key

            vie.insert(row, cell)
        })
    }
    else {
        const keys = Object.keys(elements)

        keys.forEach(key => {
            let cell = vie.new(type)
            cell.innerHTML = elements[key]

            vie.insert(row, cell)
        })
    }

    return row
}

displayShows()