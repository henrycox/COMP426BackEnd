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



app.put('/userData', (req, res) => {
    user = req.session.user
    let data = req.body.data
    UserData.updateData(user, data)
    res.json(true)
    return
})

app.get('/userData', (req, res) => {
    user = req.session.user
    let data = userData.getUserDataByID(user)
    res.json(data)
    return
}) 


app.post('/userData', (req, res) => {
    user = req.session.user
    data = req.body.data
    userData.create(user, data)
    return res.json(true)
})

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
    return
})

app.put('/updatePassword', (req, res) => {
    let user = req.session.user
    let newPass = req.body.password
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    let data = login_data.get(user)
    if (user == null) {
        res.status(404).send('UserData not found')
        return
    }
    if(user != req.session.user) {
        res.status(403).send("unauthorized")
        return
    }
    data.password = newPass
    login_data.set(user, data)

    res.json(true)
    return
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


app.delete('/user', (req, res) => {
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    user = req.session.user
    data = login_data.get(user)
    if (data == null) {
        res.status(404).send('UserData not found')
        return
    }
    if(user != req.session.user) {
        res.status(403).send("unauthorized")
        return
    }
    login_data.delete(user)
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