const fs = require("fs");
const https = require("https");
const http = require('http')

const PORT = 85

http.createServer(function (req, res) {
    https.get("https://node--olivia.vivo.sx/vod/kfaDWXiZdIKcO8oKfAKkhA/1604071775/0000151819", response => {
    var stream = response.pipe(res);

    stream.on("finish", function() {
        console.log("done");
    });
    });
}).listen(PORT)

console.log("online on " + PORT)