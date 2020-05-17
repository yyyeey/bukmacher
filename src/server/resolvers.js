import { getCircularReplacer } from './utils/helper';

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

const getUserCursor = user => user.id;

const resolvers = {
    Query: {
        users: async (_, { after }, { dataSources }) => {
            const pageSize = 3;
            const allUsers = await dataSources.userAPI.users();

            console.log("DEBUG", JSON.stringify(allUsers, getCircularReplacer()))
            // TODO: fix cursors
            const users = paginateResults({
                after,
                pageSize,
                results: allUsers,
                getCursor: getUserCursor,
            });
            return {
                users,
                cursor: users.length ? users[users.length - 1].cursor : null,
                hasMore: users.length ? users[users.length - 1].cursor !== allUsers[allUsers.length - 1].cursor : false,
            }
        },
        usersCount: (_, __, { dataSources }) =>  dataSources.userAPI.usersCount(),
        user: (_, { name, password }, { dataSources }) => dataSources.userAPI.user({ name, password }),
        getUserData: (_, __, { dataSources, ...rest }) => {
          console.log("DATA", rest)
          return dataSources.dataAPI.getUserData(rest.user.id);
        }
    },
    Mutation: {
      register: async (_, { name, password }, { dataSources }) => {
        const data = await dataSources.userAPI.createUser({name, password});
        return {
          text: data ? "Register success" : "Register failure",
          success: !!data,
        };
      },
      login: async (_, { name, password }, { dataSources }) => {
        console.log("resolver",name,password)
        const auth = await dataSources.userAPI.loginUser({name, password});
        return {
          auth: auth,
          message: {
            text: auth ? "Login success" : "Login failure",
            success: !!auth,
          }
        }
      },
      addUserData: async (_, { number, text }, { dataSources, ...rest }) => {
        console.log("addUserData rest", rest)
        if (rest.user) {
          console.log("Adding user data to ",rest.user.name)
          const data = await dataSources.dataAPI.createUserData(rest.user.id, {number, text});
          console.log("resolver Added Data:",data)
          return {
            text: data ? 'Added data to user: ' + rest.user.name : 'Data not added',
            success: !!data,
          }
        }
        return {
          text: 'Login is required',
          success: false
        }
      },
      alterData: async () => {},
    }
}

export default resolvers;