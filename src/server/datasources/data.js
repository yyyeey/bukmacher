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

    async createUserData(id, {number, text}) {
        console.log("TEXT",text)
        try {
            const result = await this.dataCollection.findOneAndUpdate(
                {ownerUserId: id},
                {
                    $set: { 
                        ownerUserId: id,
                    },
                    $push: {
                        data: {
                            number,
                            text,
                        }
                    },
                },
                {upsert: true},
            );
            console.log("User data insertion result:", result);

            if (!result.ok) {
                return null;
            }

            return result.lastErrorObject.updatedExisting ? result.value._id : result.lastErrorObject.upserted;
        } catch (err) {
            this.errorHandler(err);
            return null;
        }
    }

    getUserData(userId) {
        console.log("data context",this.context)
        return [{_id: 0, text: "textstring", number: 123}];
    }
}

export default DataAPI;