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
      let itemCursor = item.cursor ? item.cursor : getCursor(item, results);
  
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

const getUserCursor = (user, allUsers) => user.id;
const getDataCursor = (data, allData) => allData.indexOf(data);

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
        getUserData: async (_, { after }, { dataSources, user, ...rest }) => {
          const pageSize = 3;
          // temp user obj
          //const user = await dataSources.userAPI.user({name: "testUser", password: "test123"});
          if (user) {
            const allUserData = await dataSources.dataAPI.getUserData(user.id);
            //console.log("allUserData",allUserData)
            const userData = paginateResults({
              after,
              pageSize,
              results: allUserData,
              getCursor: getDataCursor,
            });
            console.log("Resolvers.getUserData userData",userData)
            const cursor = userData[userData.length - 1] ? getDataCursor(userData[userData.length - 1], allUserData) : 0;
            const allDataCursor = allUserData[allUserData.length - 1] ? getDataCursor(allUserData[allUserData.length - 1], allUserData) : 0;
            return {
              ownerUserId: user.id,
              data: userData,
              cursor,
              hasMore: cursor !== allDataCursor,
            };
          }
          return null;
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
        console.log("resolver login",name,password)
        const auth = await dataSources.userAPI.loginUser({name, password});
        return {
          auth: auth,
          message: {
            text: auth ? "Login success" : "Login failure",
            success: !!auth,
          }
        }
      },
      addUserData: async (_, { number, text }, { dataSources, user, ...rest }) => {
        if (user) {
          const data = await dataSources.dataAPI.createUserData(user.id, {number, text});
          return {
            text: data ? 'Added data to user: ' + user.name : 'Data not added',
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