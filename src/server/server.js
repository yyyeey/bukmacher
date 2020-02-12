import { ApolloServer } from 'apollo-server';
import typeDefs from './schemas/schema';

(async function(){
    try {
        const server = new ApolloServer({ typeDefs });
        const url = await server.listen();
        console.log(`Server is ready at ${url}`);
    } catch (error) {
        console.error(`[SERVER ERROR] ${error}`);
    }
})()
