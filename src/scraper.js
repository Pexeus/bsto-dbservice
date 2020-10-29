const puppeteer = require("puppeteer")
let browser = false

module.exports = {
    initiate: function() {
        initiate()
    },
    getSource: function(url) {
        return new Promise(async (resolve) => {
            const source = await getSource(url)
            
            resolve(source)
        })
    }
}

async function initiate() {
    browser = await puppeteer.launch({ 
        headless: true,
        defaultViewport: null,
        userDataDir: "./browserProfile",
    });

    console.log("> scraper initiated!")
}

async function getSource(url) {
    console.log("> scraping: " + url)

    return new Promise(async (resolve) => {
        const page = await browser.newPage()
        page.goto(url)

        await page.waitForNavigation();
        
        const src = await page.evaluate(() => {
            const videoWrapper = document.getElementsByClassName("plyr__video-wrapper")[0]
            const video = videoWrapper.childNodes[0]
            const source = video.childNodes[0].src

            return source
        });

        resolve(src)
        page.close()
        console.log("> done!")
    })
}