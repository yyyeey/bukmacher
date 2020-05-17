import { ObjectID } from 'mongodb';

class UserAPI {
    constructor(db, errorHandler) {
        this.db = db;
        this.errorHandler = errorHandler;
        this.usersCollection = this.db.collection('Users');
    }

    async users() {
        try {
            const dataArr = await this.usersCollection.find({}).toArray();
            return dataArr.map(d => UserAPI.userReducer(d));
        } catch(err) {
            this.errorHandler(err)
            return {};
        }
    }

    async usersCount() {
        try {
            return await this.usersCollection.find({}).count();
        } catch(err) {
            this.errorHandler(err)
            return {};
        }
    }

    async user({ name, password }) {
        try {
            const data = await this.usersCollection.findOne({"$and":[{"name":name},{"password": password}]});
            console.log("UserModel.user",data)

            return UserAPI.userReducer(data);
        } catch(err) {
            this.errorHandler(err)
            return {};
        }
    }

    async findUser({name, password}) {
        const user = await this.usersCollection.findOne({"$and":[{"name":name},{"password": password}]});
        return user ? UserAPI.userReducer(user) : null;
    }

    async createUser({name, password}) {
        try {
            const result = await this.usersCollection.insertOne({name, password});
            return result.result;
        } catch(err) {
            this.errorHandler(err);
            return null;
        }

    }

    async loginUser({ name, password }) {
        try {
            const data = await this.usersCollection.findOne({"$and":[{"name":name},{"password": password}]});
            return data ? Buffer.from(`${name}:${password}`).toString('base64') : null;
        } catch(err) {
            this.errorHandler(err);
            return null;
        }
    }

    static userReducer(user) {
        return {
            id: user && user._id || "0",
            name: user && user.name || "",
            password: user && user.password || "",
            dataIds: user && user.dataIds || [],
        }
    }
}

export default UserAPI;