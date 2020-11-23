const data = require('data-store')( {path: process.cwd() + '/data/UserData.json'})


class UserData {

    constructor(data) {
        this.data = data
    }

    update (data) {
        this.data = data
        data.set(this.user, this)
    }

    delete() {
        data.del(this.user)
    }

}

UserData.updateData =(user, data) => {
     data.set(user, data)
}


UserData.getUserDataByID = (user) => {
    let thisData = data.get(user)
    if (thisData == null) {
        return null
    }
    return new UserData(thisData)
}

UserData.create = (user, data) => {
    let b = new UserData (data)
    data.set(user, b)
    return b
}





module.exports = UserData;