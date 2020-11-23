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
    let data = req.body.notes
    UserData.updateData(user, data)
    res.json(true)
    return
})

app.get('/userData', (req, res) => {
    user = req.session.user
    let data = UserData.getUserDataByID(user)
    res.json(data)
    return
}) 


app.post('/userData', (req, res) => {
    user = req.session.user
    data = req.body.notes
    UserData.create(user, data)
    return res.json(true)
})

/*
submits a user's poll results and adds them to the database

takes each position and adds a vote to the selected candidate on the backend JSON object
*/
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

/*
returns all stored poll results

returns the stored JSON object to the front end
*/
app.get('/pollResults', (req, res) => {
    let results = pollData.getPollData()
    res.json(results)
    return
})

/*
updates password

****use this for updating pw in "update account"
*/
app.put('/updatePassword', (req, res) => {
    let user = req.session.user
    let newPass = req.body.password
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    let data = login_data.get(user)
    if (user == null) {
        res.status(404).send('User not found')
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

/*
updates party affiliation of user

after taking the political affiliation quiz, based on their results users will be assigned to
a party (republican/democrat). There is a field within each user object for political affiliation
that will be assigned after this function is called.
*/
app.put('/updateAffiliation', (req, res) => {
    let user = req.session.user
    let pa = req.body.pa
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    let data = login_data.get(user)
    if (user == null) {
        res.status(404).send('User not found')
        return
    }
    if(user != req.session.user) {
        res.status(403).send("unauthorized")
        return
    }
    data.pa = pa
    login_data.set(user, data)

    res.json(true)
    return
})

/*
creates new user account


*/
app.post('/createUser', (req, res) => {
    let user = req.body.login
    let password = req.body.password
    let address = req.body.address
    let city = req.body.city
    let state = req.body.state
    let zip = req.body.zip
    let pa = "Unaffiliated"
    let user_data = login_data.get(user)
    if (user_data != null) {
        res.send("User Already Exists")
        return
    } else {
        let userData = {"password": password,
                        "address": address,
                        "city": city,
                        "state": state,
                        "zip": zip,
                        "pa": pa} 
        login_data.set(user, userData)
        res.json(true)
        return
    }
})

/*
logs user in using their username & password


*/
app.post('/login', (req, res) => {
    let user = req.body.login
    let password = req.body.password
    let user_data = login_data.get(user)
    if (user_data == null) {
        res.send("Not Found")
        return
    }
    
    if (user_data.password == password) {
        req.session.user = user
        res.json(true)
        return
    }

    res.send("unauthorized")

})

app.get('/userPersonalInfo', (req, res) => {
    if(req.session.user == undefined) {
        res.status(403).send("unauthorized")
        return
    }
    res.json(login_data.get(req.session.user))
    return
})

/*
this deletes a user's account

option for user to delete their account when updating their account info
*/
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


/*
logs a user out of the website


*/
app.get('/logout', (req, res) => {
    delete req.session.user
    res.json(true)
})




const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
    console.log("running")
})