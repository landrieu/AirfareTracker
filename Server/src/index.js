import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { mongo } from './database/index';
import _ from './services/helpers/date';

import { Email } from './services/email';

const bodyParser = require('body-parser')
const app = express();

const ips = require('./routes/ips');

//Body parser middleware
app.use(bodyParser.json());

//Give access to the public repository
app.use(express.static('public'));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
    // Note! This example uses the `req` object to access headers,
    // but the arguments received by `context` vary by integration.
    // This means they will vary for Express, Koa, Lambda, etc.!
    //
    // To find out the correct arguments for a specific integration,
    // see the `context` option in the API reference for `apollo-server`:
    // https://www.apollographql.com/docs/apollo-server/api/apollo-server/
    const clientIPAddress = req.connection.remoteAddress;
    // Get the user token from the headers.
    const auth = req.headers.authorization || '';
    return {auth, clientIPAddress};
    /*console.log(req.headers);
    // try to retrieve a user with the token
    //const user = getUser(token);

    // add the user to the context
        return { user };*/
    },
});

const startServer = async () => {
    
    server.applyMiddleware({ app });

    //Connection to the database
    try{
        await mongo.connect();
    }catch(err){
        console.log(`Database connection issue: ${err}`);
        return false;
    }

    defineRoutes();
} 

const defineRoutes = () => {
    app.get('/test', (req, res) => {      
        res.json({
            name: 'Bob',
            age: 28
        });
      });
    
    //app.use('/ips', ips);

    app.listen({ port: 4000 }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    )

    app.on('close', () => {
        mongo.disconnect();
    });
}
//deifne project directory
global.__basedir = __dirname;

startServer();