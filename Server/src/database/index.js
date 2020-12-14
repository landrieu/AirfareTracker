const mongoose = require('mongoose');
const config = require('./config');

import { initializeAirportSearch } from '../services/data/airport';

export const mongo = {
    connect: () => {
        /*return new Promise((resolve, reject) => {
            console.log('Connection to the Db');
            resolve('OK');
        });*/

        return mongoose.connect(config.uri, { 
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
            useCreateIndex: true 
        });
    },
    disconnect: () => {
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
