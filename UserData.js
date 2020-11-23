const data = require('data-store')( {path: process.cwd() + '/data/UserData.json'})


class UserData {

    constructor(notes) {
        this.notes = notes
    }

    update (notes) {
        this.notes = notes
        data.set(this.user, this)
    }

    delete() {
        data.del(this.user)
    }

}

UserData.updateData =(user, notes) => {
     data.set(user, notes)
}


UserData.getUserDataByID = (user) => {
    let thisData = data.get(user)
    if (thisData == null) {
        return null
    }
    return new UserData(thisData)
}

UserData.create = (user, notes) => {
    let b = new UserData (notes)
    data.set(user, b)
    return b
}





module.exports = UserData;