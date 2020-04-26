import { ApolloServer } from 'apollo-server';
import { MongoClient, ObjectID } from 'mongodb';
import isEmail from 'isemail';

import typeDefs from './schemas/schema';
import resolvers from './resolvers';

import UserAPI from './datasources/user';
import DataAPI from './datasources/data'

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
        context: async ({req}) => {
            console.log("ctx")
            const auth = req.headers && req.headers.authorization || '';
            const [name, password] = Buffer.from(auth, 'base64').toString('ascii').split(':');
            console.log("credentials",name, password)

            const user = await db.collection('Users').findOne({"$and":[{"name":name},{"password": password}]});
            console.log("found user", user)
            return { 
                user: {
                    ...user,
                }
            };
        },
        typeDefs,
        resolvers,
        dataSources: () => ({
            userAPI: new UserAPI(db, handleError),
            dataAPI: new DataAPI(db, handleError),
        })
    });
    return server.listen();
    
}).then((serverInfo, err) => {
    err && handleError(err);

    console.log(`Server is ready at ${serverInfo.url}`);
});