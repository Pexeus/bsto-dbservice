var username = document.getElementById("uname")
var password = document.getElementById("pwd")

const submit = document.getElementById("submit")

const createSession = (data) => {
    axios.post("/createSession", data)
    .then(resp => {
        console.log("done");
        window.location.href = "../"
    })
}


submit.addEventListener("click", () => {
    if(username.value != "" && password.value != "") {
        query = {
            username: username.value,
            password: password.value
        }
        axios.post("/login", query)
        .then(resp => {
            if(resp.data != false) {
                data = {id:resp.data}
                createSession(data)
            }
        })
        username.value = ""
        password.value = ""
    }
    else {
        alert("error, enter all values")
    }
})