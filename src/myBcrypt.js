const bcrypt = require("bcrypt")
const saltRounds = 10



module.exports = {
    hashPassword: async (plain) =>  {
        let passwordHashed = await bcrypt.hash(plain, saltRounds)
        .then(response => {
            return response
        })
        .catch(err => {
            console.log(err);
            return false
        })
        if(passwordHashed) {
            return passwordHashed
        }
        else {
            return false
        }
    },
    comparePassword: async (plain, hashed) => {
        let out = await bcrypt.compare(plain, hashed)
        .then(response => {
            return response
        })
        .catch(err => {
            console.log(err);
            return false
        })
        if(out) {
            return out
        }
        else {
            return false
        }
    }
}