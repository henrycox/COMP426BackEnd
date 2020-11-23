const { json } = require("express");
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const cors = require('cors')

var corsOptions = {
    origin: 'https://xenodochial-saha-b09044.netlify.app',
    credentials: true
  }
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(expressSession({
    name: "sessionCookie",
    secret: "session secret",
    resave: false,
    saveUninitialized: false,
}))

const UserData = require('./UserData.js')
const pollData = require('./pollData.js')

const login_data = require('data-store')( {path: process.cwd() + '/data/users.json'})


app.post('/pollEntry', (req, res) => {
    data = req.body
    /* let president = req.body.president
    let governor = req.body.governor
    let NCsenator = req.body.NCsenator
    let ALsenator = req.body.ALsenator
    let AZsenator = req.body.AZsenator
    let MEsenator = req.body.MEsenator
    let approval = req.body.approval
    let data = {"president": president} */
    pollData.registerVotes(data)

    return res.json(true)

})

app.get('/pollResults', (req, res) => {
    let results = pollData.getPollData()
    res.json(results)
})

app.post('/createUser', (req, res) => {
    let user = req.body.login
    let password = req.body.password
    let address = req.body.address
    let city = req.body.city
    let state = req.body.state
    let zip = req.body.zip
    let user_data = login_data.get(user)
    if (user_data != null) {
        res.send("User Already Exists")
        return
    } else {
        let userData = {"password": password,
                        "address": address,
                        "city": city,
                        "state": state,
                        "zip": zip} 
        login_data.set(user, userData)
        res.json(true)
        return
    }
})

app.get('/hello', (req, res) => {
    res.json({"hello": "word"})
});
app.post('/login', (req, res) => {
    console.log("here")
    let user = req.body.login
    let password = req.body.password
    let user_data = login_data.get(user)
    console.log(user_data)
    if (user_data == null) {
        res.send("Not Found")
        return
    }
    
    if (user_data.password == password) {
        req.session.user = user
        console.log(req.session)
        console.log(req.session.id)
        res.json(true)
        return
    }

    res.send("unauthorized")

})

app.get('/userPersonalInfo', (req, res) => {
    console.log(req.session)
    console.log(req.session.user)
    console.log(req.session.id)
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    res.json(login_data.get(req.session.user))
    return
})

app.get('/userInfo', (req, res) => {
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    res.json(UserData.getAllIDsForOwner(req.session.user))
    return
})

app.get('/userInfo/:id', (req, res) => {
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    let b = UserData.getUserDataByID(req.params.id)
    if (b == null) {
        res.status(404).send('UserData not found')
        return
    }
    if(b.owner != req.session.user) {
        res.status(403).send("unauthorized")
        return
    }
    res.json(b)
})

app.post('/userInfo', (req, res) => {
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }


    let b = UserData.create(req.session.user, req.body.userdata)
    if (b == null) {
        res.status(400).send('bad request')
        return
    }
    return res.json(b)
})

app.put('/userInfo/:id', (req, res) => {
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    let b = UserData.getUserDataByID(req.params.id)
    if (b == null) {
        res.status(404).send('UserData not found')
        return
    }
    if(b.owner != req.session.user) {
        res.status(403).send("unauthorized")
        return
    }
    let info = req.body.info
    b.info = info
    b.update()

    res.json(b.id)
})

app.delete('/userInfo/:id', (req, res) => {
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    let b = UserData.getUserDataByID(req.params.id)
    if (b == null) {
        res.status(404).send('UserData not found')
        return
    }
    if(b.owner != req.session.user) {
        res.status(403).send("unauthorized")
        return
    }
    b.delete();
    res.json(true)
})



app.get('/logout', (req, res) => {
    delete req.session.user
    res.json(true)
})




const PORT = process.env.PORT || 3030
console.log(PORT)
app.listen(PORT, () => {
    console.log("running")
})