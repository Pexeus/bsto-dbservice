const bcrypt = require("./src/myBcrypt")
const myBcrypt = require("./src/myBcrypt")

const init = async () => {
    await myBcrypt.hashPassword("sml12345")
    .then(resp => {
        console.log(resp);
    })
}


