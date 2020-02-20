import { ApolloServer } from 'apollo-server';
import { MongoClient } from 'mongodb';

import typeDefs from './schemas/schema';
import resolvers from './resolvers';

import UserAPI from './datasources/user';

const SERVER_ADDRESS = 'mongodb://localhost:27017';
const DATABASE_NAME = 'testDatabase';
const client = new MongoClient(SERVER_ADDRESS, { useNewUrlParser: true, useUnifiedTopology: true });

process.on('SIGINT', async function() {
    console.log("Caught interrupt signal");
    await client.close()
    console.log("Closed DB connection");
    process.exit();
});

const handleError = function(errMsg) {
    console.error(`[SERVER ERROR] ${errMsg}`);
    console.trace();
}

client.connect().then((client, err) => {
    err && handleError(err.message);

    return client.db(DATABASE_NAME);
}).then((db, err) => {
    err && handleError(err);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            userAPI: new UserAPI(db, handleError),
        })
    });
    return server.listen();
    
}).then((serverInfo, err) => {
    err && handleError(err);

    console.log(`Server is ready at ${serverInfo.url}`);
});