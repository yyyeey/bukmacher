class UserAPI {
    constructor(db, errorHandler) {
        this.db = db;
        this.errorHandler = errorHandler;
        this.usersCollection = this.db.collection('Users');
    }

    async users() {
        // TODO: FIX
        return this.usersList;
    }

    async user({ name, password }) {
        try {
            return await this.usersCollection.findOne({"$and":[{"name":name},{"password": password}]});
        } catch(err) {
            this.errorHandler(err)
            return {};
        }
    }

    userReducer(user) {
        return {
            _id: user._id || "0",
            name: user.name || "",
            password: user.password || "",
            dataIds: user.dataIds || [],
        }
    }
}

export default UserAPI;