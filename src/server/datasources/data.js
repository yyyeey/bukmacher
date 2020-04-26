import { ObjectID } from 'mongodb';

class DataAPI {
    constructor(db, errorHandler) {
        this.db = db;
        this.errorHandler = errorHandler;
        this.dataCollection = this.db.collection("Data");
    }

    async data() {
        return null;
    }

    async createUserData() {
        return null;
    }

    getUserData() {
        console.log("data context",this.context)
        return [{_id: 0, text: "textstring", number: 123}];
    }
}

export default DataAPI;