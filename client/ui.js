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
    const source = await getVideoSource(url)
    console.log(source)

    const video = vie.get("#videoPlayer")
    video.innerHTML = ""

    let sourceElement = document.createElement('source');
    sourceElement.setAttribute('src', source);

    video.appendChild(sourceElement)
    video.load();
    video.play();
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