import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { mongo } from './mongo/index';

const bodyParser = require('body-parser')
const app = express();

const ipMiddleware = (req, res, next) => {
    console.log('ip:', req.ip);
    console.log(req);
    next();
  }

//Body parser middleware
app.use(bodyParser.json());

app.use(ipMiddleware);

//Give access to the public repository
app.use(express.static('public'));

const server = new ApolloServer({
    typeDefs,
    resolvers,
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

    app.listen({ port: 4000 }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    )
}

startServer();