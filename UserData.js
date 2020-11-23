const data = require('data-store')( {path: process.cwd() + '/data/UserData.json'})


class UserData {

    constructor(id, owner, data) {
        this.id = id
        this.owner = owner
        this.info = info
    }

    update (info) {
        this.info = info
        data.set(this.id.toString(), this)
    }

    delete() {
        data.del(this.id.toString())
    }

}

UserData.getAllIDs = () => {
    return Object.keys(data.data).map((id => {return parseInt(id)}))
}

UserData.getAllIDsForOwner = (owner) => {
    return Object.keys(data.data).filter(id => data.get(id).owner == owner).map((id => {return parseInt(id)}))
}

UserData.getUserDataByID = (id) => {
    let thisData = data.get(id)
    if (thisData == null) {
        return null
    }
    return new UserData(thisData.id, thisData.owner, thisData.info)
}

UserData.next_id = UserData.getAllIDs().reduce((max, next_id) => {
    if (max < next_id) {
        return next_id
    }
    return max
}, - 1) + 1

UserData.create = (owner, info) => {
    let id = UserData.next_id
    UserData.next_id += 1
    let b = new UserData (id, owner, info)
    data.set(b.id.toString(), b)
    return b
}





module.exports = UserData;