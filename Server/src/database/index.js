const mongoose = require('mongoose');
const config = require('./config');

import { initializeAirportSearch } from '../services/data/airport';

let client;

export const mongo = {
    connect: async () => {

        if(client) return client;

        client = await mongoose.connect(config.uri, { 
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
            useCreateIndex: true 
        });
        return client;
    },
    disconnect: () => {
        client = null;
        return mongoose.disconnect();
    }
}

mongoose.connection.on('connected',()=>{
    console.log("Connected to DB");

    //Load airports once connected to the Db
    initializeAirportSearch();
});

mongoose.connection.on('error',(err)=>{
    console.log("Error" + err);
});
