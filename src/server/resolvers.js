const resolvers = {
    Query: {
        users: (_, __, { dataSources }) => dataSources.userAPI.users(),
        user: (_, { name, password }, { dataSources }) => dataSources.userAPI.user({ name, password }),
    }
}

export default resolvers;