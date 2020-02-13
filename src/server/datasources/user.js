class UserAPI {
    usersList = [
        {
            id: "1",
            name: "user",
            password: "pwd",
            dataIds: [],
        },
        {
            id: "2",
            name: "user2",
            password: "pwd2",
            dataIds: [],
        },
    ];

    async users() {
        return this.usersList;
    }

    async user({ name, password }) {
        return this.usersList.find(e => e.name === name && e.password === password);
    }

    userReducer(user) {
        return {
            id: user.id || "0",
            name: user.name || "",
            password: user.password || "",
            dataIds: user.dataIds || [],
        }
    }
}

export default UserAPI;