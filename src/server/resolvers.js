const paginateResults = ({
    after: cursor,
    pageSize = 2,
    results,
    // can pass in a function to calculate an item's cursor
    getCursor = () => null,
  }) => {
    if (pageSize < 1) return [];
  
    if (!cursor) return results.slice(0, pageSize);
    const cursorIndex = results.findIndex(item => {
      // if an item has a `cursor` on it, use that, otherwise try to generate one
      let itemCursor = item.cursor ? item.cursor : getCursor(item);
  
      // if there's still not a cursor, return false by default
      return itemCursor ? cursor === itemCursor : false;
    });
  
    return cursorIndex >= 0
      ? cursorIndex === results.length - 1 // don't let us overflow
        ? []
        : results.slice(
            cursorIndex + 1,
            Math.min(results.length, cursorIndex + 1 + pageSize),
          )
      : results.slice(0, pageSize);
};

const resolvers = {
    Query: {
        users: async (_, { pageSize = 2, after }, { dataSources }) => {
            const allUsers = await dataSources.userAPI.users();
            console.log("DEBUG", JSON.stringify(allUsers))
            allUsers.reverse();
            const users = paginateResults({
                after,
                pageSize,
                results: allUsers,
            });
            return {
                users,
                cursor: users.length ? users[users.length - 1].cursor : null,
                hasMore: users.length ? users[users.length - 1].cursor !== allUsers[allUsers.length - 1].cursor : false,
            }
        },
        user: (_, { name, password }, { dataSources }) => dataSources.userAPI.user({ name, password }),
    }
}

export default resolvers;