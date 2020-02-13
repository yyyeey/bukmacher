import { ApolloServer } from 'apollo-server';
import typeDefs from './schemas/schema';
import resolvers from './resolvers';

import UserAPI from './datasources/user'

(async function(){
    try {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                userAPI: new UserAPI(),
            })
        });
        const url = await server.listen();
        console.log(`Server is ready at ${url}`);
    } catch (error) {
        console.error(`[SERVER ERROR] ${error}`);
    }
})()
