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

    async getUserData(userId) {
        console.log("getUserData", userId)
        // TODO: Add Mongo oriented pagination
        const data = await this.dataCollection.find({ownerUserId: userId}).toArray();
        return data[0].data;
    }
}

export default DataAPI;