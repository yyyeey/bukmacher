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
        {
            id: "3",
            name: "user3",
            password: "pwd3",
            dataIds: [],
        },
        {
            id: "4",
            name: "user4",
            password: "pwd4",
            dataIds: [],
        },
        {
            id: "5",
            name: "user5",
            password: "pwd5",
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